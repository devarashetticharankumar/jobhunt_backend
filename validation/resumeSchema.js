const Joi = require("joi");

const resumeSchema = Joi.object({
  // Unique ID for the resume
  id: Joi.string().uuid().optional(),

  // Personal Information
  personalInfo: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\+\d{1,3}\s?\d{1,14}$/)
      .optional(),
    location: Joi.string().min(2).max(100).optional(),
    websites: Joi.array().items(Joi.string().uri()).optional(),
    socialLinks: Joi.object({
      linkedin: Joi.string().uri().optional(),
      facebook: Joi.string().uri().optional(),
      twitter: Joi.string().uri().optional(),
      instagram: Joi.string().uri().optional(),
      github: Joi.string().uri().optional(),
      personalWebsite: Joi.string().uri().optional(),
    }).optional(),
  }).required(),

  // Professional Summary (Optional)
  professionalSummary: Joi.string()
    .custom((value, helpers) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 10 || wordCount > 100) {
        return helpers.error("string.base", {
          message: "Must be between 10 and 100 words",
        });
      }
      return value;
    })
    .optional(),

  // Wanted Job Title (Optional)
  wantedJobTitle: Joi.string().min(2).max(500).optional(),

  // Work Experience (Array of Job Objects)
  workExperience: Joi.array()
    .items(
      Joi.object({
        jobTitle: Joi.string().min(2).max(500).required(),
        companyName: Joi.string().min(2).max(300).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
        description: Joi.string().min(10).max(500).optional(),
        skillsUsed: Joi.array().items(Joi.string().min(2).max(50)).optional(),
      })
    )
    .optional(),

  // Education (Array of Education Objects)
  education: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().min(2).max(300).required(),
        institutionName: Joi.string().min(2).max(300).required(),
        graduationDate: Joi.date().max("now").required(),
        coursework: Joi.array().items(Joi.string().min(2).max(100)).optional(),
      })
    )
    .optional(),

  // Skills (Array of Strings)
  skills: Joi.array().items(Joi.string().min(2).max(50)).optional(),

  // Certifications (Array of Objects)
  certifications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(2).max(200).required(),
        organization: Joi.string().min(2).max(200).required(),
        date: Joi.date().max("now").required(),
      })
    )
    .optional(),

  // Projects (Array of Objects)
  projects: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(10).max(500).optional(),
        technologies: Joi.array().items(Joi.string().min(2).max(50)).optional(),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
        projectLink: Joi.string().uri().optional(),
      })
    )
    .optional(),

  // Languages (Array of Strings)
  languages: Joi.array().items(Joi.string().min(2).max(50)).optional(),

  // References (Array of Objects)
  references: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(2).max(100).required(),
        relationship: Joi.string().min(2).max(50).optional(),
        contact: Joi.string()
          .pattern(/^\+\d{1,3}\s?\d{1,14}$/)
          .optional(),
      })
    )
    .optional(),

  // Internships (Array of Objects)
  internships: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().min(2).max(100).required(),
        company: Joi.string().min(2).max(100).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
        description: Joi.string().min(10).max(500).optional(),
      })
    )
    .optional(),

  // Acknowledgment (Optional - String)
  acknowledgment: Joi.string().min(10).max(300).optional(),

  // Last Modified Date
  lastModified: Joi.date().default(Date.now),
});

module.exports = resumeSchema;
