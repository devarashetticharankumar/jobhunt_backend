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
  maxPrice: Joi.string().optional(),
  minPrice: Joi.string().optional(),
  postedBy: Joi.string().email().required(),
  postingDate: Joi.date(),
  salaryType: Joi.string(),
  skills: Joi.array().items(Joi.any().allow(null)),
  slug: Joi.string(),
  glassdoorLink: Joi.string().uri().optional(),
  // Slug is optional but must follow the format if provided
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

// Contact Schema
const contactSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  email: Joi.string().required(),
  message: Joi.string().required(),
});

module.exports = {
  jobSchema,
  userSchema,
  loginSchema,
  emailSubscriptionSchema,
  contactSchema,
};

// const Joi = require("joi");

// const jobSchema = Joi.object({
//   ApplyLink: Joi.string().uri().required(),
//   companyLogo: Joi.string().uri().required(),
//   companyName: Joi.string().required(),
//   createdAt: Joi.date(),
//   description: Joi.string().required(),
//   employmentType: Joi.string(),
//   experienceLevel: Joi.string(),
//   jobLocation: Joi.string(),
//   jobTitle: Joi.string().required(),
//   maxPrice: Joi.number().optional(),
//   minPrice: Joi.number().optional(),
//   postedBy: Joi.string().email().required(),
//   postingDate: Joi.date(),
//   salaryType: Joi.string(),
//   skills: Joi.array().items(Joi.any().allow(null)),
//   // Slug is optional but must follow the format if provided
// });

// const userSchema = Joi.object({
//   name: Joi.string(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
//   // Add other fields as required
// });

// const loginSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
// });

// const emailSubscriptionSchema = Joi.object({
//   email: Joi.string().email().required(),
// });

// // Contact Schema
// const contactSchema = Joi.object({
//   firstName: Joi.string().required(),
//   lastName: Joi.string(),
//   email: Joi.string().required(),
//   message: Joi.string().required(),
// });

// module.exports = {
//   jobSchema,
//   userSchema,
//   loginSchema,
//   emailSubscriptionSchema,
//   contactSchema,
// };
