import Joi from "joi";

export const updateJobValidationSchema = Joi.object({
  title: Joi.string().trim().optional().messages({
    "string.base": "Title must be a string.",
  }),

  company: Joi.string().trim().optional().messages({
    "string.base": "Company must be a string.",
  }),

  salary: Joi.number().positive().optional().messages({
    "number.base": "Salary must be a number.",
    "number.positive": "Salary must be a positive number.",
  }),

  description: Joi.array()
    .items(Joi.string().trim().required())
    .min(1)
    .optional()
    .messages({
      "array.base": "Description must be an array of strings.",
      "array.min": "Description must have at least one entry.",
      "string.base": "Description entry must be a string.",
      "string.empty": "Description entry cannot be empty.",
    }),

  location: Joi.string().trim().optional().messages({
    "string.base": "Location must be a string.",
  }),

  jobSpecification: Joi.array()
    .items(Joi.string().trim().required())
    .min(1)
    .optional()
    .messages({
      "array.base": "Job Specification must be an array of strings.",
      "array.min": "Job Specification must have at least one entry.",
      "string.base": "Job Specification entry must be a string.",
      "string.empty": "Job Specification entry cannot be empty.",
    }),

  companyImg: Joi.object()
    .optional()
    .custom((file, helpers) => {
      if (file && !(file instanceof File)) {
        return helpers.error("any.invalid", {
          message: "Invalid file format.",
        });
      }
      if (file && !["image/jpeg", "image/png"].includes(file.type)) {
        return helpers.error("any.invalid", {
          message: "File must be a JPG or PNG image.",
        });
      }
      if (file && file.size > 5 * 1024 * 1024) {
        return helpers.error("any.invalid", {
          message: "File size must not exceed 5MB.",
        });
      }
      return file;
    })
    .messages({
      "any.required": "Company image is required.",
    }),
});
