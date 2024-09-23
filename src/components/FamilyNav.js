import React from "react";
import { MdGroups} from "react-icons/md";
import { TiGroup } from "react-icons/ti";
import { SlEnvolope } from "react-icons/sl";
import { IoNotifications } from "react-icons/io5";


function Header() {
  return (
  //  MainContainer
    <nav className="flex items-center justify-between bg-orange-500 px-4 h-16 border-b border-gray">


     
      <div className="h-12  w-12 border rounded-md">
        <img
          src="./Rfchh logo"
          alt="Logo"
          className="h-full w-full object-contain"
        />
      </div>


   
      <div className="flex items-center ml-44 text-black">
        <TiGroup  className="text-2xl mr-2" />
        <h1 className="text-xl font-semibold">Family Details</h1>
      </div>


     
      <div className="flex items-center space-x-4">
        <SlEnvolope  className="text-black text-xl" />
        <IoNotifications className="text-black text-xl" />

        <div className="flex items-center space-x-2  p-2 rounded">
          <div className="h-8 w-8 bg-gray-300 rounded-full" />

          <div className="flex flex-col">
            <span className="text-black font-semibold">DEveloper</span>
            <span className="text-sm text-black-600">Front-end Developer</span>
          </div>
          
        </div>
      </div>
    </nav>
  );
}

export default Header;