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

const defaultMarketStatus = {
    activeOpenings: "285,400",
    companiesHiring: "24,800",
    averageBaseSalary: "$128,500",
    remoteWorkPercentage: "48%",
    categories: [
        { category: "Software Engineering", percent: 42, count: 119868 },
        { category: "AI & Machine Learning", percent: 22, count: 62788 },
        { category: "Data & Analytics", percent: 16, count: 45664 },
        { category: "Product Management", percent: 12, count: 34248 },
        { category: "Design / UX", percent: 8, count: 22832 }
    ]
};

const defaultTrendingJobs = {
    trendingJobs: [
        {
            title: "AI/ML Engineer",
            demand: "Very High",
            salary: "$140,000 - $210,000",
            skills: ["Python", "PyTorch", "Large Language Models (LLMs)"]
        },
        {
            title: "MLOps Engineer",
            demand: "Very High",
            salary: "$135,000 - $195,000",
            skills: ["Kubernetes", "Docker", "CI/CD Pipelines"]
        },
        {
            title: "Data Engineer",
            demand: "High",
            salary: "$120,000 - $175,000",
            skills: ["SQL", "Apache Spark", "Snowflake"]
        },
        {
            title: "Full-Stack AI Developer",
            demand: "Very High",
            salary: "$130,000 - $185,000",
            skills: ["TypeScript", "Next.js", "LangChain"]
        },
        {
            title: "Cloud Solutions Architect",
            demand: "High",
            salary: "$150,000 - $220,000",
            skills: ["AWS", "Terraform", "Distributed Systems"]
        }
    ]
};

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
            model: 'gemini-3.5-flash',
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

        return res.json(jsonResult);
    } catch (error) {
        console.error('Error generating market status, falling back to default data:', error.message);
        return res.json(marketStatusCache || defaultMarketStatus);
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
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const rawResponse = response.text;
        const cleanedText = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonResult = JSON.parse(cleanedText);

        if (jsonResult && jsonResult.trendingJobs && Array.isArray(jsonResult.trendingJobs)) {
            trendingJobsCache = jsonResult;
            trendingJobsCacheTime = Date.now();
            return res.json(jsonResult);
        } else {
            throw new Error("Invalid structure returned by AI");
        }
    } catch (error) {
        console.error('Error generating trending jobs, falling back to default data:', error.message);
        return res.json(trendingJobsCache || defaultTrendingJobs);
    }
};

module.exports = {
    getMarketStatus,
    getTrendingJobs
};
