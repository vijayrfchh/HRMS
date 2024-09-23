import { useState, useEffect } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import React from "react";
import { FaLessThan } from "react-icons/fa";
import axios from "axios";
import {Link } from 'react-router-dom';
import Navbar from './LocationNavbar'
function Location() {
  const [formData, setFormData] = useState({
    PresentAddress: {
      hno: "",
      street: "",
      village: "",
      town: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
    PermanentAddress: {
      hno: "",
      street: "",
      village: "",
      town: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
    OfficeAddress: {
      buildingNameFloor: "",
      street: "",
      village: "",
      town: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
  });
  const [save, setSave] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [currentAddressType, setCurrentAddressType] = useState("");

  const [addressData, setAddressData] = useState({
    hno: "",
    street: "",
    village: "",
    town: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
  });
  const togglePopup = (e,addressType = "") => {
    setShowPopup(!showPopup);
    if (addressType) {
      setCurrentAddressType(addressType);
      e.preventDefault();
      setAddressData(formData[addressType]);
      setSave(false);
      setSecond(false);
      setThird(false);
    }
    setErrors("");
  };
  const handleNameChar = (e) => {
    const key = e.key;
    const input = e.target;
    const cursorPosition = input.selectionStart;
    if (
      key === "Backspace" ||
      key === "Tab" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "ArrowUp" ||
      key === "ArrowDown"
    ) {
      return;
    }
    if (key === " " && cursorPosition === 0) {
      e.preventDefault();
      return;
    }
    if (!/^[0-9A-Za-z\-\/., ]$/.test(key)) {
      e.preventDefault();
    }
  };
  const validate = () => {
    let errors = {};
    const houseNumberRegex = /^(?!\s)[A-Za-z0-9\-\/\s,]+$/;
    const alphabetAndSpaceRegex = /^(?!\s)[a-zA-Z\s\/]+$/;
    const permissiveRegex = /^[A-Za-z0-9\s\-\/.,]+$/;
    const isOfficeAddress = currentAddressType === "OfficeAddress"; 
    if (!addressData.hno || !addressData.hno.trim()) {
      errors.hno = isOfficeAddress ? "Building Name is required" : "H.NO is required";
    } else if (!houseNumberRegex.test(addressData.hno)) {
      errors.hno = "Allow numbers, small letters, capitals, hyphens, spaces, and slashes";
    }
    if (!addressData.street || !addressData.street.trim()) {
      errors.street = "Street is required";
    } else if (!permissiveRegex.test(addressData.street)) {
      errors.street = "Street can contain letters, numbers, spaces";
    }
    if (!addressData.village || !addressData.village.trim()) {
      errors.village = "Village is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.village)) {
      errors.village = "Allow only alphabets";
    }
    if (!addressData.town || !addressData.town.trim()) {
      errors.town = "Town is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.town)) {
      errors.town = "Allow only alphabets";
    }
    if (!addressData.district || !addressData.district.trim()) {
      errors.district = "District is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.district)) {
      errors.district = "Allow only alphabets";
    }
  
    if (!addressData.state || !addressData.state.trim()) {
      errors.state = "State is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.state)) {
      errors.state = "Allow only alphabets";
    }
  
    if (!addressData.country || !addressData.country.trim()) {
      errors.country = "Country is required";
    } else if (!alphabetAndSpaceRegex.test(addressData.country)) {
      errors.country = "Allow only alphabets";
    }
    const pincodePattern = /^(?!0\d)\d{6}$/;
    const sameDigitPattern = /^(\d)\1{5}$/;
    if (!addressData.pincode || !addressData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (
      !pincodePattern.test(addressData.pincode) ||
      sameDigitPattern.test(addressData.pincode)
    ) {
      if (!pincodePattern.test(addressData.pincode)) {
        errors.pincode = "Pincode must be 6 digits, can't start with zero";
      } else if (sameDigitPattern.test(addressData.pincode)) {
        errors.pincode = "Pincode can't be all the same digit";
      }
    }
  
    return errors;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };
  const handleEdit = (addressType) => {
    setCurrentAddressType(addressType);
    setAddressData(formData[addressType]);
    togglePopup();
  };
  const handleSave = () => {
    setSave(true);
  };
  const handleSecond = () => {
    setSecond(true);
  };
  const handleThird = () => {
    setThird(true);
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const updatedFormData = {
        ...formData,
        [currentAddressType]: addressData,
      };
      setFormData(updatedFormData); 
      const requestBody = {
        ...addressData,
        houseNumber: addressData.hno, 
      };
      delete requestBody.hno; 
  
      let url = "";
      let method = "";
      if (addressData.id) {
        method = "PATCH"; 
        if (currentAddressType === "PresentAddress") {
          url = `http://192.168.0.119:8080/employeeservice/location/UpdatePresentAddress`;
        } else if (currentAddressType === "PermanentAddress") {
          url = `http://192.168.0.119:8080/employeeservice/location/UpdatePermanentAddress`;
        } else if (currentAddressType === "OfficeAddress") {
          url = `http://192.168.0.117:8080/employeeservice/location/UpdateOfficeAddress`;
        }
      } else {
      
        method = "POST";
        if (currentAddressType === "PresentAddress") {
          url = `http://192.168.0.119:8080/employeeservice/location/createPresentAddress?employeeId=HRMS1`;
        } else if (currentAddressType === "PermanentAddress") {
          url = `http://192.168.0.119:8080/employeeservice/location/CreatePermanentAddress?employeeId=HRMS1`;
        } else if (currentAddressType === "OfficeAddress") {
          url = `http://192.168.0.119:8080/employeeservice/location/createOfficeAddress?employeeId=HRMS1`;
        }
      }
  
      try {
        const response = await axios({
          method: method,
          url: url,
          data: requestBody,
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        console.log("Address saved successfully:", response.data);
        setShowPopup(false);
        if (currentAddressType === "PresentAddress") {
          handleSave();
        } else if (currentAddressType === "PermanentAddress") {
          handleSecond();
        } else if (currentAddressType === "OfficeAddress") {
          handleThird();
        }
      } catch (error) {
        console.error("Error saving address:", error);
        if (error.response) {
          console.log("Server response error:", error.response.data);
        }
      }
    } else {
      console.log("Validation Errors:", validationErrors);
    }
  };
  
  
  const changeaddress = (e) => {
    if (e.target.checked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        PermanentAddress: { ...prevFormData.PresentAddress },
      }));
      setSecond(true);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        PermanentAddress: {
          hno: "",
          street: "",
          village: "",
          town: "",
          district: "",
          state: "",
          country: "",
          pincode: "",
        },
      }));
      setSecond(false);
    }
  };
  useEffect(() => {
    const fetchCurrentDetails = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.119:8080/employeeservice/location/HRMS1"
        );
        const data = response.data;
        setFormData({
          PresentAddress: data.presentadress
            ? {
                hno: data.presentadress.houseNumber,
                street: data.presentadress.street,
                village: data.presentadress.village,
                town: data.presentadress.town,
                district: data.presentadress.district,
                state: data.presentadress.state,
                country: data.presentadress.country,
                pincode: data.presentadress.pincode,
              }
            : {},
          PermanentAddress: data.permanentadress
            ? {
                hno: data.permanentadress.houseNumber,
                street: data.permanentadress.street,
                village: data.permanentadress.village,
                town: data.permanentadress.town,
                district: data.permanentadress.district,
                state: data.permanentadress.state,
                country: data.permanentadress.country,
                pincode: data.permanentadress.pincode,
              }
            : {},
          OfficeAddress: data.officeaddress
            ? {
                buildingNameFloor: data.officeaddress.buildingNameFloor,
                street: data.officeaddress.street,
                village: data.officeaddress.village,
                town: data.officeaddress.town,
                district: data.officeaddress.district,
                state: data.officeaddress.state,
                country: data.officeaddress.country,
                pincode: data.officeaddress.pincode,
              }
            : {},
        });
        console.log("Feteched data:", data);
      } catch (error) {
        console.error("Error fetching Current Experience Details:", error);
      }
    };
    fetchCurrentDetails();
  }, []);
  return (
    <>
    <div><Navbar/></div>
      <div className="col-span-11 sm-text overflow-x-auto">
        <div className="flex items-center justify-start px-1 py-1  border-2 border-gray-800 rounded-md w-[150px] mb-3 mt-5 ml-5  ">
          <FaLessThan className="text-orange-400 mr-2" />
          <Link to='/'>
          <button>
            <span className="text font-semibold text-orange-400">
              Previous Page
            </span>
          </button>
          </Link>
          
          <link />
        </div>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="p-4 border-black">
        <div className="overflow-auto mx-auto px-4 md:px-12 lg:px-40">
          <table className="min-w-full bg-white border-black border-2 border-solid rounded-t-md table-auto">
            <thead>
              <tr>
                <th
                  className="py-6 px-4 border-b border-gray-600 text-left bg-orange-500 text-white rounded-t-md"
                  colSpan="8"
                >
                  {/* Anil Kumar */}
                </th>
              </tr>
              <tr className="relative  border-black border-2 border-solid bg-gray-300">
                <th
                  className="py-2 px-4 border-b border-gray-300 text-left"
                  colSpan="8"
                >
                  Present Address
                  <span
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-black/10 p-1 rounded"
                    onClick={() => handleEdit("PresentAddress")}
                  >
                    <BsPencilSquare />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="py-2 px-4 border-gray-600 border-black border-2 border-solid">H.No</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Street</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Village</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Town</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">District</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">State</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Country</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Pincode</th>
              </tr>
              {save && (
                <tr>
                  <td className="py-2 px-4 border-gray-600 border-black border-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PresentAddress.hno}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border-black border-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PresentAddress.street}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border-black border-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PresentAddress.village}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border-black border-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PresentAddress.town}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border-black border-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PresentAddress.district}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border-black border-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PresentAddress.state}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border-black border-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PresentAddress.country}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border-black border-2 text-center overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PresentAddress.pincode}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div>
            <input type="checkbox" onChange={changeaddress} />
            <label className="text-1xl ml-1">
              Permanent Address same as Present Address
            </label>
          </div>
          <table className="min-w-full bg-white border-collapse border border-gray-600  mt-4 border-black  border-solid">
            <thead>
              <tr className="relative  border-black border-2 border-solid bg-gray-300">
                <th
                  className="py-2 px-4 border-b border-gray-300 text-left"
                  colSpan="8"
                >
                  Permanent Address
                  <span
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-black/10 p-1 rounded"
                    onClick={() => handleEdit("PermanentAddress")}
                  >
                    <BsPencilSquare />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid"> H.No</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Street</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Village</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Town</th>
                <th className="py-2 px-4 border-gray-600 border-black border-2 border-solid">District</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">State</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Country</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Pincode</th>
              </tr>
              {second && (
                <tr>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PermanentAddress.hno}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PermanentAddress.street}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PermanentAddress.village}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PermanentAddress.town}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PermanentAddress.district}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid max-w-[50px]  overflow-x-auto sm:max-w-[100px]">
                    {formData.PermanentAddress.state}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PermanentAddress.country}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.PermanentAddress.pincode}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <table className="min-w-full bg-white border-collapse border border-gray-600  mt-4 border-black  border-solid">
            <thead>
              <tr className="relative  border-black border-2 border-solid bg-gray-300">
                <th
                  className="py-2 px-4 border-b border-gray-300 text-left"
                  colSpan="8"
                >
                  Office Address
                  <span
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-black/10 p-1 rounded"
                    onClick={() => handleEdit("OfficeAddress")}
                  >
                    <BsPencilSquare />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">B.Na</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Street</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Village</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Town</th>
                <th className="py-2 px-4 border-gray-600 border-black border-2 border-solid">District</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid"> State</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Country</th>
                <th className="py-2 px-4 border-gray-600  border-black border-2 border-solid">Pincode</th>
               
              </tr>
              {third && (
                <tr>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.OfficeAddress.buildingNameFloor}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.OfficeAddress.street}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.OfficeAddress.village}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.OfficeAddress.town}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.OfficeAddress.district}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid max-w-[50px]  overflow-x-auto sm:max-w-[100px]">
                    {formData.OfficeAddress.state}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.OfficeAddress.country}
                  </td>
                  <td className="py-2 px-4 border-gray-600 border text-center  border-black border-2 border-solid overflow-x-auto max-w-[50px] sm:max-w-[100px]">
                    {formData.OfficeAddress.pincode}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>
      {showPopup && (
        <div className=" bg-black fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center mb-8 bg-orange-500 rounded-lg pl-2 pr-2 w-full p-2">
              <h2 className="text-xl  w-full  ">
                Edit {currentAddressType.replace("Address", "")} Address
              </h2>
              <button
                onClick={togglePopup}
                className="text-black  rounded-full p-1 ml-2"
              >
              <MdCancelPresentation size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-4">
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="hno">
                    {currentAddressType === "OfficeAddress"
                      ? "Building Name"
                      : "H.NO"}
                  </label>
                  <input
                    type="text"
                    id="hno"
                    name="hno"
                    value={addressData.hno}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.hno && (
                    <p className="text-red-500 text-sm mt-1">{errors.hno}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="street">
                    Street
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={addressData.street}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-1 border border-gray-300 rounded-lg "
                  />
                  {errors.street && (
                    <p className="text-red-500 mt-1 text-sm">{errors.street}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="village">
                    Village
                  </label>
                  <input
                    type="text"
                    id="village"
                    name="village"
                    value={addressData.village}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-1 border border-gray-300 rounded-lg "
                  />
                  {errors.village && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.village}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="town">
                    Town
                  </label>
                  <input
                    type="text"
                    id="town"
                    name="town"
                    value={addressData.town}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={20}
                    className="w-full p-1 border border-gray-300 rounded-lg "
                  />
                  {errors.town && (
                    <p className="text-red-500 mt-1 text-sm">{errors.town}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="district">
                    District
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={addressData.district}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.district && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.district}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="state">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressData.state}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-1 border border-gray-300 rounded-lg "
                  />
                  {errors.state && (
                    <p className="text-red-500 mt-1 text-sm">{errors.state}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="country">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={addressData.country}
                    onChange={handleChange}
                    onKeyDown={handleNameChar}
                    minLength={2}
                    maxLength={40}
                    className="w-full p-1 border border-gray-300 rounded-lg "
                  />
                  {errors.country && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.country}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 font-medium" htmlFor="pincode">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={addressData.pincode}
                    onChange={handleChange}
                    minLength={6}
                    onKeyDown={handleNameChar}
                    maxLength={6}
                    className="w-full p-1 border border-gray-300 rounded-lg"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end  gap-4">
                <button
                  type="submit"
                  // onClick={changeError}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={togglePopup}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-3 "
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default Location;