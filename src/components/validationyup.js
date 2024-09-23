// import React, { useState } from "react";
// import { FaEdit } from "react-icons/fa";
// import EditFamilyDetails from "./EditFamilyDetails"; 

// const Validationyup = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [personalDetails, setPersonalDetails] = useState({
//     prefix:"", 
//     firstname: "",
//     middlename:'',
//     lastname:'',
//     phoneNumber: "",
//     maritalStatus: "Unmarried",
//     dob: "2000-06-06",  
//     gender: "Male",
//     fatherName: "Veraphan",
//     dateOfJoining: "2024-06-06", 
//     bloodGroup: "O+"
//   });

//   const handleEditClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleSave = (updatedDetails) => {
//     setPersonalDetails(updatedDetails);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="flex justify-center items-center p-40">
//       {/* Main Container */}
//       <div className="w-2/3 bg-white shadow-lg rounded-lg relative">
//         {/* Header Section */}
//         <div className="bg-orange-500 text-white p-4 rounded-t-lg ">
//           <h1 className="text-lg font-bold">Personal Information  </h1>
//         </div>
        
//         {/* Details Section */}
//         <div className="p-4 border border-gray-300 rounded-b-lg relative">
//           {/* Icon Buttons */}
//           <div className="absolute top-9 right-8 flex space-x-2">
//             <button className="text-black-500 hover:text-orange-700" onClick={handleEditClick}>
//               <FaEdit size={20} />
//             </button>
//             {/* <button className="text-black-500 hover:text-red-700">
//               <FaTrash size={20} />
//             </button> */}
//           </div>

//           <div className="bg-gray-200 p-4 rounded-md border border-gray-300">
//             {/* Grid Layout for Personal Information */}
//             <div className="grid grid-cols-4 gap-4">
//             <div>
//                 <p className="font-bold">Prefix</p>
//                 <p>{personalDetails.prefix}</p>
//               </div>
//               <div>
//                 <p className="font-bold">First Name</p>
//                 <p>{personalDetails.firstname}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Middle Name</p>
//                 <p>{personalDetails.middlename}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Last Name</p>
//                 <p>{personalDetails.lastname}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Phone Number</p>
//                 <p>{personalDetails.phoneNumber}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Marital Status</p>
//                 <p>{personalDetails.maritalStatus}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Date Of Birth</p>
//                 <p>{personalDetails.dob}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Gender</p>
//                 <p>{personalDetails.gender}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Father Name</p>
//                 <p>{personalDetails.fatherName}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Date Of Joining</p>
//                 <p>{personalDetails.dateOfJoining}</p>
//               </div>
//               <div>
//                 <p className="font-bold">Blood Group</p>
//                 <p>{personalDetails.bloodGroup}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal for Editing Details */}
//       {isModalOpen && (
//         <EditFamilyDetails
//           member={personalDetails}
//           onSave={handleSave}
//           onCancel={handleModalClose}
//         />
//       )}
//     </div>
//   );
// };

// export default Validationyup;