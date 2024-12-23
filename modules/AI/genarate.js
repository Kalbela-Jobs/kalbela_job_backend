const { default: axios } = require("axios");
const { response_sender } = require("../hooks/respose_sender");

const OPENAI_API_KEY = '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';
const openaiEndpoint = 'https://api.openai.com/v1/completions';

const generate_job_description = async (req, res, next) => {

      const { jobTitle, skills, companyName } = req.body;
      const prompt = `Create a detailed job description and requirements for a position titled "${jobTitle}" at "${companyName}". Skills required: ${skills.join(", ")}. Provide the description and requirements in a professional format.`;


      try {
            // const response = await axios.post(openaiEndpoint, {
            //       model: 'gpt-4',
            //       prompt: prompt,
            //       max_tokens: 500,
            //       temperature: 0.7,
            // }, {
            //       headers: {
            //             'Authorization': `Bearer ${OPENAI_API_KEY}`,
            //             'Content-Type': 'application/json',
            //       },
            // });
            const response = {
                  data: {
                        choices: [
                              {
                                    text: `
Job Title: Fullstack Developer
Company: Bright Future Soft

About Bright Future Soft:
Bright Future Soft is a forward-thinking startup dedicated to shaping the future of the Bangladeshi software industry. Our mission is to provide innovative solutions for businesses and address key challenges in collaboration with the government of Bangladesh. Join us to be a part of this impactful journey!

Job Description:
We are seeking a talented and motivated Fullstack Developer to join our dynamic team. In this role, you will design, develop, and maintain scalable web applications and services. As a Fullstack Developer, you will work closely with cross-functional teams to deliver high-quality software solutions that meet user needs and business objectives.

Responsibilities:
- Design and develop responsive and user-friendly web applications using React.
- Build and maintain server-side applications using Node.js and Express.js.
- Develop robust and efficient database solutions with MongoDB.
- Collaborate with UI/UX designers, product managers, and other developers to ensure seamless application functionality.
- Write clean, maintainable, and well-documented code.
- Debug and resolve technical issues across the stack.
- Optimize applications for speed and scalability.
- Stay up-to-date with emerging technologies and industry trends.

Requirements:
- Proven experience as a Fullstack Developer or similar role.
- Proficiency in React, Node.js, Express.js, and MongoDB.
- Strong understanding of front-end technologies including HTML, CSS, and JavaScript.
- Knowledge of RESTful APIs and asynchronous request handling.
- Experience with version control systems like Git.
- Ability to work independently as well as collaboratively in a team environment.
- Excellent problem-solving skills and attention to detail.
- Familiarity with Agile development methodologies is a plus.

Preferred Qualifications:
- Experience with cloud services (e.g., AWS, Azure, Google Cloud).
- Knowledge of TypeScript or similar frameworks.
- Exposure to DevOps practices like CI/CD pipelines.

What We Offer:
- A collaborative and innovative work environment.
- Opportunities to grow and make a meaningful impact.
- Competitive salary and benefits package.
- Flexible work hours and remote working options.

How to Apply:
Send your updated resume and portfolio to info@brightfuturesoft.com with the subject line "Fullstack Developer Application - [Your Name]". Bright Future Soft is an equal opportunity employer.
        `,
                              },
                        ],
                  },
            };


            const jobDescription = response.data.choices[0].text;
            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job description generated successfully",
                  data: jobDescription,
            });
      } catch (error) {
            console.error('Error generating content:', error);
            throw new Error('Could not generate job content');
      }
}


module.exports = { generate_job_description };
