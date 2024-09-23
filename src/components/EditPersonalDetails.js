import React, { useState, useEffect } from "react";
import { MdCancelPresentation } from "react-icons/md";
const EditFamilyDetails = ({ member, onSave, onCancel }) => {
  const [formValues, setFormValues] = useState({
    prefix: "",
    firstname: "",
    middlename: "",
    lastname: "",
    phoneNumber: "",
    maritialStatus: "",
    dob: "",
    gender: "",
    placeOfBirth: "",
    fatherName: "",
    doj: "",
    bloodGroup: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setFormValues(member);
    }
  }, [member]);
  
  // useEffect(() => {
  //   if (member) {
  //     // Convert dob and doj to yyyy-mm-dd format if they exist
  //     const formattedMember = {
  //       ...member,
  //       dob: member.dob ? new Date(member.dob).toISOString().split('T')[0] : "", // Ensure correct format for date input
  //       doj: member.doj ? new Date(member.doj).toISOString().split('T')[0] : "", // Same for doj
  //     };
  //     setFormValues(formattedMember);
  //   }
  // }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[a-zA-Z].*[\s]*$/;

    if (["firstname", "lastname", "fatherName"].includes(name)) {
      if (value === "" || regex.test(value)) {
        // Allow empty string or valid format
        setFormValues({ ...formValues, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Clear any errors if valid or empty
      } else {
        setErrors({
          ...errors,
          [name]:
            "Only letters are allowed, with a single space between words.",
        });
        return;
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }

    if (name === "prefix") {
      if (value === "Mr ") {
        setFormValues({
          ...formValues,
          [name]: value,
          gender: "Male",
          maritialStatus: "",
        });
      } else if (value === "Ms ") {
        setFormValues({
          ...formValues,
          [name]: value,
          gender: "Female",
          maritialStatus: "Single",
        });
      } else if (value === "Mrs ") {
        setFormValues({
          ...formValues,
          [name]: value,
          gender: "Female",
          maritialStatus: "Married",
        });
      } else {
        setFormValues({ ...formValues, [name]: value });
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };
  const phoneLengthByCountry = {
    "+91": 10, // India
    "+1": 10, // USA
    "+44": 10, // UK
    "+61": 9, // Australia
    "+64": 9, // New Zealand
    "+27": 9, // South Africa
    "+977": 10, // Nepal
    "+94": 9, // Sri Lanka
    "+60": 9, // Malaysia
    "+65": 8, // Singapore
  };

  const validatePhonenumber = (phonenumber, countryCode) => {
    let error = "";

    const indianPhoneRegex = /^[6-9]\d{9}$/; // India specific
    const nonIndianPhoneRegex = /^[1-9]\d+$/; // Non-India countries

    // Get expected phone number length for the selected country
    const phoneLength = phoneLengthByCountry[countryCode] || 10; // Default length if not defined

    // Check if the phone number is empty
    if (!phonenumber) {
      error = "Number is required.";
    } else if (phonenumber.length !== phoneLength) {
      error = `Number must be exactly ${phoneLength} digits for ${countryCode}.`;
    } else if (countryCode === "+91") {
      // For India, phone number should start with 6, 7, 8, or 9 and have exactly 10 digits
      if (!indianPhoneRegex.test(phonenumber)) {
        error = "Number must start with 6, 7, 8, or 9 and be 10 digits.";
      }
    } else {
      // For other countries, phone number should not start with 0 and should match the expected length
      if (!nonIndianPhoneRegex.test(phonenumber)) {
        error = `Number must not start with 0 and should be exactly ${phoneLength} digits for ${countryCode}.`;
      }
    }
    return error;
  };

  const handleMobileInput = (e) => {
    const { value } = e.target;
    // Remove any non-numeric characters
    const sanitizedValue = value.replace(/\D/g, "");
    setFormValues({ ...formValues, phoneNumber: sanitizedValue });
  };
  // Custom validation function......
  const validateForm = () => {
    let validationErrors = {};
    const currentDate = new Date();

    // Prefix
    if (!formValues.prefix) {
      validationErrors.prefix = "Prefix is required.";
    }
    //checking for mismatching of prefix and gender
    if (formValues.prefix === "Mr " && formValues.gender === "Female") {
      validationErrors.prefix = "Gender must be 'male' when prefix is 'Mr'.";
    } else if (formValues.prefix === "Ms " && formValues.gender === "Male") {
      validationErrors.prefix = "Gender must be 'female' when prefix is 'Ms'.";
    } else if (formValues.prefix === "Mrs " && formValues.gender === "Male") {
      validationErrors.prefix = "Gender must be 'female' when prefix is 'Mrs'.";
    }

    // First Name, Middle Name, Last Name, Father Name
    ["firstname", "lastname", "placeOfBirth", "fatherName"].forEach((field) => {
      if (!formValues[field]) {
        validationErrors[field] = `${field} is required.`;
      } else if (!/^[A-Za-z ]+$/.test(formValues[field])) {
        validationErrors[field] = "Only characters are allowed.";
      } else if (formValues[field].length < 2) {
        validationErrors[field] = `${field} must be at least 2 characters.`;
      } else if (formValues[field].length > 25) {
        validationErrors[field] = `${field} must be at most 25characters.`;
      }
    });

    //CountryCode
    if (!formValues.countryCode) {
      validationErrors.countryCode = "Country code is required.";
    }

    // Validate phone number with country code
    const phoneError = validatePhonenumber(
      formValues.phoneNumber,
      formValues.countryCode
    );
    if (phoneError) {
      validationErrors.phoneNumber = phoneError;
    }
    // Marital Status
    if (!formValues.maritialStatus) {
      validationErrors.maritialStatus = "Maritial status is required.";
    }
    // Date of Birth (DOB)
    const dobDate = new Date(formValues.dob);
    if (!formValues.dob) {
      validationErrors.dob = "Date of Birth is required.";
    } else if (dobDate > currentDate) {
      validationErrors.dob = "Date of Birth cannot be in the future.";
    } else {
      // Calculate age
      let age = currentDate.getFullYear() - dobDate.getFullYear();
      const monthDifference = currentDate.getMonth() - dobDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        validationErrors.dob = "You must be at least 18 years old.";
      } else if (age > 100) {
        validationErrors.dob = "DOB should not exceed 100 years in the past.";
      }
    }

    // Gender
    if (!formValues.gender) {
      validationErrors.gender = "Gender is required.";
    }

    // Date of Joining
    const joiningDate = new Date(formValues.doj);
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (!formValues.doj) {
      validationErrors.doj = "Date is required.";
    } else if (joiningDate < today) {
      validationErrors.doj = "Date of joining should not be in the past.";
    }
    // Blood Group
    if (!formValues.bloodGroup) {
      validationErrors.bloodGroup = "Bloodgroup is required.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formValues);
      console.log("Form submitted successfully", formValues);
    } else {
      console.log("Form submission failed");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-gray-200 p-4 rounded-md shadow-md w-1/2  ">
        <div className="bg-orange-400 rounded-md p-2 mb-10 flex items-center justify-between border-gray-950">
          <h2 className="text-xl pl-2">Add Personal Details</h2>
          <button
            className="text-black-500 pr-1 hover:text-gray-700"
            onClick={onCancel}
          >
            <MdCancelPresentation size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* First Row ..............................*/}
          <div className="grid grid-cols-4  gap-6 mb-9">
            {/* grid grid-cols-1 md:grid-cols-3 gap-6 mb- */}
            {/* Prefix */}
            <div>
              <label className="block text-gray-700">Prefix</label>
              <select
                name="prefix"
                value={formValues.prefix}
                onChange={handleChange}
                className="w-full p-1 border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Mr ">Mr.</option>
                <option value="Ms ">Ms.</option>
                <option value="Mrs ">Mrs.</option>
              </select>
              {errors.prefix && (
                <span className="text-red-800 block h-4">{errors.prefix}</span>
              )}
            </div>
            {/* First Name */}
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formValues.firstname}
                onChange={handleChange}
                // className="w-full p-1 border border-gray-300 rounded-md"
                className="border border-gray-300 rounded-md p-1 w-full overflow-hidden whitespace-nowrap text-ellipsis"
              />
              {errors.firstname && (
                <span className="text-red-800 block h-4">
                  {errors.firstname}
                </span>
              )}
            </div>
            {/* Middle Name */}
            <div>
              <label className="block text-gray-700">Middle Name</label>
              <input
                type="text"
                name="middlename"
                value={formValues.middlename}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formValues.lastname}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
              />
              {errors.lastname && (
                <span className="text-red-800 block h-2">
                  {errors.lastname}
                </span>
              )}
            </div>
          </div>
          {/* Second Row................................
           */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Phone Number */}

            {/* </div> */}

            <div>
              <label className="block text-gray-700">Phone Number</label>
              <div className="grid grid-cols-2 gap-2">
                {/* Country Code Selection */}
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formValues.countryCode}
                  onChange={handleChange}
                  className={`p-1 border border-gray-300 rounded-md ${
                    errors.countryCode ? "border-red-500" : ""
                  }`}
                >
                  <option value="+code">select</option>
                  <option value="+91">+91 (INDIA)</option>
                  <option value="+1">+1 (USA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AUSTRALIA)</option>
                  <option value="+64">+64 (NEW ZEALAND)</option>
                  <option value="+27">+27 (SOUTH AFRICA)</option>
                  <option value="+977">+977 (NEPAL)</option>
                  <option value="+94">+94 (SRILANKA)</option>
                  <option value="+60">+60 (MALAYSIA)</option>
                  <option value="+65">+65 (SINGAPORE)</option>
                </select>
                {errors.countryCode && (
                  <p className="text-red-800">{errors.countryCode}</p>
                )}

                {/* Phone Number Input */}
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleMobileInput}
                  maxLength="10"
                  className={`w-full p-1 border border-gray-300 rounded-md ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.phoneNumber && (
                  <span className="text-red-800 block h-4">
                    {errors.phoneNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-gray-700">Maritial Status</label>
              <select
                name="maritialStatus"
                value={formValues.maritialStatus}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
              >
                <option value="">Select Maritial Status</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Divorce">Divorce</option>
              </select>
              {errors.maritialStatus && (
                <span className="text-red-800 block h-4">
                  {errors.maritialStatus}
                </span>
              )}
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                max={new Date().toISOString().split("T")[0]}
                value={formValues.dob}
                onChange={handleChange}
                // onKeyDown={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key !== "Tab") e.preventDefault();
                }}
                className="w-full p-1 border border-gray-300 rounded-md"
              />
              {errors.dob && (
                <span className="text-red-800 block h-4">{errors.dob}</span>
              )}
            </div>
            {/* Gender */}
            <div>
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formValues.gender}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Others</option>
              </select>
              {errors.gender && (
                <span className="text-red-800 block h-4">{errors.gender}</span>
              )}
            </div>
          </div>
          {/* Third Row */}
          <div className="grid grid-cols-4     gap-6 mb-6">
            {/* Place Of Birth */}
            <div>
              <label className="block text-gray-700">place Of Birth</label>
              <input
                type="text"
                name="placeOfBirth"
                value={formValues.placeOfBirth}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
              />
              {errors.placeOfBirth && (
                <span className="text-red-800 block h-2">
                  {errors.placeOfBirth}
                </span>
              )}
            </div>
            {/* Father Name */}
            <div>
              <label className="block text-gray-700">Father Name</label>
              <input
                type="text"
                name="fatherName"
                value={formValues.fatherName}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded-md"
              />
              {errors.fatherName && (
                <span className="text-red-800 block h-4">
                  {errors.fatherName}
                </span>
              )}
            </div>
            {/* Date of Joining */}
            <div>
              <label className="block text-gray-700">Date of Joining</label>
              <input
                type="date"
                name="doj"
                min={new Date().toISOString().split("T")[0]} // Minimum date set to today's date
                max={
                  new Date(new Date().setMonth(new Date().getMonth() + 4))
                    .toISOString()
                    .split("T")[0]
                } // Maximum date set to 4 months from today
                value={formValues.doj}
                onChange={handleChange}
                // onKeyDown={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key !== "Tab") e.preventDefault();
                }}
                className="w-full p-1 border border-gray-300 rounded-md"
              />
              {errors.doj && (
                <span className="text-red-800 block h-4">{errors.doj}</span>
              )}
            </div>
            {/* Blood Group */}
            <div>
              <label className="block text-gray-700">Blood Group</label>
              <select
                name="bloodGroup"
                value={formValues.bloodGroup}
                onChange={handleChange}
                onKeyDown={(e) => e.preventDefault()}
                className="w-full p-1 border border-gray-300 rounded-md"
              >
                <option value="">Select bloodGroup</option>
                <option value="O +ve">O+</option>
                <option value="O -ve">O-</option>
                <option value="A +ve">A+</option>
                <option value="A -ve">A-</option>
                <option value="B +ve">B+</option>
                <option value="B -ve">B-</option>
                <option value="AB +ve">AB+</option>
                <option value="AB -ve">AB-</option>
              </select>
              {errors.bloodGroup && (
                <span className="text-red-800 block h-4">
                  {errors.bloodGroup}
                </span>
              )}
            </div>
          </div>
          <div className="  ml-30 flex justify-end ">
            <button
              type="submit"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3"
              // onChange={handleNameChar}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditFamilyDetails;
