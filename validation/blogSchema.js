const Joi = require("joi");

const blogSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(), // Title must be a string with a minimum length of 3 and a maximum length of 100
  slug: Joi.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) // Slug format with lowercase letters, numbers, and hyphens
    .optional(), // Slug is optional but must follow the format if provided
  author: Joi.string().min(3).max(50).required(), // Author must be a string with a minimum length of 3 and maximum length of 50
  tags: Joi.array().items(Joi.string()).optional(),
  publishedDate: Joi.date()
    .optional()
    .default(() => new Date()), // Defaults to current date if not provided
  content: Joi.string().required(), // Content must be a string with a minimum length of 10
  thumbnail: Joi.string().uri().optional(), // Thumbnail must be a valid URI if provided
  category: Joi.string().min(3).max(50).required(),
  comments: Joi.array()
    .items(
      Joi.object({
        user: Joi.string().min(1).required(), // Comment must have a user with a non-empty string
        text: Joi.string().min(1).required(), // Comment text must be a non-empty string
        date: Joi.date().default(() => new Date()), // Defaults to current date if not provided
      })
    )
    .optional(), // Comments array is optional
  likes: Joi.number().integer().min(0).optional(), // Likes should be a non-negative integer
  views: Joi.number().integer().min(0).optional(), // Views should be a non-negative integer
});

module.exports = blogSchema;
