//import React from 'react'
import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import BigSpy from "../assets/images/spy-big.svg";
import SmallSpy from "../assets/images/spy-small.svg";
import MediumSpy from "../assets/images/spy-medium.svg";
import Footer from "../components/Footer";
import FooterFixed from "../components/FooterFixed";

const MainLayout = () => {
    return (
        <div className="flex flex-col">
            <Navbar />
            {/* 
            <div className="flex flex-col min-h-screen">
            <div className="flex flex-col flex-grow mx-12 pb-8  md:mx-24">
            */}
            <div className="flex flex-col mx-12 pb-8 mb-10 md:mx-24">
                <Outlet/>
            </div>

            <img src={BigSpy} alt="" className="fixed -bottom-8 scroll-fix overflow-hidden max-w-75pc max-h-full -z-40 hidden md:block"/>
            <img src={SmallSpy} alt="" className="fixed -bottom-8 left-4 max-w-1/6 -z-50 overflow-hidden hidden md:block"/>
            {/* 
            <img src={MediumSpy} alt="" className="fixed bottom-0 -left-0 -z-30 w-auto h-auto min-w-max overflow-hidden block md:hidden"/>
            */}
            <img src={MediumSpy} alt="" className="fixed bottom-8 -left-4 medium-spy -z-20  overflow-hidden md:hidden"/>
            <FooterFixed />
        </div>
    )
}

export default MainLayout