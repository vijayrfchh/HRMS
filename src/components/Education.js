import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { FaLessThan } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import axios from "axios";
import {Link} from "react-router-dom"
import Navbar from "./EducationNav"

function Laxman() {
  const initialData = {
    education: "",
    institutionName: "",
    universityName: "",
    degree: "",
    majors: "",
    yearOfPass: "",
    certificationDate: "",
    percentage: "",
    state: "",
    country: "",
    //attachments: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [EducateLabel, setEducateLabel] = useState({
    institutionName: "InstitutionName",
    universityName: "UniversityName",
    degree: "Degree",
    majors: "Majors",
  });

  const educationOptions = ["SSC", "Inter", "Diploma","Graduation", "Post Graduation"];


  const formatPostDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.119:8080/employeeservice/education/HRMS1`);
        const data = response.data
        
        console.log(data);
        setFormData({

          education: data.education,
          institutionName: data.institutionName,
          universityName: data.universityName,
          degree: data.degree,
          majors: data.majors,
          yearOfPass: data.yearOfPass,
          certificationDate: data.certificationDate,
          percentage: data.percentage,
          state: data.state,
          country: data.country,
        
        })

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  

  useEffect(() => {
    if (formData.education) {
      switch (formData.education) {
        case "SSC":
          setEducateLabel({
            institutionName: "School Name",
            universityName: "universityName",
            degree: "degree",
            majors: "majors",
          });
          break;
        case "Inter":
          setEducateLabel({
            institutionName: "College Name",
            universityName: "universityName",
            degree: "degree",
            majors: "majors",
          });
          break;
          case "Diploma":
            setEducateLabel({
              institutionName: "College Name",
              universityName: "University",
              degree: "degree",
              majors: "majors",
            });
            break;
        case "Graduation":
          setEducateLabel({
            institutionName: "College Name",
            universityName: "University",
            degree: "degree",
            majors: "majors",
          });
          break;
        case "Post Graduation":
          setEducateLabel({
            institutionName: "College Name",
            universityName: "University",
            degree: "degree",
            majors: "majors",
          });
          break;
        default:
          setEducateLabel({
            institutionName: "School Name",
            universityName: "universityName",
            degree: "degree",
            majors: "majors",
          });
      }
    }
  }, [formData.education]);

  const validateForm = () => {
    let newErrors = {};
    const currentYe = new Date().getFullYear();
    const previousYear = currentYe - 100;

    if(formData.education === ''){
      newErrors.education = 'Select One'
    }

    if (!formData.institutionName.match(/^[A-Za-z\s]{4,40}$/)) {
      newErrors.institutionName = `${EducateLabel.institutionName} must be 4-40 characters and contain only letters.`;
    }

    if (!formData.universityName.match(/^[A-Za-z\s]{4,40}$/)) {
      newErrors.universityName = `${EducateLabel.universityName} must be 4-40 characters and contain only letters.`;
    }

    if (!formData.degree.match(/^[A-Za-z\s]{3,40}$/)) {
      newErrors.degree =
        "degree must be 3-40 characters and contain only letters.";
    }

    if (!formData.majors.match(/^[A-Za-z\s]{3,40}$/)) {
      newErrors.majors =
        "majors must be 3-40 characters and contain only letters.";
    }

    if (!formData.yearOfPass) {
      newErrors.yearOfPass = 'Year of passing is required';
    } else if (isNaN(formData.yearOfPass)) {
      newErrors.yearOfPass = 'Year of passing must be a valid number';
    } else if (formData.yearOfPass < previousYear || formData.yearOfPass > currentYe) {
      newErrors.yearOfPass = `Year of passing must be between ${previousYear} and ${currentYe}`;
    }
    
   
    if (!formData.certificationDate) {
      newErrors.certificationDate = "Certificate Issue Date is required.";
    }

    if (
      !formData.percentage.match(/^\d{1,3}(\.\d{0,1})?$/) ||
      parseFloat(formData.percentage) < 0 ||
      parseFloat(formData.percentage) > 100
    ) {
      newErrors.percentage =
        "percentage/Grade must be a number between 0 and 100";
    }

    if (!formData.state.match(/^[A-Za-z\s]{4,40}$/)) {
      newErrors.state =
        "state must be 3-40 characters and contain only letters.";
    }

    if (!formData.country.match(/^[A-Za-z\s]{4,40}$/)) {
      newErrors.country =
        "country must be 4-40 characters and contain only letters.";
    }

  /*   if (!formData.Attachments) {
      newErrors.Attachments = "Attachments is required.";
    }
 */
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  

   // Handle form submission (POST/PATCH)
   const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const formatPostDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;  // Converts from "dd/MM/yyyy" to "yyyy-MM-dd"
      };
      
      try {
        const updatedFormData = {
          ...formData,
          certificationDate: formatPostDate(formData.certificationDate),
        };
        console.log("Updated Form Data: ", updatedFormData);
  
        if (editIndex !== null) {
          console.log("Edit Index: ", editIndex);
          const patchResponse = await axios.patch(
            `http://192.168.0.119:8080/employeeservice/education/updateEducationDetails?employeeId=HRMS1`,
            updatedFormData
          );
          console.log("Patch response: ", patchResponse);
  
          const updatedTableData = tableData.map((row, index) => 
            index === editIndex ? updatedFormData : row
          );
          console.log("Updated Table Data: ", updatedTableData);
          setTableData(updatedTableData);
  
        } else {
          const response = await axios.post(
            `http://192.168.0.119:8080/employeeservice/education/createEducationDetails?employeeId=HRMS1`,
            updatedFormData
          );
          const data = response.data;
  
          setTableData([...tableData, data]);
  
          setFormData({
            education: data.education,
            institutionName: data.institutionName,
            universityName: data.universityName,
            degree: data.degree,
            majors: data.majors,
            yearOfPass: data.yearOfPass,
            certificationDate: data.certificationDate,
            percentage: data.percentage,
            state: data.state,
            country: data.country,
          });
        }
  
        handleClosePopup();
  
      } catch (error) {
        console.error("Error submitting data:", error.response ? error.response.data : error.message);
      }
    }
  };
  

  const handleCertification = (e)=>{
    e.preventDefault()

  }
  
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

 

   // Handle deleting a record (DELETE)
   const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.0.119:8080/employeeservice/education/deleteeducationDetails/${id}`);
      setTableData(tableData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleAddRow = () => {
    handleOpenPopup();
  };

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
     // Update the form data
     setFormData({ ...formData, [name]: value });
    
     // Clear errors while typing
     setErrors({ ...errors, [name]: '' });
    

    
    if (name === "percentage") {
      // Allow only numbers with one decimal point
      if (/^\d*\.?\d{0,1}$/.test(value)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else if (
      ["SchoolName", "universityName", "degree", "majors", "state", "country"].includes(
        name
      )
    ) {
      // Allow only alphabetic characters and spaces
      if (/^[a-zA-Z].*[\s\.]*$/.test(value) || value === "") {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
  };
  // Handle Year of Passing input specifically
  const handleYearChange = (e) => {
    const inputYear = e.target.value;

    // Allow only up to 4 digits for year input
    if (/^\d{0,4}$/.test(inputYear)) {
      setFormData({ ...formData, yearOfPass: inputYear });
    }

    // Clear the error while typing
    setErrors({ ...errors, yearOfPass: '' });
  };
  return (
    <div>
      <div><Navbar/></div>
      <div className="mr-10 ml-6">
        <div className="flex flex-row text-left justify-start px-3 py-2  border-2 border-orange-500 rounded-md w-[160px] mb-5 mt-5">
          <FaLessThan className="text-black mr-1 mt-1" />
          <Link to='/'>
          <button>
            <span className="text font-semibold text-black">Previous Page</span>
          </button>
          </Link>
         
        </div>
      </div>
      <div>
        <div className="p-4 pt-5 mt-5 ml-48 mr-48">
          <table className="w-full">
            <thead>
              <tr>
                <th
                  className="py-2 px-4 text-left bg-orange-500 text-white rounded-t-md"
                  colSpan="12"
                >
                  Lakshman
                </th>
              </tr>
              <tr>
                <th className="py-2 px-4 text-left" colSpan="11">
                  Education Details
                </th>
                <th
                  className="inline-block cursor-pointer mr-4 py-1 px-4 text-right bg-green-600 m-2 text-white border-rounded"
                  onClick={handleAddRow}
                >
                  <button type="button">Add</button>
                </th>
              </tr>
            </thead>
            <tbody className="border border-black border-collapse">
              <tr>
                <th className="py-2 px-1 border-b-black border-2 border-solid border-black text-center">
                  Education
                </th>
                <th className="py-2 px-1 border-b-black border-2 border-solid border-black text-center">
                 Institution Name
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                 University Name
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  Degree
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  Majors
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  Year of Passing
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  Certificate Issue Date
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  Percentage/Grade
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  State
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  Country
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  Attachments
                </th>
                <th className="py-2 px-2 border-b-black border-2 border-solid border-black text-center">
                  Actions
                </th>
              </tr>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.education}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.institutionName}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.universityName}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.degree}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.majors}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.yearOfPass}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.certificationDate}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.percentage}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.state}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.country}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center  max-w-[100px]  overflow-x-auto">
                    {row.Attachments}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r   max-w-[100px]  overflow-x-auto text-center">
                    <div className="flex flex-row justify-center">
                      <TiPencil
                        className="inline-block mr-4 cursor-pointer text-lg"
                        onClick={() => handleOpenPopup(index)}
                      />
                      {index !== 0 && (
                        <RiDeleteBin6Line
                          className="inline-block cursor-pointer "
                          onClick={() => handleDelete()}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-200 w-3/4 h-auto border-2 p-4 rounded-md relative">
              <div className="flex items-center justify-between mb-4 bg-orange-500 m-2 rounded-lg">
                <h2 className="p-1 m-1 text-xl">
                  {editIndex !== null
                    ? "Edit education Details"
                    : "Add education Details"}
                </h2>
                <MdCancelPresentation
                  className="text-xl mr-2 cursor-pointer"
                  onClick={handleClosePopup}
                />
              </div>
              <form
                onSubmit={handleFormSubmit}
                onKeyDown={handleEnter}
                className="text-left rounded-lg"
              >
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div>
                    <label
                      htmlFor="education"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      education
                    </label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    >
                      <option value="">Select education</option>
                      {educationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.education && (
                      <p className="text-red-500 text-xs">{errors.education}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="institutioname"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      {EducateLabel.institutionName}
                    </label>
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    />
                    {errors.institutionName && (
                      <p className="text-red-500 text-xs">
                        {errors.institutionName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="universityName"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      {EducateLabel.universityName}
                    </label>
                    <input
                      type="text"
                      name="universityName"
                      value={formData.universityName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    />
                    {errors.universityName && (
                      <p className="text-red-500 text-xs">{errors.universityName}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="degree"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      {EducateLabel.degree}
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    />
                    {errors.degree && (
                      <p className="text-red-500 text-xs">{errors.degree}</p>
                    )}
                  </div> 
                  <div>
                    <label
                      htmlFor="majors"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      {EducateLabel.majors}
                    </label>
                    <input
                      type="text"
                      name="majors"
                      value={formData.majors}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    />
                    {errors.majors && (
                      <p className="text-red-500 text-xs">{errors.majors}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="yearOfPass"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      Year of Passing
                    </label>
                    <input
          type="text"
          name="yearOfPass"
          value={formData.yearOfPass}
          onChange={handleYearChange}
         
          className="mt-1 block w-full border border-gray-300 p-2 rounded"
          placeholder={`${minYear} - ${currentYear}`}
        />
        {errors.yearOfPass && (
          <p className="text-red-500 text-sm mt-1">{errors.yearOfPass}</p>
        )}
                
                  </div>
                  <div>
                    <label
                      htmlFor="certificationDate"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      Certificate Issue Date
                    </label>
                    <input
                      type="date"
                      name="certificationDate"
                      value={formData.certificationDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]}
                      // onKeyDown={handleCertification}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    />
                    {errors.certificationDate && (
                      <p className="text-red-500 text-xs">
                        {errors.certificationDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="percentage"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      percentage/Grade
                    </label>
                    <input
                      type="text"
                      name="percentage"
                      maxLength={4}
                      value={formData.percentage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    />
                    {errors.percentage && (
                      <p className="text-red-500 text-xs">
                        {errors.percentage}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1 text-gray-700 font-medium"
                    >
                      country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300  p-2 rounded"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-xs">{errors.country}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="Attachments"
                      className="mb-1 text-gray-700  font-medium"
                    >
                      Attachments
                    </label>
                    <input
                      type="file"
                      name="Attachments"
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          Attachments: e.target.files[0]?.name || "",
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded"
                    />
                    {errors.Attachments && (
                      <p className="text-red-500 text-xs">
                        {errors.Attachments}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end mt-4 ">
                    <div>
                    <button
                      type="submit"
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3 mb-2"
                      
                    >
                      Save
                    </button>
                    </div>
                    <div>
                    <button
                      onClick={handleClosePopup}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mb-2"
                    >
                      Cancel
                    </button>
                    </div>
                  </div>

                 
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Laxman;