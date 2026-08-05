const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getInsights = async (req, res) => {
    try {
        const { userSkills, jobs } = req.body;

        if (!userSkills || !jobs) {
            return res.status(400).json({ error: 'userSkills and jobs are required' });
        }

        // We use Gemini to analyze the gap and create a roadmap
        const prompt = `
        A user has the following skills:
        ${JSON.stringify(userSkills)}

        They are targeting the following job descriptions:
        ${JSON.stringify(jobs.map(j => j.description || j.title))}

        Based on this, please provide:
        1. A list of missing skills (skills they don't have but are common in these jobs).
        2. A list of trending skills in this field.
        3. A short, step-by-step learning roadmap to acquire the most critical missing skills.

        Return ONLY a valid JSON object matching this schema:
        {
            "missingSkills": ["string"],
            "trendingSkills": ["string"],
            "learningRoadmap": [
                { "step": 1, "title": "string", "description": "string" }
            ]
        }
        Do not include markdown or other text.
        `;

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

        const insightsStr = response.text;
        const insights = JSON.parse(insightsStr);

        res.json(insights);
    } catch (error) {
        console.error('Error getting insights:', error);
        
        let errorMsg = 'Failed to generate insights';
        
        if (error.status === 429) {
            errorMsg = "AI rate limit reached. Please wait about a minute before trying again.";
        } else if (error.message) {
            try {
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
    getInsights
};
