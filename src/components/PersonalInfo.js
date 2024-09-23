import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import EditFamilyDetails from "./EditPersonalDetails";
import Navbar from "./PersonalNavbar";
// import Navbar from "./MainNavbar"
// const PersonalInfo = ({ employeeData }) => {
  // const employeeProfileDetails = employeeData?.employeeProfileDetails || {};
  const PersonalInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewEmployee, setIsNewEmployee] = useState(true);
  const [employeeId, setEmployeeId] = useState(""); // Store the employeeId
  const [personalDetails, setPersonalDetails] = useState({
    prefix: "",
    firstname: "",
    middlename: "",
    lastname: "",
    countryCode: "",
    phoneNumber: "",
    maritialStatus: "",
    dob: "",
    gender: "",
    fatherName: "",
    doj: "",
    bloodGroup: "",
  });

  // Function to format date to MM/DD/YYYY format
  const formatPostDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(d.getDate()).padStart(2, "0"); // Month is zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle null or undefined dates
    // Split the date string assuming it is in "DD/MM/YYYY" format
    const [day, month, year] = dateString.split("/");
    // Recreate the date string in "MM/DD/YYYY" format for JavaScript Date parsing
    const reformattedDate = `${month}/${day}/${year}`;
    const date = new Date(reformattedDate);
    if (isNaN(date.getTime())) return ""; // Handle invalid date
    // Return the original "DD/MM/YYYY" format
    return `${day}/${month}/${year}`;
  };

  
      
      
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (employeeId) {
          // Only make the GET call if employeeId exists
          const response = await axios.get(
            `http://192.168.0.119:8080/employeeservice/employee/getEmployeeProfile/${employeeId}`
          );
          const data = response.data;
          console.log("API response", data);

          setPersonalDetails({
            prefix: data.prefix || "",
            firstname: data.firstname,
            lastname: data.lastname,
            middlename: data.middlename || "",
            phoneNumber: data.phoneNumber,
            maritialStatus: data.maritialStatus,
            dob: formatDate(data.dob),
            gender: data.gender,
            fatherName: data.fatherName,
            doj: formatDate(data.doj),
            bloodGroup: data.bloodGroup,
          });

          setIsNewEmployee(false);  // If data exists, it's an existing employee
        }
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    };

    fetchData();
  }, [employeeId]); 

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // const handleSave = (updatedDetails) => {
  //   setPersonalDetails(updatedDetails);
  //   setIsModalOpen(false);
  // };

 


  const handleSave = async (updatedDetails) => {
    try {
      // Log data before sending
      console.log("Updated Details (before formatting):", updatedDetails);
  
      const formattedDetails = {
        ...updatedDetails,
        dob: formatPostDate(updatedDetails.dob),
        doj: formatPostDate(updatedDetails.doj),
         maritialStatus: updatedDetails.maritialStatus,
      };
  
      console.log("Formatted Details (for POST):", formattedDetails);
  
      // Update personal details in state
      setPersonalDetails(formattedDetails);
      setIsModalOpen(false);
      // const response = await axios.post(
      //   "http://192.168.0.105:8080/employeeservice/employee/create",
      //   formattedDetails,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
  
      // console.log("POST Response Data:", response.data);
    // } catch (error) {
    //   console.error("Error during POST request:", error.response?.data || error.message);
    // }


    if (isNewEmployee) {
      // POST request for new employee
      const response = await axios.post(
        "http://192.168.0.119:8080/employeeservice/employee/create",
        formattedDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("POST Response:", response.data);
      const newEmployeeId = response.data.employeeId;
        setEmployeeId(newEmployeeId);
        setIsNewEmployee(false); // Now switch to patch mode
    } else {
      // PATCH request for existing employee

      const patchDetails = {
        ...formattedDetails,
        employeeId: employeeId // Include the employeeId in the PATCH request
      };


      console.log("Employee ID before PATCH request:", employeeId);
      const response = await axios.patch(
        // `http://192.168.0.119:8080/employeeservice/employee/update/${employeeId}`,
       " http://192.168.0.119:8080/employeeservice/employee/update",

        patchDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("PATCH Response:", response.data);
    }
    // Close the modal and update the personal details state
    setPersonalDetails(formattedDetails);
    setIsModalOpen(false);
  } catch (error) {
    console.error("Error during POST/PATCH request:", error.response?.data || error.message);
  }

  };
  

  return (
    <div>
       {/* <Navbar
        title="Personal Details"
        employeeProfileDetails={employeeProfileDetails}
        bgColor="bg-orange-100" // Change background color for this page
      /> */}
      <Navbar />
      {/* <Navbar employeeProfileDetails={employeeProfileDetails} /> */}
      <div>
        <Link to="/">
          <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
            <FaLessThan className="text-orange-500 mr-2" />
            <button>
              <link to=""></link>
              <span className="text font-semibold text-orange-500">
                Previous Page
              </span>
            </button>
          </div>
        </Link>
      </div>

      <div className="flex  justify-center  items-start p-5 mt-16 ">
        <div className="w-2/3 mt-5 bg-white shadow-lg rounded-lg relative">
          <div className="bg-orange-500 text-white p-6 rounded-t-lg">
            {/* <h1 className="text-base sm:text-lg font-bold">
              {personalDetails.firstname} {personalDetails.lastname}
            </h1> */}
          </div>
          <div className="p-8 border border-gray-300 rounded-b-lg relative">
            {/* <div className="absolute top-9 right-8 flex space-x-2"> */}
            <div className="absolute top-9   right-9 flex space-x-2">
              <button
                className="text-black-500 hover:text-orange-700"
                onClick={handleEditClick}
              >
                <FaEdit size={20} />
              </button>
            </div>
            <div className="bg-gray-100 p-5 rounded-md border border-gray-300">
              {/* <div className="grid grid-cols-4 gap-4"> */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-bold">Prefix</p>
                  <p>{personalDetails.prefix}</p>
                </div>
                <div>
                  <p className="font-bold">First Name</p>
                  <p>{personalDetails.firstname}</p>
                </div>
                <div>
                  <p className="font-bold">Last Name</p>
                  <p>{personalDetails.lastname}</p>
                </div>
                <div>
                  <p className="font-bold">Middle Name</p>
                  <p>{personalDetails.middlename}</p>
                </div>
                <div>
                  <p className="font-bold">Phone Number</p>
                  <p>
                    {personalDetails.countryCode} {personalDetails.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="font-bold">Maritial Status</p>
                  <p>{personalDetails.maritialStatus}</p>
                </div>
                <div>
                  <p className="font-bold">Date of Birth</p>
                  <p>{personalDetails.dob}</p>
                </div>
                <div>
                  <p className="font-bold">Gender</p>
                  <p>{personalDetails.gender}</p>
                </div>
                <div>
                  <p className="font-bold">Date of Joining</p>
                  <p>{personalDetails.doj}</p>
                </div>
                {/* <div>
                  <p className="font-bold">Place Of Birth</p>
                  <p>{personalDetails.placeOfBirth}</p>
                </div> */}
                <div>
                  <p className="font-bold">Father's Name</p>
                  <p>{personalDetails.fatherName}</p>
                </div>
                <div>
                  <p className="font-bold">Blood Group</p>
                  <p>{personalDetails.bloodGroup}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <EditFamilyDetails
            member={personalDetails}
            onSave={handleSave}
            onCancel={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};
export default PersonalInfo;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EmployeeProfile = ({ employeeID }) => {
//   const [personalDetails, setPersonalDetails] = useState({});
//   const [isNewEmployee, setIsNewEmployee] = useState(true); // Flag to check if new employee
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetch employee details when component loads
//   useEffect(() => {
//     fetchEmployeeDetails(employeeID);
//   }, [employeeID]);

//   // GET Request to fetch employee details
//   const fetchEmployeeDetails = async (employeeID) => {
//     try {
//       const response = await axios.get(
//         `http://192.168.0.105:8080/employeeservice/employee/${employeeID}`
//       );

//       if (response.data) {
//         // Data exists, it's an existing employee
//         setPersonalDetails(response.data);
//         setIsNewEmployee(false); // Set flag to false to use PATCH
//       } else {
//         // No data, it's a new employee
//         setIsNewEmployee(true); // Set flag to true to use POST
//       }
//     } catch (error) {
//       console.error('Error fetching employee details:', error.message);
//     }
//   };

//   // Handle form submit (Save button)
//   const handleSave = async (formData) => {
//     try {
//       // Format the data (e.g., for date fields)
//       const formattedData = {
//         ...formData,
//         dob: formatDate(formData.dob), // Helper function to format date
//         doj: formatDate(formData.doj), // Helper function to format date
//       };

//       if (isNewEmployee) {
//         // If it's a new employee, use POST to create new record
//         const postResponse = await axios.post(
//           'http://192.168.0.105:8080/employeeservice/employee/create',
//           formattedData
//         );
//         console.log('New profile created:', postResponse.data);
//       } else {
//         // If it's an existing employee, use PATCH to update
//         const patchResponse = await axios.patch(
//           `http://192.168.0.105:8080/employeeservice/employee/update/${employeeID}`,
//           formattedData
//         );
//         console.log('Profile updated:', patchResponse.data);
//       }

//       // Update the UI after a successful save
//       setPersonalDetails(formattedData);
//       setIsModalOpen(false); // Close the modal after saving

//     } catch (error) {
//       console.error('Error saving profile:', error.response?.data || error.message);
//     }
//   };

//   // Function to format dates (dd/mm/yyyy)
//   const formatDate = (date) => {
//     const d = new Date(date);
//     const day = (`0${d.getDate()}`).slice(-2);
//     const month = (`0${d.getMonth() + 1}`).slice(-2);
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <div>
//       <h1>Employee Profile</h1>
//       <div>
//         <button onClick={() => setIsModalOpen(true)}>Edit Profile</button>
//       </div>

//       {/* Modal for editing personal details */}
//       {isModalOpen && (
//         <div className="modal">
//           <h2>Edit Personal Details</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               const formData = {
//                 firstName: e.target.firstName.value,
//                 lastName: e.target.lastName.value,
//                 dob: e.target.dob.value,
//                 doj: e.target.doj.value,
//                 phone: e.target.phone.value,
//               };
//               handleSave(formData); // Call the save function on form submit
//             }}
//           >
//             <input type="text" name="firstName" defaultValue={personalDetails.firstName} />
//             <input type="text" name="lastName" defaultValue={personalDetails.lastName} />
//             <input type="date" name="dob" defaultValue={personalDetails.dob} />
//             <input type="date" name="doj" defaultValue={personalDetails.doj} />
//             <input type="text" name="phone" defaultValue={personalDetails.phone} />

//             <button type="submit">Save</button>
//             <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
//           </form>
//         </div>
//       )}

//       {/* Display personal details in a grid */}
//       <div className="grid">
//         <p>First Name: {personalDetails.firstName}</p>
//         <p>Last Name: {personalDetails.lastName}</p>
//         <p>Date of Birth: {personalDetails.dob}</p>
//         <p>Date of Joining: {personalDetails.doj}</p>
//         <p>Phone: {personalDetails.phone}</p>
//       </div>
//     </div>
//   );
// };

// export default EmployeeProfile;
