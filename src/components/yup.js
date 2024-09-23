// const validationSchema = Yup.object().shape({
//     prefix: Yup.string().required("Prefix is required"),
//     firstname: Yup.string()
//     .required("First name is required")
//     .matches(/^[A-Za-z\s]+$/, "First name should only contain letters")
//     .min(4, "First name must be at least 4 characters")
//     .max(30, "First name must be at most 30 characters"),
//     middlename: Yup.string().required("Middle name is required"),
//     lastname: Yup.string().required("Last name is required"),
//     phoneNumber: Yup.string()
//       .required("Phone number is required")
//       .matches(/^\d{10}$/, "Invalid phone format (xxx-xxx-xxxx)"),
//     maritalStatus: Yup.string().required("Marital status is required"),
//     // dob: Yup.date()
//     //   .required("Date of Birth is required")
//     //   .max(new Date(), "Date of Birth cannot be in the future"), // Past date only
//     gender: Yup.string().required("Gender is required"),
//     fatherName: Yup.string().required("Father's name is required"),
//     // dateOfJoining: Yup.date()
//     //   .required("Date of Joining is required")
//     //   .min(new Date(), "Date of Joining cannot be in the past"), // Future date only
//     bloodGroup: Yup.string().required("Blood group is required"),
//   }).test("age-check", "Age should be at least 18 years", function (values) {
//     const { dob, dateOfJoining } = values;
//     if (dob && dateOfJoining) {
//       const birthDate = new Date(dob);
//       const joinDate = new Date(dateOfJoining);
//       const ageDiff = (joinDate - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
//       return ageDiff >= 18;
//     }
//     return true;
//   });




//   onst validateForm = async () => {
//     try {
//       await validationSchema.validate(formValues, { abortEarly: false });
//       setErrors({});
//       return true;
//     } catch (validationErrors) {
//       const newErrors = {};
//       validationErrors.inner.forEach((error) => {
//         newErrors[error.path] = error.message;
//       });
//       setErrors(newErrors);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (await validateForm()) {
//       onSave(formValues);
//       console.log("Form submitted successfully", formValues);
//     } else {
//       console.log("Form submission failed");
//     }
//   };