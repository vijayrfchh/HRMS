import React, { useEffect, useState } from "react";
import { FaPen, FaRegWindowClose,FaLessThan} from "react-icons/fa";
// import Header from "./Header";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Navbar from './CurrentNav';


const ExperienceCard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    orgName: "",
    empName: "",
    empId: "",
    designation: "",
    doj: "",
    manager: "",
    pay: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [tableData, setTableData] = useState();

  const designationOptions = ["Backend Developer","Bussiness Analyst","Data Analyst","Digital Marketing"," Frontend Developer", "Tester"];
  // const manager=["Manager1","Manager2"]


  useEffect(()=>{
    const fetchCurrentDetails=async()=>{
      try{
        
        const response=await axios.get(`http://192.168.0.119:8080/employeeservice/currentexperience/HRMS1`)
        const data=response.data;
        setFormData({
          orgName: data.organisationName,
          empName: data.employeeName,
          empId: data.employeeId,
          designation: data.designation,
          doj: data.doj,
          manager: data.reportingManager,
          pay: data.pay,
        })
        console.log("Feteched data:",response.data);
      } catch(error){
        console.error('Error fetching Current Experience Details:',error)
      }
    };
    fetchCurrentDetails();
  },[]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); 
  };

  const handleDesignationChange = (e) => {
    setFormData({ ...formData, designation: e.target.value });
    setFormErrors({ ...formErrors, designation: "" });
  };

  const handleManagerChange = (e) => {
    setFormData({ ...formData, manager: e.target.value });
    setFormErrors({ ...formErrors, manager: "" });
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9]*$/;
    if (regex.test(value)) {
      setFormData({ ...formData, [name]: value });
      setFormErrors({ ...formErrors, [name]: "" }); 
    } else {
      setFormErrors({ ...formErrors, [name]: "Only numbers are allowed." });
    }
  };

  const preventManualInput = (e) => {
    e.preventDefault();
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, doj: e.target.value });
    setFormErrors({ ...formErrors, doj: "" });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.empName) {
      errors.empName = "Employee Name is required.";
    } else if (formData.empName.length < 4 || formData.empName.length > 40) {
      errors.empName = "Employee Name should be between 4 and 40 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.empName)) {
      errors.empName = "Employee Name should contain only alphabets and spaces.";
    }

    if (!formData.orgName) {
      errors.orgName = "Organization Name is required.";
    }else if (formData.orgName.length < 4 || formData.orgName.length > 40) {
      errors.orgName = "Organization Name should be between 4 and 40 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.orgName)) {
      errors.orgName = "Organization Name should contain only alphabets and spaces.";
    }

    if (!formData.empId) {
      errors.empId = "Employee ID is required.";
    }else if (formData.empId.length < 4 || formData.empId.length > 40) {
      errors.empId = "Employee ID should be between 4 and 40 characters.";
    } 

    if (!formData.designation) {
      errors.designation = "Designation is required.";
    }

    if (!formData.doj) {
      errors.doj = "Date of Joining is required.";
    }

    if (!formData.manager) {
      errors.manager = "Reporting Manager is required.";
    }
    
    if (!formData.pay) {
      errors.pay = "Pay is required.";
    }else if (!/^\d+$/.test(formData.pay)) {
      errors.pay = "Pay  should contain only numbers.";
    } else if (formData.pay < 0 || formData.pay > 9999999) {
      errors.pay = "Pay should be between 0 and 9,999,999.";
    }
    
    return errors;
  };

  const handleUpdate = async () => {
    const payload = {
      organisationName: formData.orgName.trim(),
      employeeName: formData.empName,
      employeeId: formData.empId,
      designation: formData.designation,
      doj: formData.doj,
      reportingManager: formData.manager,
      pay: Number(formData.pay),
    };
  
    try {
      const response = await axios.patch(`http://192.168.0.119:8080/employeeservice/currentexperience/updateCurrentEmployement`, payload);
      console.log("Data updated:", response.data);
  
      setTableData(formData);
      setIsPopupOpen(false);
      setIsEditMode(false);
      setFormErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const newErrors = {};
  
        backendErrors.forEach((errorMessage) => {
          if (errorMessage.includes("Organization name")) {
            newErrors.orgName = errorMessage;
          } else if (errorMessage.includes("manager name")) {
            newErrors.manager = errorMessage;
          }
        });
  
        setFormErrors(newErrors);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      if (isEditMode) {
        await handleUpdate();
      } else {
        const payload = {
          organisationName: formData.orgName.trim(),
          employeeName: formData.empName,
          employeeId: formData.empId,
          designation: formData.designation,
          doj: formData.doj,
          reportingManager: formData.manager,
          pay: Number(formData.pay),
        };
  
        try {
          const response = await axios.post(`http://192.168.0.119:8080/employeeservice/currentexperience/createCurrentEmployement?employeeId=HRMS1`, payload);
          console.log("Data saved:", response.data);
          // const emp=employeeId;
          setTableData(formData);
          setIsPopupOpen(false);
          setIsEditMode(false);
          setFormErrors({});
          setFormData({
            orgName: "",
            empName: "",
            empId: "",
            designation: "",
            doj: "",
            manager: "",
            pay: "",
          });
        } catch (error) {
          if (error.response && error.response.data) {
            const backendErrors = error.response.data;
            const newErrors = {};
  
            backendErrors.forEach((errorMessage) => {
              if (errorMessage.includes("Organization name")) {
                newErrors.orgName = errorMessage;
              } else if (errorMessage.includes("manager name")) {
                newErrors.manager = errorMessage;
              }
            });
  
            setFormErrors(newErrors);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      }
    } else {
      setFormErrors(errors);
    }
  };
  
  const handleEnter = (e)=>{
    if (e.key === "Enter"){
     e.preventDefault()
    }
 }
 const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
};

  const handleEdit = () => {
    setIsPopupOpen(true);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsEditMode(false);
    setFormData({
      orgName: "",
      empName: "",
      empId: "",
      designation: "",
      doj: "",
      manager: "",
      pay: "",
    });
    setFormErrors("")
  };

  return (
    <>
    <div><Navbar/> </div>
    <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
                <FaLessThan className="text-orange-500 mr-2" /><Link to='/'>                <button><span className="text font-semibold text-orange-500">Previous Page</span></button>
                </Link>
        </div>
    <div className="mr-48 ml-48 border border-black rounded-t-md">
      <div className="bg-orange-500  text-white p-2 rounded-t-md">
         <h2 className="font-semibold">Current Experience</h2>
      </div>
      <div className="bg-white p-2  border-1 border-black flex justify-between items-center">
        <span className="font-semibold">Current Experience</span>
        <button className="flex items-center bg-gray-300 p-1 rounded mr-2" onClick={handleEdit}>
            <FaPen className="text-black cursor-pointer" />
         </button>   
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-gray-400 px-4 py-2">Organisation Name</th>
              <th className="border border-gray-400 px-4 py-2">Employee Name</th>
              <th className="border border-gray-400 px-4 py-2">Employee ID</th>
              <th className="border border-gray-400 px-4 py-2">Designation</th>
              <th className="border border-gray-400 px-4 py-2">Date Of Joining</th>
              <th className="border border-gray-400 px-4 py-2">Reporting Manager</th>
              <th className="border border-gray-400 px-4 py-2">Pay</th>
            </tr>
          </thead>
          <tbody>
            {tableData ? (
              <tr>
                <td className="border border-gray-400 px-4 py-2 text-center">{tableData.orgName}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{tableData.empName}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{tableData.empId}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{tableData.designation}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{formatDate(tableData.doj)}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{tableData.manager}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{tableData.pay}</td>
              </tr>
               ) : (
                <tr>
                    <td className="border border-gray-400 px-4 py-2 text-center" colSpan="7">
                      No Experience Added
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

       {isPopupOpen && (
        <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50 ">
          <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center mb-8 bg-orange-500 rounded-lg pl-2 pr-2 w-full p-2">
              <h3 className=" text-xl  w-full">{isEditMode ? "Add Current Experience Details" : "Enter Details"}</h3>
               <button ><FaRegWindowClose   size={24} className="text-black  text-xl cursor-pointer" onClick={handleCancel}/></button>
            </div>
            <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4 " >
              <div className="col-span-1 ">
                <label  className="block mb-1 ">Emp Name:</label>
                <input
                  type="text"
                  name="empName"
                  value={formData.empName}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
                        setFormData({ ...formData, empName: value });
                        setFormErrors({ ...formErrors, empName: "" });}
                    }}
                 
                  className="w-full p-1 border border-gray-300 rounded-lg"
                />
                {formErrors.empName && <p className=" text-red-600 text-sm mt-1">{formErrors.empName}</p>}
               </div>
               <div className="col-span-1 ">
                <label className="block mb-1 ">Org Name:</label>
                <input
                  type="text"
                  name="orgName"
                  value={formData.orgName}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
                        setFormData({ ...formData, orgName: value });
                        setFormErrors({ ...formErrors, orgName: "" });}
                    }}
                  
                  className="w-full p-1 border border-gray-300 rounded-lg"
                />
                {formErrors.orgName && <p className="text-red-600 text-sm mt-1">{formErrors.orgName}</p>}
                </div>
                
               <div className="col-span-1 ">
                <label className="block mb-1 ">Emp ID:</label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleInputChange}
                  minLength={4}
                  maxLength={20}
                 
                  className="w-full p-1 border border-gray-300 rounded-lg"
                />
                {formErrors.empId && <p className="text-red-600 text-sm mt-1">{formErrors.empId}</p>}
                </div>
                <div className="col-span-1 ">
                <label className="block mb-1 ">Designation:</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleDesignationChange}
                  className="w-full p-1 border border-gray-300 rounded-lg"
                 
                >
                  <option value="">Select Designation</option>
                  {designationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formErrors.designation && <p className="text-red-600 text-sm mt-1">{formErrors.designation}</p>}
               </div>
               <div className="col-span-1 ">
                <label className="block mb-1 ">Date Of Joining:</label>
                <input
                  type="date"
                  id="doj"
                  value={formData.doj}
                  onChange={handleDateChange}
                  className="w-full p-1 border border-gray-300 rounded-lg"
                  onKeyDown={preventManualInput}
                  onClick={(e) => e.target.readOnly = false}  
                  
                />
                {formErrors.doj && <p className="text-red-600 text-sm mt-1">{formErrors.doj}</p>}
                </div>
                <div className="col-span-1 ">
                <label className="block mb-1 ">Reporting Manager:</label>
                {/* <select
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleManagerChange}
                  // minLength={4}
                  // maxLength={40}
                  className="w-full p-1 border border-gray-300 rounded-lg"
                  >
                  <option value="">Select Manager</option>
                  {manager.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select> */}
                <input
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
                        setFormData({ ...formData, manager: value });
                        setFormErrors({ ...formErrors, manager: "" });}
                    }}
                 
                  className="w-full p-1 border border-gray-300 rounded-lg"
                />
                {formErrors.manager && <p className="text-red-600 text-sm mt-1">{formErrors.manager}</p>}
                </div>
                <div className="col-span-1 ">
                  <label className="block mb-1 ">Pay:</label>
                  <input
                    type="text"
                    name="pay"
                    value={formData.pay}
                    onChange={handleNumericChange}
                    minLength={4}
                    maxLength={40}
                    className="w-full p-1 border border-gray-300 rounded-lg"
                  />
                  {formErrors.pay && <p className="text-red-600 text-sm mt-1">{formErrors.pay}</p>}
               </div>
              </div>
              <div className="  mt-5 flex justify-end space-x-4">
              <button type="submit"  onClick={handleSubmit} className=" border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ">
               {isEditMode ? "Save " : "Submit"} 
              </button>
              <button
                onClick={handleCancel}
                className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ">Cancel
              </button>
            </div>
            </form>

          </div>
        </div>
       )}
     </div>
    </>
  );
};

export default ExperienceCard;