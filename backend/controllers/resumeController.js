const pdf = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
const User = require('../models/User');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const extractSkills = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extract text from PDF
        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text;
        console.log("DEBUG: Extracted text preview:", resumeText.substring(0, 100));

        // Prompt Gemini to extract skills
        const prompt = `Extract a concise list of professional skills (both hard and soft) from the following resume text. Return ONLY a JSON array of strings. No other text.
        
Resume:
${resumeText}`;

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
            return res.status(400).json({ error: 'Gemini API key is not configured in backend.' });
        }


        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const skillsStr = response.text;
        const skills = JSON.parse(skillsStr);

        // If user is logged in, save the skills to their profile
        if (req.user) {
            await User.findByIdAndUpdate(req.user.id, { $set: { skills } }, { new: true });
        }

        res.json({ skills });
    } catch (error) {
        console.error('Error extracting skills:', error);
        
        let errorMsg = 'Failed to extract skills';
        
        if (error.status === 429) {
            errorMsg = "AI rate limit reached. Please wait about a minute before trying again.";
        } else if (error.message) {
            try {
                // Sometimes the API wraps it in a JSON string
                const parsed = JSON.parse(error.message);
                if (parsed.error && parsed.error.message) {
                    errorMsg = parsed.error.message;
                } else {
                    errorMsg = error.message;
                }
            } catch (e) {
                errorMsg = error.message;
            }
        }
        
        res.status(500).json({ error: errorMsg });
    }
};

module.exports = {
    extractSkills
};
