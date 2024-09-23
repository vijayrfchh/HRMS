// import React, { useState } from "react";

// const PopupForm = () => {
//   const [showPopup, setShowPopup] = useState(false);

//   const togglePopup = () => {
//     setShowPopup(!showPopup);
//   };

//   return (
//     <div className="relative">
//       {/* Button to trigger popup */}
//       <button
//         onClick={togglePopup}
//         className="bg-black text-white px-4 py-2 rounded-lg mt-4"
//       >
//         Add New Career
//       </button>

//       <div className="w-[1041px] h-11 mt-[-3rem] ml-[14.5rem] bg-white rounded-[5px] border border-black/80" />

//       {/* Popup form */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-gray-500  bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-md p-8 w-8/12 md:w-1/3 lg:w-1/2 shadow-lg">
//             {/* Close button */}
//             <button
//               onClick={togglePopup}
//               className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
//             >
//               X
//             </button>
//             <h2 className="text-xl font-semibold mb-4  pt-4 text-center">
//               Add Careers
//             </h2>
//             <form>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
//                 <div className="flex flex-col">
//                   <label>Job Title</label>
//                   <input
//                     type="text"
//                     placeholder="Job Title"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Job Location</label>
//                   <input
//                     type="text"
//                     placeholder="Job Location"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>No of Requirement</label>
//                   <input
//                     type="number"
//                     placeholder="No of Requirement"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Experience</label>
//                   <input
//                     type="text"
//                     placeholder="Experience"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Skill Set</label>
//                   <input
//                     type="text"
//                     placeholder="Skill Set"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Age</label>
//                   <input
//                     type="number"
//                     placeholder="Age"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Salary From</label>
//                   <input
//                     type="number"
//                     placeholder="Salary From"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Salary To</label>
//                   <input
//                     type="number"
//                     placeholder="Salary To"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Job Type</label>
//                   <input
//                     type="text"
//                     placeholder="Job Type"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Publish Date</label>
//                   <input
//                     type="date"
//                     className="border border-gray-300 p-1 rounded-md"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <label>Expired Date</label>
//                   <input
//                     type="date"
//                     className="border border-gray-300  rounded-md"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label>Job Description</label>
//                 <textarea
//                   rows="3"
//                   placeholder="Enter job description"
//                   className="border border-gray-300 p-1 rounded-md w-full"
//                 ></textarea>
//                 <span className="text-xs text-gray-500">300 characters</span>
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-center">
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-6 py-1 rounded-md"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>{" "}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopupForm;

import React, { useState } from "react";
import { AiTwotoneHome } from "react-icons/ai";

const CareerPopup = () => {
  const [showPopup, setShowPopup] = useState(true);
  // Set to true for initial demo
  const [formValues, setFormValues] = useState({
    jobTitle: "",
    jobLocation: "",
    noOfRequirement: "",
    experienceYear: "",
    experienceMonth: "",
    skillSet: "",
    age: "",
    salaryFrom: "",
    salaryTo: "",
    jobType: "",
    publishDate: "",
    expiredDate: "",
    jobDescription: "",
  });
  const [errors, setErrors] = useState({});
  // custome Validations starts...
  const validateForm = () => {
    let validationsErrors = {};
    ["jobType", "jobTitle", "jobLocation", "experience"].forEach((field) => {
      if (!formValues[field]) {
        validationsErrors[field] = `${field} is required.`;
      } else if (!/^[A-Za-z ]+$/.test(formValues[field])) {
        validationsErrors[field] = `${field} should be in string format.`;
      } else if (formValues[field].length < 2) {
        validationsErrors[field] = `${field} must be min 2 characters`;
      } else if (formValues[field].length > 20) {
        validationsErrors[field] = `${field} must be max 20 characters`;
      }
    });
    setErrors(validationsErrors);
    return Object.keys(validationsErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("submitted successfully", formValues);
    } else {
      console.log("form is invalid", errors);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    //for preventing space ..
    const regex = /^[a-zA-Z].*[\s]*$/;
    if (["jobType", "jobTitle", "jobLocation"].includes(name)) {
      if (value === "" || regex.test(value)) {
        setFormValues({ ...formValues, [name]: value });
        setErrors({ ...errors, [name]: "" });
      } else {
        setErrors({
          ...errors,
          [name]: "only letters allowed no space",
        });
        return;
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };
  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-white-500 bg-opacity-50 flex justify-center items-center overflow-auto">
          {/* Head Navbar */}
          <div className="absolute top-0 w-full sm:w-10/12 md:w-9/12 h-10 bg-white rounded-md border border-black/90 shadow-md">
            {/* Navbar Content */}
            <div className="flex items-center justify-between p-2">
              <AiTwotoneHome size={20} className="mr-2" />
            </div>
          </div>
          {/* Form */}
          <div className="bg-white rounded-md p-4 h-auto shadow-lg w-full sm:w-10/12 md:w-9/12 lg:w-6/12 xl:w-5/12 relative mx-auto max-w-7xl border-2 mt-16 overflow-auto max-h-[90vh]">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label className="block text-gray-700">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formValues.jobTitle}
                    onChange={handleChange}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                  {errors.jobTitle && (
                    <span className="text-red-800 block h-3">
                      {errors.jobTitle}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">Job Location</label>
                  <input
                    type="text"
                    name="jobLocation"
                    value={formValues.jobLocation}
                    onChange={handleChange}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                  {errors.jobLocation && (
                    <span className="text-red-800 block h-3">
                      {errors.jobLocation}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">
                    No of Requirement
                  </label>
                  <input
                    type="number"
                    name="noOfRequirement"
                    value={formValues.noOfRequirement}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">Experience</label>

                  <div className="flex space-x-3">
                    {/* Dropdown for years */}
                    <div>
                      {/* <label
                        htmlFor="experienceYear"
                        className="block text-gray-700"
                      >
                        Years
                      </label> */}
                      <select
                        name="experienceYear"
                        value={formValues.experienceYear}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            experienceYear: e.target.value,
                          })
                        }
                        className="border border-gray-300 p-1  rounded-md"
                      >
                        <option value="">Select Year</option>
                        {Array.from({ length: 50 }, (_, index) => (
                          <option key={index} value={index}>
                            {index} Year{index !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dropdown for months */}
                    <div>
                      {/* <label
                        htmlFor="experienceMonth"
                        className="block text-gray-700"
                      >
                        Months
                      </label> */}
                      <select
                        name="experienceMonth"
                        value={formValues.experienceMonth}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            experienceMonth: e.target.value,
                          })
                        }
                        className="border border-gray-300 p-1 rounded-md"
                      >
                        <option value="">Select Month</option>
                        {Array.from({ length: 12 }, (_, index) => (
                          <option key={index} value={index}>
                            {index} Month{index !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-gray-700">Skill Set</label>
                  <input
                    type="text"
                    name="skillSet"
                    value={formValues.skillSet}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formValues.age}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">Salary From</label>
                  <input
                    type="number"
                    name="salaryFrom"
                    value={formValues.salaryFrom}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">Salary To</label>
                  <input
                    type="number"
                    name="salaryTo"
                    value={formValues.salaryTo}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">Job Type</label>
                  <input
                    type="text"
                    name="jobType"
                    value={formValues.jobType}
                    onChange={handleChange}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                  {errors.jobType && (
                    <span className="text-red-800 block h-3">
                      {errors.jobType}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">Publish Date</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formValues.publishDate}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700">Expired Date</label>
                  <input
                    type="date"
                    name="expiredDate"
                    value={formValues.expiredDate}
                    className="border border-gray-300 p-1 rounded-md overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-gray-700">Job Description</label>
                <textarea
                  rows="2"
                  name="jobDescription"
                  value={formValues.jobDescription}
                  placeholder="Enter job description"
                  className="border border-gray-300 p-2 rounded-md w-full"
                ></textarea>
                <span className="text-xs text-gray-500">300 characters</span>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CareerPopup;
