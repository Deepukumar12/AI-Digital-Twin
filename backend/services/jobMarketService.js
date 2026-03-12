const axios = require('axios');

/**
 * Service to fetch and analyze job market data from Adzuna API.
 */
class JobMarketService {
    /**
     * Get job market insights for a specific role
     * @param {string} role - The job title to search for
     * @param {string} country - ISO 3166-1 alpha-2 country code (default 'in')
     * @param {string} location - Specific city or state
     * @param {string} experience - Experience string from the frontend filter
     * @returns {Object} Job market insights including average salary, demand level, and top companies
     */
    async getInsightsByRole(role, country = 'in', location = '', experience = 'all') {
        try {
            const appId = process.env.ADZUNA_APP_ID;
            const appKey = process.env.ADZUNA_APP_KEY;

            if (!appId || !appKey) {
                const error = new Error('Adzuna API credentials not configured');
                error.status = 500;
                throw error;
            }

            // Map experience to search terms for Adzuna
            let searchQuery = role;
            let orTerms = '';

            if (experience && experience !== 'all') {
                const expLower = experience.toLowerCase();
                if (expLower.includes('0 years') || expLower.includes('0–1')) {
                    orTerms = 'fresher graduate "entry level" junior';
                } else if (expLower.includes('1–2') || expLower.includes('2–5')) {
                    orTerms = 'junior "mid level" associate';
                } else if (expLower.includes('5–8') || expLower.includes('7–10')) {
                    orTerms = 'senior lead staff';
                } else if (expLower.includes('8–12') || expLower.includes('10–15') || expLower.includes('15+')) {
                    orTerms = 'principal architect director head vp';
                }
            }

            const params = {
                app_id: appId,
                app_key: appKey,
                what: searchQuery,
                results_per_page: 50 // Fetch a good sample size for averages
            };

            if (orTerms) {
                params.what_or = orTerms;
            }

            if (location && location.trim() !== '') {
                params.where = location;
            }

            // Call Adzuna API to fetch job listings for the given role and country
            const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/${country.toLowerCase()}/search/1`, { params });


            const jobs = response.data.results;
            const totalJobs = response.data.count;

            if (!jobs || jobs.length === 0) {
                return {
                    role: role,
                    average_salary: 0,
                    demand_level: "Low",
                    top_companies: [],
                    job_count: 0
                };
            }

            // Compute Average Salary
            let totalSalarySum = 0;
            let jobsWithSalaryInfo = 0;

            jobs.forEach(job => {
                // Not all job postings include salary data
                if (job.salary_min && job.salary_max) {
                    totalSalarySum += (job.salary_min + job.salary_max) / 2;
                    jobsWithSalaryInfo++;
                }
            });

            const averageSalary = jobsWithSalaryInfo > 0
                ? Math.round(totalSalarySum / jobsWithSalaryInfo)
                : 0;

            // Determine Demand Level based on total job count in the market (not just the fetched page)
            let demandLevel = "Low";
            if (totalJobs > 200) {
                demandLevel = "High";
            } else if (totalJobs >= 50) {
                demandLevel = "Medium";
            }

            // Extract Top Companies from the fetched results
            const companyCounts = {};
            jobs.forEach(job => {
                if (job.company && job.company.display_name) {
                    const companyName = job.company.display_name;
                    companyCounts[companyName] = (companyCounts[companyName] || 0) + 1;
                }
            });

            const topCompanies = Object.entries(companyCounts)
                .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
                .slice(0, 3)                 // Get top 3
                .map(entry => entry[0]);     // Extract company names

            // Extract Sample Jobs
            const sampleJobs = jobs.map(j => ({
                title: j.title,
                company: j.company?.display_name || 'Unknown',
                location: j.location?.display_name || location || country.toUpperCase(),
                url: j.redirect_url || '#'
            }));

            // Extract Top Skills (Basic Keyword Matching)
            const SKILL_KEYWORDS = ['React', 'Node', 'Python', 'AWS', 'Java', 'SQL', 'Docker', 'Kubernetes', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Azure', 'GCP', 'MongoDB', 'Postgres', 'Redux', 'Vue', 'Angular', 'Excel', 'Tableau', 'Power BI', 'Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'Rust', 'Go', 'Linux'];
            const skillCounts = {};
            jobs.forEach(job => {
                const text = (job.title + " " + (job.description || '')).toLowerCase();
                SKILL_KEYWORDS.forEach(skill => {
                    if (text.includes(skill.toLowerCase())) {
                        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                    }
                });
            });
            let topSkills = Object.entries(skillCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(entry => entry[0]);

            // Fallback if no skills found in keywords
            if (topSkills.length === 0) topSkills = ['Communication', 'Problem Solving', 'Management'];

            return {
                role: role,
                average_salary: averageSalary,
                demand_level: demandLevel,
                top_companies: topCompanies,
                job_count: totalJobs,
                topSkills: topSkills,
                sampleJobs: sampleJobs
            };

        } catch (error) {
            console.error('[JobMarketService] Error fetching data from Adzuna:', error.message);

            // Handle specific axios errors
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const status = error.response.status;
                if (status === 401 || status === 403) {
                    const authError = new Error('Invalid or unauthorized Adzuna API credentials');
                    authError.status = 500; // Internal server configuration error
                    throw authError;
                }
                if (status === 429) {
                    const rateLimitError = new Error('Adzuna API rate limit exceeded');
                    rateLimitError.status = 429;
                    throw rateLimitError;
                }
            }

            throw error; // Re-throw other errors to be handled by the controller
        }
    }
}

module.exports = new JobMarketService();
