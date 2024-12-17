import * as Yup from "yup";

// Define the validation schema
export const jobValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required.")
    .typeError("Title must be a string."),

  company: Yup.string()
    .trim()
    .required("Company is required.")
    .typeError("Company must be a string."),

  salary: Yup.number()
    .positive("Salary must be a positive number.")
    .required("Salary is required.")
    .typeError("Salary must be a number."),

  description: Yup.array()
    .of(Yup.string().trim().required("Description entry is required."))
    .min(1, "Description must have at least one entry.")
    .required("Description is required.")
    .typeError("Description must be an array of strings."),

  location: Yup.string()
    .trim()
    .required("Location is required.")
    .typeError("Location must be a string."),

  jobSpecification: Yup.array()
    .of(Yup.string().trim().required("Job Specification entry is required."))
    .min(1, "Job Specification must have at least one entry.")
    .required("Job Specification is required.")
    .typeError("Job Specification must be an array of strings."),
});
