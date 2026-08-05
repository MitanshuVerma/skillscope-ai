const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Cache responses to prevent burning API quota on every page load
let marketStatusCache = null;
let marketStatusCacheTime = 0;

let trendingJobsCache = null;
let trendingJobsCacheTime = 0;

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const getMarketStatus = async (req, res) => {
    try {
        if (marketStatusCache && (Date.now() - marketStatusCacheTime < CACHE_DURATION)) {
            return res.json(marketStatusCache);
        }

        const prompt = `Act as an expert technical recruiter and labor market analyst. 
Generate current, realistic global market statistics for the tech industry (Software Engineering, Data, Product, AI).
Return the result strictly as JSON in the following format, with no markdown codeblocks or extra text:
{
  "activeOpenings": "e.g., 148,920",
  "companiesHiring": "e.g., 12,450",
  "averageBaseSalary": "e.g., $115,000",
  "remoteWorkPercentage": "e.g., 42%",
  "categories": [
    { "category": "Software Engineering", "percent": 35, "count": 52000 },
    { "category": "Data Science", "percent": 25, "count": 37000 },
    { "category": "Design / UX", "percent": 15, "count": 22000 },
    { "category": "Product Management", "percent": 15, "count": 22000 },
    { "category": "Marketing", "percent": 10, "count": 15000 }
  ]
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const rawResponse = response.text;
        const cleanedText = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanedText);

        marketStatusCache = jsonResult;
        marketStatusCacheTime = Date.now();

        res.json(jsonResult);
    } catch (error) {
        console.error('Error generating market status:', error);
        res.status(500).json({ error: 'Failed to generate market status' });
    }
};

const getTrendingJobs = async (req, res) => {
    try {
        if (trendingJobsCache && (Date.now() - trendingJobsCacheTime < CACHE_DURATION)) {
            return res.json(trendingJobsCache);
        }

        const prompt = `Act as an expert technical recruiter and labor market analyst. 
Identify 5 of the most trending jobs in the tech/data/AI industry right now.
For each, provide the title, current demand level (e.g., "Very High", "High"), a realistic average salary range, and an array of 3 top skills required.
Return the result strictly as JSON in the following format, with no markdown codeblocks or extra text:
{
  "trendingJobs": [
    {
      "title": "AI Engineer",
      "demand": "Very High",
      "salary": "$130k - $180k",
      "skills": ["Python", "PyTorch", "LLMs"]
    }
  ]
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const rawResponse = response.text;
        const cleanedText = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanedText);

        trendingJobsCache = jsonResult;
        trendingJobsCacheTime = Date.now();

        res.json(jsonResult);
    } catch (error) {
        console.error('Error generating trending jobs:', error);
        res.status(500).json({ error: 'Failed to generate trending jobs' });
    }
};

module.exports = {
    getMarketStatus,
    getTrendingJobs
};
