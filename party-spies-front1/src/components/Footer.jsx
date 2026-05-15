//import React from 'react'
import { Link } from "react-router-dom";
import LanguageSwitcher from "./SwitchLang";

const Footer = () => {
  return (
    <footer className="bg-spyAubergine">
      <div className="flex flex-row w-full mx-auto p-4  space-x-4 justify-center md:justify-end">
        <LanguageSwitcher />
        <Link className="text-spyPink"
        to='/privacy'>
          Privacy Policy
        </Link>
        <Link className="text-spyPink"
        to='/terms'>
          Terms and conditions
        </Link>
      </div>
    </footer>
  )
}

export default Footer