const axios = require('axios');

const getJobs = async (req, res) => {
    try {
        console.log('--- Incoming /api/jobs request ---');
        console.log('Body:', req.body);
        const { skills, query, location = 'us' } = req.body;
        
        let searchQuery = query || '';

        // If skills are provided, append them to the search query to improve relevance
        if (skills && Array.isArray(skills) && skills.length > 0) {
            const skillQuery = skills.slice(0, 3).join(' ');
            searchQuery = searchQuery ? `${searchQuery} ${skillQuery}` : skillQuery;
        }

        if (!searchQuery) {
            searchQuery = 'Software Engineer';
        }

        if (location && location !== 'us') {
            searchQuery = `${searchQuery} in ${location}`;
        } else if (location === 'us' && !searchQuery.toLowerCase().includes(' in ')) {
            searchQuery = `${searchQuery} in USA`;
        }

        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search-v2',
            params: {
                query: searchQuery,
                page: '1',
                num_pages: '1'
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'e8658a4833msh27b2b2d4b41dbefp139513jsna2f4a56ebc2e',
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        let jobs = response.data.data ? response.data.data : [];
        
        // JSearch returns results inside response.data.data (if array) or response.data.data.jobs (if object)
        // Wait, looking at the log: res.data = { status, data: { jobs: [] } }
        // Wait, no, res.data.data could be an array? No, the log said res.data.data has a `jobs` property.
        if (!Array.isArray(jobs)) {
            if (jobs.jobs && Array.isArray(jobs.jobs)) {
                jobs = jobs.jobs;
            } else {
                jobs = Object.values(jobs).filter(Array.isArray)[0] || [];
            }
        }

        // Format to match existing UI
        const formattedJobs = jobs.slice(0, 10).map(job => ({
            id: job.job_id,
            title: job.job_title,
            company_name: job.employer_name,
            candidate_required_location: job.job_city ? `${job.job_city}, ${job.job_state || ''}, ${job.job_country || ''}` : (job.job_country || 'Remote'),
            description: job.job_description,
            salary: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary || job.job_min_salary}` : null,
            url: job.job_apply_link,
            tags: [job.job_employment_type, job.job_is_remote ? 'Remote' : ''].filter(Boolean),
            job_type: job.job_employment_type || '',
            company: { display_name: job.employer_name },
            location: { display_name: job.job_country || 'Remote' },
            salary_max: job.job_max_salary || null
        }));

        res.json({ jobs: formattedJobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

module.exports = {
    getJobs
};
