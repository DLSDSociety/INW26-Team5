const path = require('path');
const fs   = require('fs');
const axios = require('axios');
const Resume = require('../models/Resume');

// ── Pre-load pdfjs-dist ONCE at module startup (not on each request) ──────────
let pdfjsLib = null;
(async () => {
  try {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    console.log('[resumeController] pdfjs-dist loaded ✓');
  } catch (e) {
    console.error('[resumeController] Failed to pre-load pdfjs-dist:', e.message);
  }
})();

// ── Helper: extract plain text from a PDF file path ──────────────────────────
async function extractPdfText(filePath, maxChars = 4000) {
  if (!pdfjsLib) throw new Error('PDF parser not ready yet.');
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc  = await pdfjsLib.getDocument({ data }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page    = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
    if (text.length >= maxChars) break;          // stop early once we have enough
  }
  return text.slice(0, maxChars);
}

// @route POST /api/resume/upload  [seeker only]
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const existing = await Resume.findOne({ userId: req.user.id });
    if (existing) {
      if (fs.existsSync(existing.filePath)) fs.unlinkSync(existing.filePath);
      await existing.deleteOne();
    }

    const resume = await Resume.create({
      userId:       req.user.id,
      userName:     req.user.name,
      originalName: req.file.originalname,
      fileName:     req.file.filename,
      filePath:     req.file.path,
      fileSize:     req.file.size,
      mimeType:     req.file.mimetype,
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id:           resume._id,
        originalName: resume.originalName,
        fileSize:     resume.fileSize,
        uploadedAt:   resume.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/resume/me  [seeker only]
const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'No resume found' });

    res.json({
      id:           resume._id,
      originalName: resume.originalName,
      fileSize:     resume.fileSize,
      uploadedAt:   resume.uploadedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/resume/download/:userId  [employer/admin only]
const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const filePath = path.resolve(resume.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, resume.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route DELETE /api/resume/me  [seeker only]
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'No resume found' });

    if (fs.existsSync(resume.filePath)) fs.unlinkSync(resume.filePath);
    await resume.deleteOne();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route GET /api/resume/analyze  [seeker only]
const analyzeResume = async (req, res) => {
  const startTime = Date.now();
  try {
    // 1. Find resume record
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Please upload your resume first.' });

    const filePath = path.resolve(resume.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found on server.' });
    }

    // 2. Extract PDF text
    console.log(`[analyze] Extracting PDF text...`);
    const resumeText = await extractPdfText(filePath, 3000);
    console.log(`[analyze] PDF extracted in ${Date.now() - startTime}ms (${resumeText.length} chars)`);

    // 3. Build a compact prompt
    const prompt = `You are an ATS resume scanner and career coach.

Analyze this resume and respond ONLY with a valid JSON object — no markdown, no extra text.

RESUME:
${resumeText}

JSON format (required):
{
  "score": <0-100>,
  "grade": "<A/B/C/D/F>",
  "summary": "<1-2 sentence overall assessment>",
  "strengths": ["<point 1>", "<point 2>", "<point 3>"],
  "weaknesses": ["<point 1>", "<point 2>", "<point 3>"],
  "ats_tips": ["<tip 1>", "<tip 2>"]
}`;

    // 4. Try multiple high-availability free tier models in sequence to bypass provider-level 429s/timeouts
    const candidateModels = [
      'meta-llama/llama-3.2-3b-instruct:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-v4-flash:free',
      'google/gemma-4-31b-it:free',
      'openrouter/free'
    ];

    let parsedAnalysis = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        console.log(`[analyze] Attempting to call OpenRouter using model: ${model} at ${Date.now() - startTime}ms`);
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            max_tokens: 512,
          },
          {
            timeout: 15000, // 15 seconds per model try
            headers: {
              Authorization:  `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:5000',
              'X-Title':      'Job Portal Resume Analyzer',
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

        const jsonStart = raw.indexOf('{');
        const jsonEnd   = raw.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error('Model response did not contain a valid JSON braces pair.');
        }
        
        raw = raw.slice(jsonStart, jsonEnd + 1);
        parsedAnalysis = JSON.parse(raw);

        console.log(`[analyze] Success with model: ${model} in ${Date.now() - startTime}ms`);
        break; // Successfully got and parsed response, break out of loop!
      } catch (err) {
        console.warn(`[analyze] Model ${model} failed validation: ${err.message}. Trying next candidate...`);
        lastError = err;
      }
    }

    if (!parsedAnalysis) {
      console.warn('[analyze] All AI models failed due to high traffic. Returning mock data.');
      parsedAnalysis = {
        score: 75,
        grade: "C",
        summary: "The AI service is currently experiencing extreme traffic, so this is a placeholder response. However, your resume was successfully extracted.",
        strengths: [
          "Successfully parsed your resume.",
          "Clear document structure detected."
        ],
        weaknesses: [
          "AI servers are too busy to provide deep analysis right now.",
          "Please try again in a few minutes for real AI feedback."
        ],
        ats_tips: [
          "Ensure your contact information is at the very top.",
          "Use standard fonts to ensure ATS systems can read it easily."
        ]
      };
    }

    console.log(`[analyze] Done in ${Date.now() - startTime}ms total`);
    res.json({ analysis: parsedAnalysis });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[analyze] Final failure after ${elapsed}ms:`, error.message);
    res.status(500).json({
      message: 'AI service is temporarily busy or rate-limited. Please retry shortly.',
      error: error.message,
    });
  }
};

module.exports = { uploadResume, getMyResume, downloadResume, deleteResume, analyzeResume };
