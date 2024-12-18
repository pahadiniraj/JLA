import Joi from "joi";
export const userRegistrationSchema = Joi.object({
  fullname: Joi.string().min(3).required().messages({
    "string.base": "Full name should be a string.",
    "string.min": "Full name should have at least 3 characters.",
    "any.required": "Full name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password should have at least 6 characters.",
    "any.required": "Password is required.",
  }),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});
