import { useState,useEffect } from 'react';
import { FaPen, FaTrash, FaLessThan, FaRegWindowClose } from 'react-icons/fa';
import axios from 'axios';
// import Navbar from './Header';
import Header from './NationalNavbar';
import {Link} from "react-router-dom"

const NationalIDDetails = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    idType: '',
    nameasperdocument: '',
    idNumber: '',
    country: '',
    isPrimaryID: false,
    // unid: '',               
    // employeeId: '' 
  });


  const [formErrors, setFormErrors] = useState({});

  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    const fetchNationalID = async () => {
        try {
            const response = await axios.get(`http://192.168.0.119:8080/employeeservice/nationalID/getNationalID/HRMS1`);
            const data = response.data;
            setFormData({
                idType: data.nationalId ,
                nameasperdocument: data.name ,
                idNumber: data.nationalIDNum ,
                country: data.country ,
                isPrimaryID: data.primary ,
            });
            console.log("Fetched data:", data);
        } catch (error) {
            console.error('Error fetching National ID Details:', error);
        }
    };
    fetchNationalID();
}, []);


const handleEnter = (e)=>{
  if (e.key === "Enter"){
   e.preventDefault()
  }
}

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'idNumber') {
      if (formData.idType === 'PANCARD') {
        newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        if (newValue.length <= 5) {
          newValue = newValue.replace(/[^A-Z]/g, '');
        } else if (newValue.length <= 9) {
          newValue = newValue.slice(0, 5) + newValue.slice(5).replace(/[^0-9]/g, '');
        } else {
          newValue = newValue.slice(0, 9) + newValue.slice(9).replace(/[^A-Z]/g, '');
        }
      } else if (formData.idType === 'VOTERID') {
        newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        if (newValue.length <= 3) {
          newValue = newValue.replace(/[^A-Z]/g, '');
        } else {
          newValue = newValue.slice(0, 3) + newValue.slice(3).replace(/[^0-9]/g, '');
        }
      } else if (formData.idType === 'AADHAR') {
        newValue = value.replace(/\D/g, '').slice(0, 12);
      }
    }

    setFormData({ ...formData, [name]: newValue });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.idType) {
      errors.idType = "ID Type is required.";
    }

    if (!formData.nameasperdocument) {
      errors.nameasperdocument = "Name  as per Document is required.";
    }else if (formData.nameasperdocument.length < 3 || formData.nameasperdocument.length > 40) {
      errors.nameasperdocument = "Name as per Document must be 3-40 characters.";
    } 

    if (!formData.idNumber) {
      errors.idNumber = " National ID Number is required.";
    } else if (formData.idType === 'AADHAR'){
      if (formData.idNumber.length !== 12) {
        errors.idNumber = "AADHAR must be 12 digits.";
      } else if (!/^[1-9][0-9]{11}$/.test(formData.idNumber)) {
        errors.idNumber = "AADHAR must not start with 0 and does not take 0 as values.";
      }
    } else if (formData.idType === 'PANCARD') {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.idNumber)) {
        errors.idNumber = "PANCARD must be in the format ABCDE1234E.";
      }
    } else if (formData.idType === 'VOTERID') {
      if (!/^[A-Z]{3}[0-9]{7}$/.test(formData.idNumber)) {
        errors.idNumber = "VOTERID must be in the format ABC1234567.";
      }
    }
    
    if (!formData.country ) {
      errors.country = "Country is required.";
    }else if(formData.country.length < 2 || formData.country.length > 14){
      errors.country = "Country must be 2-14 characters.";
    }
    return errors;
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    const isIdTypeExists = tableData.some((item) => item.nationalId === formData.idType);
  
    if (isIdTypeExists && !isEditMode) {
      setFormErrors({ ...errors, idType: 'This ID Type already exists in the table.' });
      return;
    }
  
    if (Object.keys(errors).length === 0) {
      let updatedTableData = [...tableData];
  
      if (formData.isPrimaryID) {
        updatedTableData = updatedTableData.map(item => ({ ...item, isPrimaryID: false }));
      }
  
      try {

        const payload = {
          nationalId: formData.idType,  
          name: formData.nameasperdocument,
          nationalIDNum: formData.idNumber,
          country: formData.country,
          primary: formData.isPrimaryID,
          employeeId: formData.employeeId,
          unid: formData.unid,
        };
        if (isEditMode) {
          const response = await axios.patch(
            `http://192.168.0.119:8080/employeeservice/nationalID/updateNationalID`,
            { employeeId: formData.employeeId, unid: formData.unid, ...payload }, 
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
  
          console.log("PATCH Response Data:", response.data);
          const updatedTableData = tableData.map((item) =>
            item.employeeId === formData.employeeId && item.unid === formData.unid ? { ...item, ...payload } : item
          );
          setTableData(updatedTableData);
        } else {
          // POST request with employeeId and unid
          const response = await axios.post(
            `http://192.168.0.119:8080/employeeservice/nationalID/createNationalID?employeeId=HRMS1&unid=UNID1`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("POST Response Data:", response.data);
          const newnationalid = { ...payload, employeeId: response.data.employeeId, unid: response.data.unid };
          setTableData([...tableData, newnationalid]);
        }
        setIsPopupOpen(false);
        setIsEditMode(false);
        setFormErrors({});
        
      } catch (error) {
        if (error.response && error.response.data) {
          const backendErrors = error.response.data || [];
          const formErrors = {};
  
          if (backendErrors.includes("InvalidName")) {
            formErrors.nameasperdocument = "Invalid Name. Please enter the correct name.";
          }
          if (backendErrors.message === "InvalidEmployeeID") {
            formErrors.employeeId = "Invalid Employee ID. Please provide a valid Employee ID.";
          }
          if (backendErrors.includes("InvalidIDNumber")) {
            formErrors.idNumber = "Invalid ID Number. Please enter a valid ID.";
          }
          if (backendErrors.includes("DuplicateNationalID")) {
            formErrors.idType = "This National ID already exists.";
          }
  
          setFormErrors(formErrors);
        } else {
          console.error('Error saving National ID:', error);
        }
      }
    } else {
      setFormErrors(errors);
    }
  };
  
  
  const handleDelete = async (index) => {
    try {
      // Get the ID or relevant identifier (employeeId, utid) for deletion
      // const { employeeId, nationalId } = tableData[index]; 
  
      // Perform the DELETE request to the backend
      await axios.delete(`http://192.168.0.119:8080/employeeservice/nationalID/delete/HRMS1?nationalId=AADHAR`, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      let updatedTableData = tableData.filter((_, i) => i !== index);
 
      if (updatedTableData.length > 0 && !updatedTableData.some(item => item.isPrimaryID)) {
        updatedTableData[0].isPrimaryID = true;
      }
      setTableData(updatedTableData);
      console.log("Deleted successfully!");
  
    } catch (error) {
      console.error("Error deleting entry:", error.response?.data || error.message);
      alert("There was an error deleting the entry. Please try again.");
    }
  };

  const handleEdit = (index) => {
    setFormData({ ...tableData[index], index });
    setIsPopupOpen(true);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setIsEditMode(false);
    setFormData({
      idType: '',
      nameasperdocument: '',
      idNumber: '',
      country: '',
      isPrimaryID: false
    });
    setFormErrors("")
  };

  return (
    <>
    <div><Header/></div>
    <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-4 mb-5 mt-5">
                <FaLessThan className="text-orange-500 mr-2" />
                <Link to='/'><button><span className="text font-semibold text-orange-500">Previous Page</span></button>
                </Link>
        </div>
    <div className=" mr-48 ml-48 border border-black rounded-t-md">
        
        <div className="bg-orange-500 text-white p-2 flex justify-between items-center">
          <h2 className="font-semibold">National ID</h2>    
        </div>
        <div className="bg-white p-2  border-1 border-black flex justify-between items-center">
                    <span className="font-semibold">National ID</span>
                    <button className="flex items-center text-black bg-green-500 px-2 py-1 rounded" onClick={() => setIsPopupOpen(true)}>
                      Add
                    </button>
        </div>
        <div className='overflow-x-auto'>
            <table className="min-w-full border-collapse border border-gray-400">
            <thead>
                <tr className="bg-gray-300">
                    <th className="border border-gray-400 px-4 py-2 w-1/6">ID Type</th>
                    <th className="border border-gray-400 px-4 py-2 w-1/6">Name as per Document</th>
                    <th className="border border-gray-400 px-4 py-2 w-1/6">ID Number</th>
                    <th className="border border-gray-400 px-4 py-2 w-1/6">Country</th>
                    {tableData.length >0 && <th className="border border-gray-400 px-4 py-2 w-1/6">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {tableData.length === 0 ? (
                <tr>
                    <td colSpan="6" className="text-center py-4">No National ID Details Added</td>
                </tr>
                ) : (
                tableData.map((data, index) => (
                <tr key={index}>
                    <td className="border border-gray-400 px-4 py-2 text-center">{data.idType}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center">{data.nameasperdocument}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center">{data.idNumber}</td>
                    <td className="border border-gray-400 px-4 py-2 text-center">{data.country}</td>
                    <td className="border border-gray-400 px-4 py-2 ">
                      <div className=' flex justify-center  items-center space-x-2 '>
                         <FaPen  size={17}className="  inline cursor-pointer mr-2" onClick={() => handleEdit(index)}/>
                      {index > 0 && (
                         <FaTrash size={17} className="inline cursor-pointer" onClick={() => handleDelete(index)} />
                      )}</div>
                    </td>
                </tr>
                )))}
            </tbody>
            </table>
        </div>

      {isPopupOpen && (
        <div className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-gray-300 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center mb-8 bg-orange-500 rounded-lg pl-2 pr-2 w-full p-2">
              <h2 className="text-xl  w-full">{isEditMode ? 'Edit' : 'Add'} National ID</h2>
              <button className='text-black cursor-pointer' onClick={handleCancel}>
                <FaRegWindowClose  size={24}/>
              </button>
            </div>
            <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              <div className='col-span-1'>
                <label className="block mb-1">ID Type:</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  className="w-full p-1 border border-gray-300 rounded-lg"
                >
                  <option value="">Select ID</option>
                  <option value="AADHAR">AADHAR</option>
                  <option value="PANCARD">PANCARD</option>
                  <option value="VOTERID">VOTERID</option>
                  
                </select>
                {formErrors.idType && <p className="text-red-600 text-sm mt-1">{formErrors.idType}</p>}
              </div>
              <div className="col-span-1 ">
                <label className="block mb-1">Name as per Doc:</label>
                <input
                  type="text"
                  name="nameasperdocument"
                  value={formData.nameasperdocument}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
                        setFormData({ ...formData, nameasperdocument: value });
                        setFormErrors({ ...formErrors, nameasperdocument: "" });}
                    }}
                  className="w-full p-1 border border-gray-300 rounded-lg"
                />
                {formErrors.nameasperdocument && <p className="text-red-600 text-sm mt-1">{formErrors.nameasperdocument}</p>}
              </div>
              <div className="col-span-1 ">
                <label className="block mb-1">National ID Number:</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="w-full p-1 border border-gray-300 rounded-lg"
                 
                />
                {formErrors.idNumber && <p className="text-red-600 text-sm mt-1">{formErrors.idNumber}</p>}
              </div>
              <div className="col-span-1 ">
                <label className="block mb-1">Country:</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^(?!\s)[A-Za-z\s]*$/.test(value)) {
                        setFormData({ ...formData, country: value });
                        setFormErrors({ ...formErrors, country: "" });}
                    }}
                  className="w-full p-1 border border-gray-300 rounded-lg"
                />
                {formErrors.country && <p className="text-red-600 text-sm mt-1">{formErrors.country}</p>}
              </div>
              </div>
              <div>
                <label className="block p-4 text-gray-700">
                  <input
                    type="checkbox"
                    name="isPrimaryID"
                    checked={formData.isPrimaryID}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Primary ID
                </label>
              </div>
              <div className=" mt-4 flex justify-end space-x-2">
              <button type="submit" className="border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ">
                {isEditMode ? 'Update' : 'Save'}
              </button>
              <button  onClick={handleCancel} className='border border-black bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600  '>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div></>
  );
};

export default NationalIDDetails;