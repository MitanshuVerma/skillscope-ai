const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateRoadmap = async (req, res) => {
    try {
        const { targetRole, currentSkills, timeline } = req.body;

        if (!targetRole || !currentSkills || !timeline) {
            return res.status(400).json({ error: 'Missing required fields: targetRole, currentSkills, timeline' });
        }

        const prompt = `You are an expert career counselor. 
The user wants to become a "${targetRole}" in "${timeline}".
Their current skills are: "${currentSkills}".

Generate a month-by-month learning plan or milestones to help them reach this goal.
Even if the user typed the target role with typos, understand the underlying intent (e.g., "soiftware enginr" = "Software Engineer").
Be realistic about what they can achieve in the given timeline.
Return the result strictly as JSON in the following format:
{
  "roadmap": [
    { "month": "Month 1", "description": "Learn X, Y, Z..." },
    { "month": "Month 2", "description": "Build A, B, C..." }
  ]
}
Do not include markdown codeblocks or any extra text outside the JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const rawResponse = response.text;
        // Strip markdown if AI accidentally includes it
        const cleanedText = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanedText);

        res.json({ roadmap: jsonResult.roadmap });
    } catch (error) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({ error: 'Failed to generate roadmap from AI' });
    }
};

module.exports = {
    generateRoadmap
};
