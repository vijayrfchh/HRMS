import { useState, useEffect } from "react";
import axios from "axios";
import { FaLessThan } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import {Link} from 'react-router-dom';
import Navbar from './FamilyNav';
const FamilyDetails = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Relation: "",
    Phonenumber: "",
    CountryCode: "+91",
    index: null, 
  });
  const [formErrors, setFormErrors] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.16:8080/employeeservice/familyDetails/HRMS1"
        );
        const data = response.data[0];
        setTableData([data]); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validateName = (name) => {
    let error = "";

    if (!name) {
      error = "Name is required.";
    } else if (name.length < 4 || name.length > 40) {
      error = "Name should be between 4 and 40 characters.";
    } else if (/^\s/.test(name)) {
      error = "Name should not start with a space.";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      error = "Name should contain only alphabets and spaces.";
    }

    return error;
  };

  const validateRelation = (relation) => {
    let error = "";

    if (!relation) {
      error = "Relation is required.";
    } else if (relation.length < 4 || relation.length > 40) {
      error = "Relation should be between 4 and 40 characters.";
    } else if (/^\s/.test(relation)) {
      error = "Relation should not start with a space.";
    } else if (!/^[A-Za-z\s\-]+$/.test(relation)) {
      error = "Relation should contain only alphabets, spaces, and hyphens (-).";
    }

    return error;
  };

  const validatePhonenumber = (phonenumber, countryCode, tableData) => {
    let error = "";
  
    
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    
    const nonIndianPhoneRegex = /^[1-9]\d{9}$/;
  
    if (!phonenumber) {
      error = "Phone number is required.";
    } else if (countryCode === "+91") {
      
      if (!indianPhoneRegex.test(phonenumber)) {
        error = "Phone number for India must start with 6, 7, 8, or 9 and be exactly 10 digits.";
      }
    } else {
      
      if (!nonIndianPhoneRegex.test(phonenumber)) {
        error = "Phone number must not start with 0 and should be exactly 10 digits.";
      }
    }
  
    
    const isDuplicatePhone = tableData.some((member) => member.Phonenumber === phonenumber);
    if (isDuplicatePhone) {
      error = "This phone number already exists.";
    }
  
    return error;
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({ ...formData, [name]: value });
  
    if (name === "Name") {
      const error = validateName(value);
      setFormErrors({ ...formErrors, Name: error });
    } else if (name === "Relation") {
      const error = validateRelation(value);
      setFormErrors({ ...formErrors, Relation: error });
    } else if (name === "Phonenumber" || name === "CountryCode") {
      const error = validatePhonenumber(
        name === "Phonenumber" ? value : formData.Phonenumber,
        name === "CountryCode" ? value : formData.CountryCode,
        tableData
      );
      setFormErrors({ ...formErrors, Phonenumber: error });
    }
  };
  
  
  const validateForm = () => {
    const errors = {};
  
   
    const nameError = validateName(formData.Name);
    if (nameError) {
      errors.Name = nameError;
    }
  
   
    const relationError = validateRelation(formData.Relation);
    if (relationError) {
      errors.Relation = relationError;
    }
  
    
    const phonenumberError = validatePhonenumber(formData.Phonenumber, formData.CountryCode, tableData);
    if (phonenumberError) {
      errors.Phonenumber = phonenumberError;
    }
  
    return errors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      
      if (tableData.length >= 8) {
        alert("You can only add up to 8 family members.");
        return;
      }
  
      if (isEditMode) {
        const updatedTableData = tableData.map((item, index) =>
          index === formData.index ? { ...formData } : item
        );
        setTableData(updatedTableData);
      } else {
        setTableData([...tableData, formData]);
      }
      setIsPopupOpen(false);
      setIsEditMode(false);
      setFormData({ Name: "", Relation: "", Phonenumber: "", CountryCode: "+91" });
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };
  

  const handleDelete = (index) => {
    const updatedTableData = tableData.filter((_, i) => i !== index);
    setTableData(updatedTableData);
  };

  const handleEdit = (index) => {
    setFormData({ ...tableData[index], index });
    setIsPopupOpen(true);
    setIsEditMode(true);
  };

  const handleAdd = () => {
    setIsPopupOpen(true);
    setIsEditMode(false);
    setFormData({ Name: "", Relation: "", Phonenumber: "", CountryCode: "+91" });
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsEditMode(false);
    setFormData({ Name: "", Relation: "", Phonenumber: "", CountryCode: "+91" });
  };

  return (
    <div>
      <Navbar/>
      <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
        <FaLessThan className="text-orange-500 mr-2" />
        <Link to='/'>
        <button>
          <span className="text font-semibold text-orange-500">Previous Page</span>
        </button></Link>
        
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mr-0 ml-0 md:mr-24 md:ml-24">
          <div className="bg-orange-500 text-white p-2 rounded-t-md flex justify-between items-center">
            <h2 className="font-semibold">Family Details</h2>
            <button className="flex items-center bg-green-500 p-2 pl-4 pr-4 rounded ml-2" onClick={handleAdd}>
              Add 
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-400 text-center">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border border-gray-400 px-4 w-[33%] py-2">Name</th>
                  <th className="border border-gray-400 px-4 w-[33%] py-2">Relation</th>
                  <th className="border border-gray-400 px-4 w-[33%] py-2">Phone Number</th>
                  <th className="border border-gray-400 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((data, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 px-4 py-2">{data.Name}</td>
                      <td className="border border-gray-400 px-4 py-2">{data.Relation}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        {data.CountryCode} {data.Phonenumber}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-400 text-center flex justify-center items-center space-x-4">
                        <TiPencil className="text-black cursor-pointer text-lg" onClick={() => handleEdit(index)} />
                        {index > 0 && (
                          <RiDeleteBin6Line className="text-black cursor-pointer text-lg" onClick={() => handleDelete(index)} />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No Family Details Added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isPopupOpen && (
            <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
              <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
                <div className="flex justify-between items-center mb-8 bg-orange-500 rounded-lg pl-2 pr-2 w-full p-2">
                  <h3 className="text-xl w-full">
                    {isEditMode ? "Edit Family Details" : "Enter Details"}
                  </h3>
                  <button>
                    <MdCancelPresentation size={24} className="text-black cursor-pointer" onClick={handleCancel} />
                  </button>
                </div>
                <form>
                  <div className="grid grid-cols-4 gap-6 mb-9">
                    <div className="col-span-1">
                      <label className="block mb-1">Name</label>
                      <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        onChange={handleInputChange}
                        minLength={4}
                        maxLength={40}
                        required
                        className="w-full p-1 border border-gray-300 rounded-lg"
                      />
                      {formErrors.Name && <p className="text-red-600 text-sm mt-1">{formErrors.Name}</p>}
                    </div>
                    <div className="col-span-1">
                      <label className="block mb-1">Relation</label>
                      <input
                        type="text"
                        name="Relation"
                        value={formData.Relation}
                        onChange={handleInputChange}
                        minLength={4}
                        maxLength={40}
                        required
                        className="w-full p-1 border border-gray-300 rounded-lg"
                      />
                      {formErrors.Relation && <p className="text-red-600 text-sm mt-1">{formErrors.Relation}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block mb-1 text-gray-700">Phone Number</label>
                      <div className="grid grid-cols-2 gap-2">
                        
                        <select
                          name="CountryCode"
                          value={formData.CountryCode}
                          onChange={handleInputChange}
                          className={` border border-gray-300 rounded-md ${
                            formErrors.CountryCode ? "border-red-500" : ""
                          }`}
                        >
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
                        
                        <input
                          type="text"
                          name="Phonenumber"
                          value={formData.Phonenumber}
                          onChange={handleInputChange}
                          maxLength="10"
                          className={`w-full p-1 border border-gray-300 rounded-md ${
                            formErrors.Phonenumber ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {formErrors.Phonenumber && (
                        <p className="text-red-600 text-sm mt-1 col-span-2">
                          {formErrors.Phonenumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      {isEditMode ? "Save" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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
};

export default FamilyDetails;
