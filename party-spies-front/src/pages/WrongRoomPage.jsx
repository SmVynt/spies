//import React from 'react'
import { useTranslation } from "react-i18next"
import Menu_button from "../components/Menu_button"

const WrongRoom = () => {

  const {t} = useTranslation();

  ////
  //// JOIN ROOM PAGE

  return (
    <div className="space-y-8 text-center text-white md:text-left page-panel">      
      <h1 className="text-3xl">
        {t("wrong oops")}
      </h1>
      <div className="text-xl">
        <p>{t("wrong text_01")}</p>
        <p>{t("wrong text_02")}</p>
      </div>

      {/* back button */}
      <Menu_button title={t("back")} img_id={2} link='/' />
    </div>
  )
}


export default WrongRoom