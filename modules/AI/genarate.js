const { response_sender } = require("../hooks/respose_sender");

const generate_job_description = async (req, res, next) => {
      const { jobTitle, skills, jobType, experienceLevel, category, company_info } = req.body

      try {
            // Generate job description
            const jobDescription = generateJobDescription(jobTitle, company_info, jobType, experienceLevel)

            // Generate responsibilities
            const responsibilities = generateResponsibilities(jobTitle, category)

            // Generate qualifications
            // const qualifications = generateQualifications(skills, experienceLevel)

            // Generate benefits
            const benefits = generateBenefits(company_info)

            const generatedContent = {
                  jobDescription,
                  responsibilities,
                  // qualifications,
                  benefits,
            }
            console.log(generatedContent);

            response_sender({
                  res,
                  status_code: 200,
                  error: false,
                  message: "Job description generated successfully",
                  data: generatedContent,
            })
      } catch (error) {
            console.error("Error generating content:", error)
            response_sender({
                  res,
                  status_code: 500,
                  error: true,
                  message: "Could not generate job content",
                  data: null,
            })
      }
}
function generateJobDescription(jobTitle, company_info, jobType, experienceLevel) {
      const industryImpact = getIndustryImpact(company_info.industry)
      const workEnvironment = getWorkEnvironment(jobType)
      const growthOpportunities = getGrowthOpportunities(experienceLevel, company_info)

      return `
    <h2>Exciting Opportunity: ${jobTitle} at ${company_info.name}</h2>

    <p>Are you passionate about making a difference in the ${company_info.industry} industry? Do you thrive in a ${workEnvironment} environment? If so, we have an incredible opportunity for you!</p>

    <p>We are actively seeking a talented and motivated <strong>${jobTitle}</strong> to join our dynamic team at <strong>${company_info.name}</strong>. This <strong>${jobType}</strong> position is perfect for candidates with <strong>${experienceLevel} experience</strong> who are ready to take their career to the next level.</p>

    <h3>Why Join ${company_info.name}?</h3>

    <p>${company_info.name} is at the forefront of innovation in the ${company_info.industry} sector. By joining our team, you'll be part of a forward-thinking organization that values creativity, collaboration, and continuous improvement. We offer:</p>
    <ul>
      <li>A culture of innovation and excellence</li>
      <li>Opportunities for professional development and career advancement</li>
      <li>Work-life balance with our ${jobType} setup</li>
      <li>Competitive compensation and comprehensive benefits package</li>
      <li>The chance to work on projects that make a real impact in the industry</li>
    </ul>

    <h3>Ideal Candidate Profile</h3>

    <p>We're looking for someone who:</p>
    <ul>
      <li>Has ${experienceLevel} experience in ${jobTitle} roles or similar positions</li>
      <li>Possesses a strong passion for ${company_info.industry} and stays updated with industry trends</li>
      <li>Demonstrates excellent problem-solving and analytical skills</li>
      <li>Thrives in a ${workEnvironment} environment and adapts quickly to change</li>
      <li>Communicates effectively and collaborates well with cross-functional teams</li>
    </ul>

    <h3>Growth and Development</h3>

    <p>${growthOpportunities}</p>

    <h3>About ${company_info.name}</h3>

    <p>${company_info.about}</p>

    <p>At ${company_info.name}, we believe that our success is driven by the passion and dedication of our team. We foster an inclusive workplace where diverse ideas are welcomed and innovation is celebrated. Join us in our mission to ${industryImpact} and be part of something truly extraordinary!</p>

    <p>If you're ready to take on new challenges, grow your career, and make a lasting impact in the ${company_info.industry} industry, we want to hear from you. Apply now and let's shape the future together!</p>
  `
}

function getIndustryImpact(industry) {
      const impacts = {
            Technology: "revolutionize the digital landscape and create solutions that shape the future",
            Healthcare: "improve patient outcomes and transform the healthcare experience",
            Finance: "innovate financial services and empower individuals and businesses to achieve their financial goals",
            Education: "transform learning experiences and empower the next generation of leaders",
            Retail: "redefine the shopping experience and set new standards in customer satisfaction",
            Manufacturing: "optimize production processes and drive sustainable manufacturing practices",
            Energy: "develop sustainable energy solutions and contribute to a greener future",
            default: "make a significant impact and drive innovation in our industry",
      }
      return impacts[industry] || impacts.default
}

function getWorkEnvironment(jobType) {
      const environments = {
            "Full-time": "fast-paced and collaborative",
            "Part-time": "flexible and dynamic",
            Remote: "virtual and connected",
            Hybrid: "versatile and adaptive",
            Contract: "project-focused and goal-oriented",
            default: "professional and innovative",
      }
      return environments[jobType] || environments.default
}

function getGrowthOpportunities(experienceLevel, company_info) {
      const opportunities = {
            "Entry-level":
                  `At ${company_info.name}, we believe in nurturing talent from the ground up. As an entry-level professional, you'll have access to mentorship programs, structured training, and hands-on experience that will accelerate your career growth. We're committed to helping you build a strong foundation in the industry and develop the skills needed to become a future leader.`,
            "Mid-level":
                  `For mid-level professionals, ${company_info.name} offers a platform to take your career to new heights. You'll have opportunities to lead projects, mentor junior team members, and expand your expertise through advanced training and cross-functional collaborations. We support your growth with clear career paths and the chance to make significant contributions to our organization.`,
            "Senior":
                  `As a senior professional, you'll play a pivotal role in shaping the direction of ${company_info.name}. We offer executive development programs, leadership opportunities, and the chance to drive strategic initiatives. Your expertise will be valued, and you'll have the platform to make a lasting impact on our company and the industry as a whole.`,
            default:
                  `At ${company_info.name}, we're committed to your professional growth and development. We offer ongoing training, mentorship opportunities, and clear career progression paths to help you achieve your full potential. Whether you're looking to deepen your expertise or explore new areas within the company, we provide the support and resources you need to thrive.`,
      }
      return opportunities[experienceLevel] || opportunities.default
}


function generateResponsibilities(jobTitle, category) {
      const commonResponsibilities = [
            "Collaborate with cross-functional teams to achieve project goals.",
            "Contribute to the development and implementation of best practices.",
            "Participate in regular team meetings and provide status updates.",
            "Stay up-to-date with industry trends and emerging technologies.",
            "Mentor junior team members and provide guidance when needed.",
            "Ensure adherence to company policies and industry standards.",
            "Identify and propose innovative solutions to improve processes.",
            "Manage project timelines and deliverables effectively.",
            "Communicate project progress and challenges to stakeholders.",
            "Continuously improve skills and knowledge in relevant areas.",
      ]

      const specificResponsibilities = {
            "Software Development": [
                  `Develop and maintain high-quality <strong>${jobTitle}</strong> solutions.`,
                  "Write clean, efficient, and well-documented code.",
                  "Perform code reviews and provide constructive feedback.",
                  "Troubleshoot and optimize application performance.",
                  "Participate in the full software development lifecycle, from concept to deployment.",
                  "Implement and maintain security measures to protect sensitive data.",
                  "Collaborate with UX/UI designers to create intuitive user interfaces.",
                  "Integrate third-party APIs and services as needed.",
                  "Conduct unit testing and participate in integration testing.",
                  "Contribute to technical documentation and user guides.",
                  "Implement scalable and maintainable software architectures.",
                  "Optimize database queries and data structures for improved performance.",
            ],
            Marketing: [
                  "Develop and execute marketing strategies to enhance brand visibility.",
                  "Analyze market trends and competitor activities.",
                  "Create compelling content for various marketing channels.",
                  "Manage social media platforms and engage with audiences.",
                  "Plan and execute email marketing campaigns.",
                  "Collaborate with the design team to create visually appealing marketing materials.",
                  "Monitor and report on key performance indicators (KPIs) for marketing initiatives.",
                  "Conduct market research to identify new opportunities and target audiences.",
                  "Optimize website content for search engine optimization (SEO).",
                  "Manage relationships with external vendors and agencies.",
                  "Develop and manage marketing budgets.",
                  "Create and deliver persuasive presentations to stakeholders.",
            ],
      }

      const allResponsibilities = [...(specificResponsibilities[category] || []), ...commonResponsibilities].slice(0, 15) // Ensure we have at least 10 responsibilities, but cap at 15

      return `
    <ul>
      ${allResponsibilities.map((res) => `<li>${res}</li>`).join("")}
    </ul>
  `
}

function generateBenefits(company_info) {
      const commonBenefits = [
            "Competitive salary based on experience and skills.",
            "Comprehensive health, dental, and vision insurance.",
            "401(k) retirement plan with company match.",
            "Generous paid time off, including vacation days and personal days.",
            "Flexible work hours and remote work opportunities.",
            "Professional development and training programs.",
            "Career growth opportunities and clear advancement paths.",
            "Employee assistance program for mental health and well-being.",
            "Company-sponsored team building events and social activities.",
            "Modern, ergonomic work environment with state-of-the-art equipment.",
            "Commuter benefits or transportation allowance.",
            "Parental leave for both primary and secondary caregivers.",
            "Employee discount programs with partner companies.",
            "Volunteer time off for community service activities.",
            "Recognition and rewards program for outstanding performance.",
            "Gym membership or wellness program reimbursement.",
            "Annual performance bonuses and profit-sharing opportunities.",
            "Tuition reimbursement for relevant courses and certifications.",
      ]

      const additionalBenefits = company_info.benefits || []
      const allBenefits = [...commonBenefits, ...additionalBenefits].slice(0, 15) // Ensure we have at least 10 benefits, but cap at 15

      return `
    <ul>
      ${allBenefits.map((benefit) => `<li>${benefit}</li>`).join("")}
    </ul>
  `
}


module.exports = { generate_job_description }
