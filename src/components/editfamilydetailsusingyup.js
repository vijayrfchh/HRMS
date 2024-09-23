// import React, { useState, useEffect } from "react";
// import { MdCancelPresentation } from "react-icons/md";
// import * as Yup from "yup"; // Import Yup for validation
// // import Navbar from "./Navbar"

// // Validation schema using Yup
// const validationSchema = Yup.object({
//   maritalStatus: Yup.string().required("Marital status is required"),
//   prefix: Yup.string().required("Prefix is required"),
//   firstname: Yup.string()
//     .matches(/^[A-Za-z ]*$/, "Only characters are allowed")
//     .min(4, "First name must be at least 4 characters")
//     .max(25, "First name must be at most 25 characters")
//     .required("First name is required"),

// });
// const EditFamilyDetails = ({ member, onSave, onCancel }) => {
//   const [formValues, setFormValues] = useState({
//     prefix: "",
//     firstname: "",
//     middlename: "",
//     lastname: "",
//     phoneNumber: "",
//     maritalStatus: "",
//     dob: "",
//     gender: "",
//     fatherName: "",
//     dateOfJoining: "",
//     bloodGroup: "",
//   });

//   const [errors, setErrors] = useState({});

//   // Yup schema for validation

//   useEffect(() => {
//     if (member) {
//       setFormValues(member);
//     }
//   }, [member]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const validateForm = async () => {
//     try {
//       await validationSchema.validate(formValues, { abortEarly: false });
//       setErrors({});
//       return true;
//     } catch (err) {
//       const validationErrors = {};
//       err.inner.forEach((error) => {
//         validationErrors[error.path] = error.message;
//       });
//       setErrors(validationErrors);
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

//   return (
   
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
//         {/* <Navbar/> */}
//       <div className="bg-gray-200 p-4 rounded-md shadow-md w-1/2">
//         <div className="bg-orange-500 rounded-md p-3 mb-10 flex items-center justify-between">
//           <h2 className="text-2xl pl-2">Edit Personal Details</h2>
//           <button className="text-black-500 pr-1 hover:text-gray-700" onClick={onCancel}>
//             <MdCancelPresentation size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* First Row */}
//           <div className="grid grid-cols-4 gap-6 mb-6">
//             {/* Prefix */}
//             <div>
//               <label className="block text-gray-700">Prefix</label>
//               <select
//                 name="prefix"
//                 value={formValues.prefix}
//                 onChange={handleChange}
//                 className="w-full p-1 border-gray-300 rounded-md"
//               >
//                 <option value="" disabled>Select</option>
//                 <option value="Mr.">Mr.</option>
//                 <option value="Ms.">Ms.</option>
//                 <option value="Mrs.">Mrs.</option>
//               </select>
//               {errors.prefix && <span className="text-red-800">{errors.prefix}</span>}
//             </div>
//             {/* First Name */}
//             <div>
//               <label className="block text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 name="firstname"
//                 value={formValues.firstname}
//                 onChange={handleChange}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               />
//               {errors.firstname && <span className="text-red-800">{errors.firstname}</span>}
//             </div>
//             {/* Middle Name */}
//             <div>
//               <label className="block text-gray-700">Middle Name</label>
//               <input
//                 type="text"
//                 name="middlename"
//                 value={formValues.middlename}
//                 onChange={handleChange}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               />
//               {errors.middlename && <span className="text-red-800">{errors.middlename}</span>}
//             </div>
//             {/* Last Name */}
//             <div>
//               <label className="block text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 name="lastname"
//                 value={formValues.lastname}
//                 onChange={handleChange}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               />
//               {errors.lastname && <span className="text-red-800">{errors.lastname}</span>}
//             </div>
//           </div>

//           {/* Second Row */}
//           <div className="grid grid-cols-4 gap-4 mb-2">
//             {/* Phone Number */}
//             <div>
//               <label className="block text-gray-700">Phone Number</label>
//               <input
//                 type="text"
//                 name="phoneNumber"
//                 value={formValues.phoneNumber}
//                 onChange={handleChange}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               />
//               {errors.phoneNumber && <span className="text-red-800">{errors.phoneNumber}</span>}
//             </div>
//             {/* Marital Status */}
//             <div>
//               <label className="block text-gray-700">Marital Status</label>
//               <select
//                 name="maritalStatus"
//                 value={formValues.maritalStatus}
//                 onChange={handleChange}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               >
//                 <option value="">Select Marital Status</option>
//                 <option value="Married">Married</option>
//                 <option value="Single">Single</option>
//                 <option value="Divorce">Divorce</option>
//               </select>
//               {errors.maritalStatus && <span className="text-red-800">{errors.maritalStatus}</span>}
//             </div>
//             {/* Date of Birth */}
//             <div>
//               <label className="block text-gray-700">Date of Birth</label>
//               <input
//                 type="date"
//                 name="dob"
//                 max={new Date().toISOString().split("T")[0]}
//                 value={formValues.dob}
//                 onChange={handleChange}
//                 onKeyDown={(e) => e.preventDefault()}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               />
//               {errors.dob && <span className="text-red-800">{errors.dob}</span>}
//             </div>
//             {/* Gender */}
//             <div>
//               <label className="block text-gray-700">Gender</label>
//               <select
//                 name="gender"
//                 value={formValues.gender}
//                 onChange={handleChange}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               >
//                 <option value="" disabled>Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               {errors.gender && <span className="text-red-800">{errors.gender}</span>}
//             </div>
//           </div>

//           {/* Third Row */}
//           <div className="grid grid-cols-3 gap-4 mb-2">
//             {/* Father's Name */}
//             <div>
//               <label className="block text-gray-700">Father's Name</label>
//               <input
//                 type="text"
//                 name="fatherName"
//                 value={formValues.fatherName}
//                 onChange={handleChange}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               />
//               {errors.fatherName && <span className="text-red-800">{errors.fatherName}</span>}
//             </div>
//             {/* Date of Joining */}
//             <div>
//               <label className="block text-gray-700">Date of Joining</label>
//               <input
//                 type="date"
//                 name="dateOfJoining"
//                 min={new Date().toISOString().split("T")[0]}
//                 value={formValues.dateOfJoining}
//                 onChange={handleChange}
//                 onKeyDown={(e) => e.preventDefault()}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               />
//               {errors.dateOfJoining && <span className="text-red-800">{errors.dateOfJoining}</span>}
//               {errors.age && <span className="text-red-800">{errors.age}</span>}
//             </div>
//             {/* Blood Group */}
//             <div>
//               <label className="block text-gray-700">Blood Group</label>
//               <input
//                 type="text"
//                 name="bloodGroup"
//                 value={formValues.bloodGroup}
//                 onChange={handleChange}
//                 className="w-full p-1 border border-gray-300 rounded-md"
//               />
//               {errors.bloodGroup && <span className="text-red-800">{errors.bloodGroup}</span>}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="mt-4 flex justify-center">
//             <button
//               type="submit"
//               className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 mr-2"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={onCancel}
//               className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditFamilyDetails;

import React, { useState, useEffect } from 'react';

const EditFamilyDetails = ({ member, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    phoneNumber: '',
    maritalStatus: '',
    dob: '',
    gender: '',
    fatherName: '',
    dateOfJoining: '',
    bloodGroup: '',
  });

  useEffect(() => {
    if (member) {
      setFormValues(member);
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-slate-50 p-4 rounded-md shadow-md w-1/2">
        <h2 className="text-xl mb-5">Edit Personal Details</h2>
        <form onSubmit={handleSubmit}>
          {/ First Row /}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Marital Status</label>
              <input
                type="text"
                name="maritalStatus"
                value={formValues.maritalStatus}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/ Second Row /}
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formValues.dob}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formValues.gender}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
                required
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formValues.fatherName}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/ Third Row /}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-gray-700">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formValues.dateOfJoining}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={formValues.bloodGroup}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white p-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFamilyDetails;
