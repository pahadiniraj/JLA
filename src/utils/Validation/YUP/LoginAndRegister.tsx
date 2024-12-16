import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  acceptTermAndCondition: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Accepting terms and conditions is required"),
});

const registrationSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(4, "Full name must be at least 4 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm password is required"),
  acceptTermAndCondition: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Accepting terms and conditions is required"),
});

export { loginSchema, registrationSchema };
