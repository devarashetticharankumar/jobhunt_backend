const Joi = require("joi");

const jobSchema = Joi.object({
  ApplyLink: Joi.string().uri().required(),
  companyLogo: Joi.string().uri().required(),
  companyName: Joi.string().required(),
  createdAt: Joi.date(),
  description: Joi.string().required(),
  employmentType: Joi.string(),
  experienceLevel: Joi.string(),
  jobLocation: Joi.string(),
  jobTitle: Joi.string().required(),
  maxPrice: Joi.number(),
  minPrice: Joi.number(),
  postedBy: Joi.string().email().required(),
  postingDate: Joi.date(),
  salaryType: Joi.string(),
  skills: Joi.array().items(Joi.any().allow(null)),

  // Add other fields as required
});

const userSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  // Add other fields as required
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const emailSubscriptionSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  jobSchema,
  userSchema,
  loginSchema,
  emailSubscriptionSchema,
};
