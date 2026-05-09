const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
console.log("API KEY:", process.env.OPENROUTER_API_KEY);

async function extractTextFromPDF(filePath) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text.slice(0, 3000);
}

const recommendJobs = async (req, res) => {
  try {
    // 1. Get seeker's resume
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Please upload your resume first' });
    }

    // 2. Extract text from PDF
    const filePath = path.resolve(resume.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found on server' });
    }
    const resumeText = await extractTextFromPDF(filePath);

    // 3. Get all jobs
    const jobs = await Job.find().lean();
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs available to match' });
    }

    // 4. Build job list for prompt
    const jobList = jobs.map((job, i) => (
      `Job ${i + 1}:
      ID: ${job._id}
      Title: ${job.title}
      Company: ${job.company}
      Location: ${job.location}
      Type: ${job.type}
      Description: ${job.description}`
    )).join('\n\n');

    // 5. Call OpenRouter AI
    const prompt = `
You are an expert career counselor and job matching AI.

Analyze the following resume and job listings. For each job, provide a match score (0-100) and a brief reason.

RESUME:
${resumeText}

JOB LISTINGS:
${jobList}

Respond ONLY with a valid JSON array, no extra text, no markdown, no explanation. Format:
[
  {
    "jobId": "<job _id>",
    "title": "<job title>",
    "company": "<company name>",
    "location": "<location>",
    "type": "<job type>",
    "score": <0-100>,
    "reason": "<2 sentence explanation of why this job matches or doesn't match>"
  }
]

Sort by score descending. Include ALL jobs.
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/free',  
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Job Portal AI',
        },
      }
    );
    // 6. Parse AI response
    let raw = response.data.choices[0].message.content;
    raw = raw.replace(/```json|```/g, '').trim();
    const recommendations = JSON.parse(raw);

    res.json({ count: recommendations.length, recommendations });

  } catch (error) {
    console.error('Recommendation error:', error.message);
    if (error.response) {
      console.error('OpenRouter status:', error.response.status);
      console.error('OpenRouter body:', JSON.stringify(error.response.data));
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { recommendJobs };