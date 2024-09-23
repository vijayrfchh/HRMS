import React, { useEffect, useState } from 'react';
import { TiPencil } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdCancelPresentation } from 'react-icons/md';
import { FaLessThan } from 'react-icons/fa';
import axios from "axios";

function App() {
  const initialData = {
    holidayName: '',
    date: '',
    location: '',
    holidayId: '',
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchCurrentDetails();
  }, []);

  const fetchCurrentDetails = async () => {
    try {
      const response = await axios.get("http://192.168.0.119:8080/employeeservice/holiday/HRMS1");
      setTableData(response.data);
      console.log("Fetched data:", response.data);
    } catch (error) {
      console.error("Error fetching Holiday Details:", error);
    }
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const nextYear = currentYear + 1;
  const startDate = `${currentYear}-01-01`;
  const endDate = `${nextYear}-12-31`;
  const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/;

  const validateForm = () => {
    let newError = {};
    
    if (!formData.holidayName.trim()) {
      newError.holidayName = 'Holiday Name is required';
    } else if (!nameRegex.test(formData.holidayName)) {
      newError.holidayName = 'Holiday Name must start with a character and contain only alphabets and spaces';
    } else if (formData.holidayName.length < 2 || formData.holidayName.length > 30) {
      newError.holidayName = 'Holiday Name must be between 2 and 30 characters';
    }

    if (!formData.date) {
      newError.date = 'Holiday Date is required';
    } else if (tableData.some((row, index) =>
      row.date === formData.date && index !== editIndex)) {
      newError.date = 'Date is already taken';
    }

    if (!formData.location.trim()) {
      newError.location = 'Location is required';
    } else if (!nameRegex.test(formData.location)) {
      newError.location = 'Location must start with a character and contain only alphabets and spaces';
    } else if (formData.location.length < 1 || formData.location.length > 30) {
      newError.location = 'Location must be between 1 and 30 characters';
    }

    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const handleOpenPopup = (index = null) => {
    setFormData(index !== null ? { ...tableData[index] } : { ...initialData });
    setEditIndex(index);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditIndex(null);
  };

  const formatPostDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const updatedFormData = {
          ...formData,
          date: formatPostDate(formData.date),
        };

        if (editIndex !== null) {
          const response = await axios.patch(
            'http://192.168.0.119:8080/employeeservice/holiday/',
            { holidayId: tableData[editIndex].holidayId, ...updatedFormData },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("PATCH Response Data:", response.data);

          // Update the local state
          const newTableData = [...tableData];
          newTableData[editIndex] = { ...newTableData[editIndex], ...updatedFormData };
          setTableData(newTableData);
        } else {
          const response = await axios.post(
            'http://192.168.0.119:8080/employeeservice/holiday/',
            updatedFormData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("POST Response Data:", response.data);
          const newHolidayEntry = { ...updatedFormData, holidayId: response.data.holidayId };
          setTableData([...tableData, newHolidayEntry]);
        }
  
        handleClosePopup();
      } catch (error) {
        console.error("Error during request:", error.response?.data || error.message);
        alert("There was an error saving the holiday details. Please try again.");
      }
    } else {
      console.log("Form validation failed.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleDelete = async (index) => {
    const holidayId = tableData[index].holidayId;

    try {
      await axios.delete(
        `http://192.168.0.119:8080/employeeservice/holiday/${holidayId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("DELETE Response Data:", holidayId);
      setTableData(tableData.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error during deletion:", error.response?.data || error.message);
      alert("There was an error deleting the holiday. Please try again.");
    }
  };

  const handleAddRow = () => {
    handleOpenPopup();
  };

  const preventManualInput = (e) => {
    if (e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleNameChar = (e) => {
    const key = e.key;
    const value = e.target.value;

    if ((value === "" && key === " ") || !/[a-zA-Z\s]/.test(key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="mr-10 ml-6">
        <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
          <FaLessThan className="text-orange-500 mr-2" />
          <button>
            <span className="text font-semibold text-orange-500">Previous Page</span>
          </button>
        </div>
      </div>
      <div className="p-4 pt-5 mt-5 ml-10 mr-10 lg:ml-48 lg:mr-48">
        <div className='overflow-x-auto'>
          <table className="w-full ">
            <thead>
              <tr>
                <th className="py-5 px-4 text-left bg-orange-500 text-white border-2 border-solid border-black" colSpan="4"></th>
              </tr>
              <tr>
                <th className="py-2 px-4 text-left text-black border-2 border-solid border-black" colSpan="4">
                  <div className="flex justify-between items-center">
                    <span>Holidays</span>
                    <button className="bg-green-600 text-white py-1 px-4 rounded" onClick={handleAddRow} type="button">
                      Add
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className='border border-black border-collapse'>
              <tr>
                <th className="bg-gray-400 w-1/4 py-2 border-2 border-solid border-black">Name of The Holiday</th>
                <th className="bg-gray-400 w-1/4 py-2 border-2 border-solid border-black">Date</th>
                <th className="bg-gray-400 w-1/4 py-2 border-2 border-solid border-black">Location</th>
                <th className="bg-gray-400 w-1/4 py-2 border-2 border-solid border-black">Action</th>
              </tr>
              {tableData.map((row, index) => (
                <tr key={row.holidayId}>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center">{row.holidayName}</td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center">{formatDate(row.date)}</td>
                  <td className="py-5 px-4 border-b border-gray-900 border-r text-center">{row.location}</td>
                  <td className="py-2 px-4 border-b border-gray-900 text-center">
                    <div className='flex flex-row justify-center'>
                      <TiPencil className="inline-block mr-4 cursor-pointer text-lg" onClick={() => handleOpenPopup(index)} />
                      {index !== 0 && (
                        <RiDeleteBin6Line
                          className="cursor-pointer text-lg inline-block"
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
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-200 p-4 rounded-lg shadow-lg max-w-[700px] w-full" onClick={(e) => e.stopPropagation()}>
              <div className='flex items-center justify-between mb-4 bg-orange-500 border border-gray-950 m-2 border-radius'>
                <h2 className="p-1 m-1">{editIndex !== null ? 'Edit Holiday Details' : 'Add New Holiday'}</h2>
                <MdCancelPresentation className='text-xl mr-2 cursor-pointer' onClick={handleClosePopup} />
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-3 gap-4 p-4">
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Holiday Name:</label>
                    <input
                      type="text"
                      name="holidayName"
                      value={formData.holidayName}
                      onChange={handleChange}
                      onKeyDown={handleNameChar}
                      maxLength="30"
                      className="p-2 border border-gray-300 rounded"
                    />
                    {errors.holidayName && <p className="text-red-500">{errors.holidayName}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Holiday Date:</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      onKeyDown={preventManualInput}
                      min={startDate}
                      max={endDate}
                      className="p-2 border border-gray-300 rounded"
                    />
                    {errors.date && <p className="text-red-500">{errors.date}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Location:</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onKeyDown={handleNameChar}
                      maxLength="30"
                      className="p-2 border border-gray-300 rounded"
                    />
                    {errors.location && <p className="text-red-500">{errors.location}</p>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="hover:bg-gray-600 bg-gray-500 text-white py-2 px-4 rounded mr-2">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="hover:bg-gray-600 bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;