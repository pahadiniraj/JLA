"use client";
import { ErrorMessage, Field, Form, Formik, FieldArray } from "formik";
import { MdDelete, MdLibraryAdd } from "react-icons/md";
import { jobValidationSchema } from "@/utils/Validation/JOI/createJobSchema";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

interface CreateJobFormValues {
  title: string;
  company: string;
  salary: number;
  description: string[];
  location: string;
  jobSpecification: string[];
  companyImg: File | string;
}

const initialValues: CreateJobFormValues = {
  title: "",
  company: "",
  salary: 0,
  description: [""],
  location: "",
  jobSpecification: [""],
  companyImg: "",
};

const CreateJob = () => {
  const handleSubmit = async (values: CreateJobFormValues) => {
    console.log(values);
  };

  const router = useRouter();

  return (
    <div className="w-full mt-32  p-6">
      <button
        className="flex justify-center items-center gap-1 my-2 hover:text-blue-500 duration-200"
        onClick={() => router.push("/")}
      >
        <IoMdArrowRoundBack />
        back
      </button>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Create New Job</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={jobValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="space-y-4 border shadow-lg p-4 rounded-lg ">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Title
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name
                </label>
                <Field
                  type="text"
                  name="company"
                  id="company"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="company"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salary
                </label>
                <Field
                  type="number"
                  name="salary"
                  id="salary"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="salary"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Location
                </label>
                <Field
                  type="text"
                  name="location"
                  id="location"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Description
                </label>
                <FieldArray
                  name="description"
                  render={(arrayHelpers) => (
                    <div>
                      {arrayHelpers.form.values.description.map(
                        (_: any, index: any) => (
                          <div key={index} className="flex space-x-2 mb-2">
                            <Field
                              name={`description[${index}]`}
                              as="textarea"
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Add a description"
                            />
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <MdDelete className="text-xl" />
                            </button>
                            <ErrorMessage
                              name={`description[${index}]`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                        className="flex items-center space-x-1 text-blue-500"
                      >
                        <MdLibraryAdd />
                        <span>Add Description</span>
                      </button>
                    </div>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="companyImg"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Image
                </label>
                <input
                  type="file"
                  name="companyImg"
                  id="companyImg"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setFieldValue("companyImg", file);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="companyImg"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="jobSpecification"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Specifications
                </label>
                <FieldArray
                  name="jobSpecification"
                  render={(arrayHelpers) => (
                    <div>
                      {arrayHelpers.form.values.jobSpecification.map(
                        (_: any, index: any) => (
                          <div key={index} className="flex space-x-2 mb-2">
                            <Field
                              as="textarea"
                              name={`jobSpecification[${index}]`}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Add a specification"
                            />
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <MdDelete size={20} />
                            </button>
                            <ErrorMessage
                              name={`jobSpecification[${index}]`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                        className="flex items-center space-x-1 text-blue-500 hover:text-blue-700"
                      >
                        <MdLibraryAdd size={20} />
                        <span>Add Job Specification</span>
                      </button>
                    </div>
                  )}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
              >
                Create Job
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateJob;
