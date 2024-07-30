import React from 'react'
import Navbar from './Navbar'
import pic1 from '../images/home.png';
import django from '../images/django.png';
import react from '../images/react.png';
import { FcApproval } from "react-icons/fc";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="container shadow-lg">
        <div className="row my-5 justify-content-center  ">
          <h2 className="text-center shadow header-space font-monospace"> <hr className='text-light' />React JS
            <hr className='text-light' /></h2>
          <div className="col-sm-6">
            
            
          </div>
        </div>
      </div>
    </>
  )
}

export default Home