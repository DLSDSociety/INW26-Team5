const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Resume = require('../models/Resume');
const Job = require('../models/Job');

// ── Pre-load pdfjs-dist ONCE at module startup (not on each request) ──────────
let pdfjsLib = null;
(async () => {
  try {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    console.log('[recommendController] pdfjs-dist loaded ✓');
  } catch (e) {
    console.error('[recommendController] Failed to pre-load pdfjs-dist:', e.message);
  }
})();

async function extractTextFromPDF(filePath, maxChars = 3000) {
  if (!pdfjsLib) throw new Error('PDF parser not ready yet.');
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
    if (text.length >= maxChars) break;
  }
  return text.slice(0, maxChars);
}

const recommendJobs = async (req, res) => {
  const startTime = Date.now();
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
    console.log(`[recommend] Extracting PDF text...`);
    const resumeText = await extractTextFromPDF(filePath, 2500);
    console.log(`[recommend] PDF extracted in ${Date.now() - startTime}ms`);

    // 3. Get jobs (limit to 10 latest active jobs to save tokens & latency)
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(10).lean();
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
      Description: ${job.description ? job.description.slice(0, 150) : ''}...`
    )).join('\n\n');

    // 5. Build prompt
    const prompt = `You are a job matching assistant.
Analyze this resume against the job listings and return a match score (0-100) and 1-sentence reason for each job.
Respond ONLY with a valid JSON array, no extra text, no markdown.

RESUME:
${resumeText}

JOB LISTINGS:
${jobList}

JSON format (required):
[
  {
    "jobId": "<jobID>",
    "title": "<title>",
    "company": "<company>",
    "location": "<location>",
    "type": "<type>",
    "score": <0-100>,
    "reason": "<1-sentence explanation>"
  }
]`;

    // Try multiple free models sequentially to robustly bypass upstream rate limits (429s)
    const candidateModels = [
      'meta-llama/llama-3.2-3b-instruct:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-v4-flash:free',
      'google/gemma-4-31b-it:free',
      'openrouter/free'
    ];

    let parsedRecommendations = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        console.log(`[recommend] Attempting match call using model: ${model} at ${Date.now() - startTime}ms`);
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            max_tokens: 800,
          },
          {
            timeout: 15000, // 15 seconds per try
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:5000',
              'X-Title': 'Job Portal AI',
            },
          }
        );

        // -- In-Loop Response Validation --
        const choice = response?.data?.choices?.[0];
        const content = choice?.message?.content;
        
        if (!content) {
          throw new Error('Model returned an empty or null content block.');
        }

        let raw = content.trim();
        raw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

        const jsonStart = raw.indexOf('[');
        const jsonEnd   = raw.lastIndexOf(']');
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error('Model response did not contain a valid JSON array brackets pair.');
        }
        
        raw = raw.slice(jsonStart, jsonEnd + 1);
        parsedRecommendations = JSON.parse(raw);

        console.log(`[recommend] Success with model: ${model} in ${Date.now() - startTime}ms`);
        break; // break loop on success
      } catch (err) {
        console.warn(`[recommend] Model ${model} failed validation: ${err.message}. Trying next candidate...`);
        lastError = err;
      }
    }

    if (!parsedRecommendations) {
      console.warn('[recommend] All candidate AI matching models failed. Returning mock data.');
      parsedRecommendations = jobs.slice(0, 3).map(job => ({
        jobId: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        score: 80,
        reason: "The AI match service is currently overloaded due to high traffic, so this is a placeholder match based on recent listings."
      }));
    }

    // Sort descending by match score
    parsedRecommendations.sort((a, b) => b.score - a.score);

    console.log(`[recommend] Done in ${Date.now() - startTime}ms total`);
    res.json({ count: parsedRecommendations.length, recommendations: parsedRecommendations });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[recommend] Final matching failure after ${elapsed}ms:`, error.message);
    res.status(500).json({ 
      message: 'AI matching service is temporarily busy. Please retry shortly.',
      error: error.message 
    });
  }
};

module.exports = { recommendJobs };