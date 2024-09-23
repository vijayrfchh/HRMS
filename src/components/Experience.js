
import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { FaLessThan } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import axios from "axios";
import {Link} from 'react-router-dom'
// import './App.css'; 
import Navbar from "./ExperienceNav.js"

function App() {
  const initialData = {
    organisationName: "",
    id: "",
    designation: "",
    doj: "",
    doe: "",
    Experience: "",
    state: "",
    country: "",
    Attachment: "",
  };


    // Retrieve table data from localStorage
    // const getStoredData = () => {
    //   const storedData = localStorage.getItem('tableData');
    //   return storedData ? JSON.parse(storedData) : [];
    // };
  
    // Store table data to localStorage
    const saveDataToLocalStorage = (data) => {
      localStorage.setItem('tableData', JSON.stringify(data));
    };

  const [formData, setFormData] = useState({ ...initialData });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
  const employRegex = /^[a-zA-Z0-9\-/]*$/;

  useEffect(() => {
    const fetchCurrentDetails = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.119:8080/employeeservice/experience/HRMS1"
        );
        const data = response.data[0];
        setFormData({
          organisationName: data.organisationName,
          id: data.id,
          designation: data.designation,
          doj: data.doj,
          doe: data.doe,
          Experience: data.experience,
          state: data.state,
          country: data.country,
          Attachment: "",
        });
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching Current Experience Details:", error);
      }
    };
    fetchCurrentDetails();
  },[]);

  
  useEffect(() => {
    // Save tableData to localStorage whenever it changes
    saveDataToLocalStorage(tableData);
  }, [tableData]);

  const validateForm = () => {
    let newError = {};

    if (formData.organisationName === "") {
      newError.organisationName = "Required Org.name";
    } else if (formData.organisationName.length < 4) {
      newError.organisationName = "Min 4 Characters";
    } else if (formData.organisationName.length > 40) {
      newError.organisationName = "Max 40 Characters";
    } else if (!nameRegex.test(formData.organisationName)) {
      newError.organisationName = "Must start with a Character";
    }

    if (formData.id === "") {
      newError.id = "Required id";
    } else if (formData.id.length < 4) {
      newError.id = "Min 4 Characters";
    } else if (formData.id.length > 20) {
      newError.id = "Max 20 Characters";
    } else if (!employRegex.test(formData.id)) {
      newError.id = "Enter Valid Emp.Id, spaces not allowed";
    }

  

    if (formData.doj === "") {
      newError.doj = "Date of Joining is required";
    }
    if (formData.doe === "") {
      newError.doe = "Date of Exit is required";
    }

 

    if (formData.Experience === "") {
      newError.Experience = "Experience is required";
    }

   


    if (formData.state === "") {
      newError.state = "Required state";
    } else if (formData.state.length < 4) {
      newError.state = "Min 4 Characters";
    } else if (formData.state.length > 40) {
      newError.state = "Max 40 Characters";
    } else if (!nameRegex.test(formData.state)) {
      newError.state = "Enter only Characters";
    }

    if (formData.country === "") {
      newError.country = "country is required";
    } else if (formData.country.length < 1) {
      newError.country = "Min 1 Character";
    } else if (formData.country.length > 40) {
      newError.country = "Max 40 Characters";
    } else if (!nameRegex.test(formData.country)) {
      newError.country = "Enter Only Characters";
    }

    

    if (formData.designation === "") {
      newError.designation = "Choose any one";
    }

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const calculateExperience = (dateOfJoining, dateOfExit) => {
    const joinDate = new Date(dateOfJoining);
    const exitDate = new Date(dateOfExit);

    if (exitDate <= joinDate) {
      return "Invalid dates";
    }

    const diffTime = exitDate - joinDate;
    const diffYears = Math.floor(diffTime / (1000 *  60 * 60 * 24 * 365));
    const diffMonths = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );
    const diffDays = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
    );

    return `${diffYears} years, ${diffMonths} months, ${diffDays} days`;
  };

  const handleOpenPopup = (index = null) => {
    if (index !== null) {
      setFormData({ ...tableData[index] });
      setEditIndex(index);
    } else {
      setFormData({ ...initialData });
      setEditIndex(null);
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditIndex(null);
  };

  const preventManualInput = (e) => {
    if (e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  const formatPostDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check form validation
    if (!validateForm()) {
        console.log("Failed to submit: Form validation failed.");
        return;
    }

    // Format the necessary date fields using the pre-declared formatPostDate function
    const updatedFormData = {
        ...formData,
        doj: formatPostDate(formData.doj),
        doe: formatPostDate(formData.doe),
    };

    // Log the updated form data to inspect the changes
    console.log("Form Data being sent after formatting:", updatedFormData);

    try {
        if (editIndex !== null) {
            // PATCH request to update an existing entry
            const employeeId = tableData[editIndex]?.employeeId; // Retrieve the employee ID

            if (!employeeId) {
                console.error("No valid employee ID found for the PATCH request.");
                alert("Unable to update the record. No valid employee ID found.");
                return;
            }

            // Perform the PATCH request
            const response = await axios.patch(
                `http://192.168.0.119:8080/employeeservice/experience/${employeeId}`,
                updatedFormData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("Data successfully updated:", response.data);

            // Update the table data with the new information
            const updatedTableData = tableData.map((row, index) =>
                index === editIndex ? { ...row, ...updatedFormData } : row
            );
            setTableData(updatedTableData);
        } else {
            // POST request for creating a new entry
            const response = await axios.post(
                'http://192.168.0.119:8080/employeeservice/experience/createExperienceDetails?employeeId=HRMS1',
                updatedFormData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("Data successfully posted:", response.data);

            // Add the newly created row to the table data
            setTableData([...tableData, { ...updatedFormData, employeeId: response.data.employeeId }]);
        }

        // Reset form data after successful submission
        setFormData({
            orgName: '',
            empId: '',
            designation: '',
            doj: '',
            doe: '',
            experience: '',
            state: '',
            country: '',
            attachment: '',
        });

        // Reset editIndex and close the popup
        setEditIndex(null);
        handleClosePopup();

    } catch (error) {
        console.error("Error during request:", error.response?.data || error.message);
        alert("There was an error saving the experience details. Please try again.");
    }
};





  


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const today = new Date(); 
  
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      if (updatedData.doj && updatedData.doe) {
        const joinDate = new Date(updatedData.doj);
        const exitDate = new Date(updatedData.doe);
        const MINIMUM_DAYS = 10;
  
        const diffTime = exitDate - joinDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
        
        if (exitDate > today) {
          updatedData.Experience = "";
          setErrors((prevErrors) => ({
            ...prevErrors,
            doe: "Date of Exit cannot be a future date",
          }));
        } else if (joinDate < exitDate && diffDays >= MINIMUM_DAYS) {
          updatedData.Experience = calculateExperience(
            updatedData.doj,
            updatedData.doe
          );
          setErrors((prevErrors) => ({
            ...prevErrors,
            doe: "",
          }));
        } else if (joinDate >= exitDate) {
          updatedData.Experience = "";
          setErrors((prevErrors) => ({
            ...prevErrors,
            doe: "Date of Exit must be after Date of Joining",
          }));
        } else {
          updatedData.Experience = "";
          setErrors((prevErrors) => ({
            ...prevErrors,
            doe: `Experience must be at least ${MINIMUM_DAYS} days`,
          }));
        }
      } else {
        updatedData.Experience = "";
      }
  
      return updatedData;
    });
  };
  

  const handleEmployeeIdChange = (e) => {
    const { name, value } = e.target;

    if (employRegex.test(value)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, id: "" }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id: "Spaces not allowed",
      }));
    }
  };

  const handleNameChar = (e) => {
    const key = e.key;
    const value = e.target.value;

    if ((value === "" && key === " ") || !/[a-zA-Z\s]/.test(key)) {
      e.preventDefault();
    }
  };

  const handleName = (e) => {
    const key = e.key;
    if (!/[a-zA-Z]/.test(key)) {
      e.preventDefault();
    }
  };
  


  

  const handleEnter = (e)=>{
    if (e.key === "Enter"){
     e.preventDefault()
    }
 }


  const handleDelete = (index) => {
    const updatedTableData = tableData.filter((_, i) => i !== index);
    setTableData(updatedTableData);
  };

  const handleAddRow = () => {
    handleOpenPopup();
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };
  



  return (
    <div>
      <div><Navbar/></div>
      
    <div>
        <div className="mr-10 ml-6">
        <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
                <FaLessThan className="text-orange-500 mr-2" />
              <Link to='/'><button><span className="text font-semibold text-orange-500">Previous Page</span></button></Link>  
        </div>
        </div>
      <div>
          
      <div className="pt-5 mt-5 ml-3 md:ml-20 lg:ml-40 mx-auto mr-3 md:mr-20 lg:mr-40">
  
  <div className="overflow-x-auto">
    <table className="w-full min-w-[440px]">
      <thead>
        <tr>
          <th className="py-5 px-4 text-left bg-orange-500 text-white rounded-t-md" colSpan="12">
        
          </th>
        </tr>
        <tr className="border border-black">
          <th className="py-2 px-4 text-left" colSpan="9">
            Experience
          </th>
          <th
            className="inline-block cursor-pointer mr-2 py-1 px-4 text-right bg-green-600 m-2 text-white border-rounded rounded-md"
            onClick={handleAddRow}
          >
            <button type="button">Add</button>
          </th>
        </tr>
      </thead>
      <tbody className="border border-black border-collapse">
        <tr>
          
          <th className="py-2 px-1 border-b-black border-2 border-solid border-black w-1/5 text-center">Org Name</th>
          <th className="py-2 px-1 border-b-black border-2 border-solid border-black text-center w-1/6">Employee Id</th>
          <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">designation</th>
          <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center w-1/4">Date of Joining</th>
          <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center w-1/4">Date of Exit</th>
          <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Experience</th>
          <th className="py-2 px-4 border-b-black border-2 border-solid border-black text-center w-1/6">State</th>
          <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">country</th>
          <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Attachment</th>
          <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">Actions</th>
        </tr>

        {tableData.map((row, index) => (
          <tr key={index}>
            
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] overflow-x-auto">{row.organisationName}</td>
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] overflow-x-auto">{row.id}</td>
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] overflow-x-auto">{row.designation}</td>
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-x-auto">{formatDate(row.doj)}</td>
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center overflow-x-auto">{formatDate(row.doe)}</td>
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] overflow-x-auto">{row.Experience}</td>
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] overflow-x-auto">{row.state}</td>
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] overflow-x-auto">{row.country}</td>
            <td className="py-2 px-2 border-b border-gray-900 border-r text-center max-w-[80px] overflow-x-auto">{row.Attachment}</td>
            <td className="py-2 px-4 border-b border-gray-900 text-right">
              <div className="flex flex-row">
                <TiPencil className="mr-2 cursor-pointer text-black-500 text-xs sm:text-sm" onClick={() => handleOpenPopup(index)} />
                {index !== 0 && (
                  <RiDeleteBin6Line
                    className="cursor-pointer text-black-500 text-xs sm:text-sm"
                    onClick={() => handleDelete(index)}
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



      {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div
                className="bg-gray-200 p-2 sm:p-4 rounded-lg shadow-lg w-[95%] max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4 bg-orange-500 p-2 rounded-t-md">
                  <h2 className="text-lg text-white font-semibold">
                    {editIndex !== null ? "Edit Experience Details" : "Add New Experience"}
                  </h2>
                  <MdCancelPresentation
                    className="text-xl cursor-pointer text-white"
                    onClick={handleClosePopup}
                  />
                </div>
                <form onSubmit={handleFormSubmit} onKeyDown={handleEnter}>
                
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Organization Name:</label>
                      <input
                        type="text"
                        name="organisationName"
                        value={formData.organisationName}
                        onKeyDown={handleNameChar}
                        onChange={handleChange}
                        className="p-1 border border-gray-300 rounded-lg"
                        minLength={4}
                        maxLength={40}
                      />
                      {errors.organisationName && (
                        <p className="text-red-500">{errors.organisationName}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Employee ID:</label>
                      <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleEmployeeIdChange}
                        minLength={4}
                        maxLength={20}
                        className="p-1 border border-gray-300 rounded-lg"
                      />
                      {errors.id && <p className="text-red-500">{errors.id}</p>}
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">designation:</label>
                      <select
                        className="p-1 border border-gray-300 rounded-lg"
                        name="designation"
                        value={formData.designation}
                        
                        onChange={handleChange}>
                        <option value="" disabled hidden>Select designation</option> 
                        <option value="Front-end Developer">Front-end Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Tester">Tester</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                      </select>
                      {errors.designation && <p className="text-red-500">{errors.designation}</p>}
                    </div>
                  
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Date of Joining:</label>
                      <input
                        type="date"
                        name="doj"
                        value={formData.doj}
                        onChange={handleChange}
                        onKeyDown={preventManualInput}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]}
                        className="p-1 border border-gray-300 rounded-lg"
                      />
                      {errors.doj && <p className="text-red-500">{errors.doj}</p>}
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Date of Exit:</label>
                      <input
                        type="date"
                        name="doe"
                        value={formData.doe}
                        onChange={handleChange}
                        onKeyDown={preventManualInput}
                        max={new Date().toISOString().split("T")[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]}
                        className="p-1 border border-gray-300 rounded-lg"
                      />
                      {errors.doe && <p className="text-red-500">{errors.doe}</p>}
                    </div>
                  
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Experience:</label>
                      <input
                        type="text"
                        name="Experience"
                        value={formData.Experience}
                        readOnly
                        className="p-1 border border-gray-300 rounded-lg"
                      />
                      {errors.Experience && <p className="text-red-500">{errors.Experience}</p>}
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">state:</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        onKeyDown={handleNameChar}
                        minLength={4}
                        maxLength={40}
                        className="p-1 border border-gray-300 rounded-lg"
                      />
                      {errors.state && <p className="text-red-500">{errors.state}</p>}
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">country:</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onKeyDown={handleName}
                        minLength={4}
                        maxLength={40}
                        className="p-1 border border-gray-300 rounded-lg"
                      />
                      {errors.country && <p className="text-red-500">{errors.country}</p>}
                    </div>
                  
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Attachment:</label>
                      <input
                        type="file"
                        name="Attachment"
                        onChange={handleChange}
                        className="p-1 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3 mb-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
     
     </div>
    </div>
     </div>
   );
 } 
 export default App;
