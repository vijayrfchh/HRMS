import React from "react";
import { SlEnvolope } from "react-icons/sl";
import { IoNotifications } from "react-icons/io5";

const Navbar = ({ employeeProfileDetails }) => {
  return (
    <div className="flex justify-between items-center p-2 bg-white shadow-md rounded-md">
      <img
        src="/rfchh.jpg"
        alt="Logo"
        className="h-11 w-12 object-cover rounded-xl"
      />
      <h1 className="text-xl font-bold ml-44">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <i>
          <SlEnvolope size={20} />
        </i>
        <i>
          <IoNotifications size={20} />
        </i>
        <div className="flex items-center">
          <img
            src="/rfchh.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="mr-2">{employeeProfileDetails?.firstname}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

// Navbar.js
// import React from "react";

// const Navbar = ({ title, employeeProfileDetails, bgColor = "bg-gray-100" }) => {
//   return (
//     <div className={`p-4 ${bgColor} shadow-md`}>
//       {/* Navbar Content */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-xl font-bold">{title}</h1>
//         </div>
//         <div className="flex items-center justify-start space-x-4">
//           {/* Profile Section */}
//           <div className="flex items-center space-x-2">
//             <img
//               src="/Rfchh logo"
//               alt="Profile"
//               className="w-10 h-10 border border-black rounded-full"
//             />
//             <div>
//               <h2 className="font-semibold">
//                 {employeeProfileDetails?.firstname} (
//                 {employeeProfileDetails?.employeeId})
//               </h2>
//               <p>{employeeProfileDetails?.employeeDesignation}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
