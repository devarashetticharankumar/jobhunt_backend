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
      .optional(),
    location: Joi.string().min(2).max(500).optional(),
    websites: Joi.array().items(Joi.string()).optional(),
    socialLinks: Joi.object({
      linkedin: Joi.string().optional(),
      facebook: Joi.string().optional(),
      twitter: Joi.string().optional(),
      instagram: Joi.string().optional(),
      github: Joi.string().optional(),
      personalWebsite: Joi.string().optional(),
    }).optional(),
  }).required(),

  // Professional Summary (Optional)
  professionalSummary: Joi.string()
    .custom((value, helpers) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 1 || wordCount > 500) {
        return helpers.error("string.base", {
          message: "Must be between 1 and 500 words",
        });
      }
      return value;
    })
    .optional(),

  // Wanted Job Title (Optional)
  wantedJobTitle: Joi.string().min(2).max(1000).optional(),

  // Work Experience (Array of Job Objects)
  workExperience: Joi.array()
    .items(
      Joi.object({
        jobTitle: Joi.string().min(2).max(1000).required(),
        companyName: Joi.string().min(2).max(1000).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().allow(null, ""),
        description: Joi.string().min(1).max(5000).optional(),
        skillsUsed: Joi.array().items(Joi.string().min(2).max(50)).optional(),
      })
    )
    .optional(),

  // Education (Array of Education Objects)
  education: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().min(2).max(1000).required(),
        institutionName: Joi.string().min(2).max(1000).required(),
        graduationDate: Joi.date().required(),
        coursework: Joi.array().items(Joi.string().min(2).max(100)).optional(),
      })
    )
    .optional(),

  // Skills (Array of Strings)
  skills: Joi.array().items(Joi.string().min(2).max(200)).optional(),

  // Certifications (Array of Objects)
  certifications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(2).max(1000).required(),
        organization: Joi.string().min(2).max(1000).required(),
        date: Joi.date().optional().allow(null, ""),
      })
    )
    .optional(),

  // Projects (Array of Objects)
  projects: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().min(2).max(1000).required(),
        description: Joi.string().min(1).max(5000).optional(),
        technologies: Joi.array().items(Joi.string().min(1).max(100)).optional(),
        startDate: Joi.date().optional().allow(null, ""),
        endDate: Joi.date().optional().allow(null, ""),
        projectLink: Joi.string().optional(),
      })
    )
    .optional(),

  // Languages (Array of Strings)
  languages: Joi.array().items(Joi.string().min(2).max(50)).optional(),

  // References (Array of Objects)
  references: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(2).max(500).required(),
        relationship: Joi.string().min(2).max(50).optional(),
        contact: Joi.string()
          .optional(),
      })
    )
    .optional(),

  // Internships (Array of Objects)
  internships: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().min(2).max(500).required(),
        company: Joi.string().min(2).max(500).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().allow(null, ""),
        description: Joi.string().min(1).max(5000).optional(),
      })
    )
    .optional(),

  // Acknowledgment (Optional - String)
  acknowledgment: Joi.string().min(1).max(2000).optional(),

  // Template Selection
  template: Joi.string().valid(
    "modern", "professional", "creative",
    "minimalist", "executive", "simple", "academic", "tech",
    "designer", "compact", "bold", "corporate", "elegant",
    "startup", "classic"
  ).default("modern").optional(),

  // Last Modified Date
  lastModified: Joi.date().default(Date.now),
});

module.exports = resumeSchema;
