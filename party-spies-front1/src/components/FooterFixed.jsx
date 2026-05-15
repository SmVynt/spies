//import React from 'react'
import { Link } from "react-router-dom";
import LanguageSwitcher from "./SwitchLang";

const FooterFixed = () => {
  return (
    <footer className="fixed bottom-0 bg-spyAubergine w-full">
      <div className="flex flex-row w-full mx-auto p-4  space-x-4 justify-center md:justify-end">
        <LanguageSwitcher />
        <Link className="text-spyPink text-xs my-auto sm:text-base" 
        to='/privacy'>
          Privacy Policy
        </Link>
        <Link className="text-spyPink text-xs my-auto sm:text-base"
        to='/terms'>
          Terms and conditions
        </Link>
      </div>
    </footer>
  )
}

export default FooterFixed