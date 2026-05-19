//import React from 'react'
import Menu_button from "../components/Menu_button"
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const Invite = () => {

  const {t} =useTranslation();

  const {id} = useParams();
  const [message, setMessage] = useState ('');
  const fullConfig = resolveConfig(tailwindConfig);
  const QRForeground = fullConfig.theme.colors.spyYellow;
  const QRBackground = fullConfig.theme.colors.spyDarkPink;

  const linkClick = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    setMessage('Copied!');
  };

  useEffect(()=>{
    setMessage('');
  },[])


  ////
  //// JOIN ROOM PAGE

  return (
    <div className="space-y-6">
      <div>      
        <h1 className="text-center text-2xl text-white font-bold md:text-left">
          {t("room")}
        </h1>
        <h1 className="text-center text-6xl text-spyYellow font-bold md:text-left">
                {id.toUpperCase()}
        </h1>
      </div>
      <div className="text-center text-2xl text-white font-bold md:text-left">
        <p>
          {t("invite link")}
        </p>
        <Link onClick={linkClick}>
          <div  className="m-auto underline decoration-dotted gap-4">
            {"www.partyspies.com/\u200Bjoin/"+id}

          </div>
        </Link>
        {/* Message */}
        <div className="text-spyYellow">
              {message}
        </div>
      </div>
      <div className="text-center text-2xl text-white font-bold md:text-left">
          {t("invite qr")}
      </div>
      <div className=" mx-auto w-64 h-64 max-w-64 bg-spyDarkPink p-6 md:m-0">
        <QRCode
          value = {window.location.href}
          style = {{height: "auto", maxWidth: "100%", width:"100%"}}
          fgColor = {QRForeground}
          bgColor = {QRBackground}
          viewBox= {`0 0 256 256`}
        />
      </div>

      <Menu_button title={t("play")} img_id={1} link='/room' />

      <Menu_button title={t("back")} img_id={3} link='/' />
      
    </div>
  )
}


export default Invite