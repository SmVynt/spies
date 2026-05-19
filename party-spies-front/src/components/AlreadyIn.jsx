import Menu_button from "./Menu_button"
import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next';


const Alreadyin = () => {

  const {t} =useTranslation();

  const [loggedIn, setLoggedIn] = useState (false);
  const [loading, setLoading] = useState (true);

  useEffect(()=>{
    const verify = async () => {
      try {
        const res = await fetch('/api/rooms/verify', {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'authorization':localStorage.token
            },
            body: JSON.stringify({roomname:localStorage.roomname,username:localStorage.username})
        })
        const result = await res.json();
        if(result.verified!=undefined) {
          setLoggedIn(result.verified);
        }
      } catch (error) {
          console.error('Error:',error);
          setLoggedIn(false);        
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return (
      <div>
          {((loading&&(localStorage.roomname!=undefined))||(!loading&&loggedIn))?
            <div className="text-white text-center text-xl space-y-8 md:text-left">
              <div>
                <p>
                  {t("already_01")} 
                  <span className="font-bold text-spyYellow">
                    {localStorage.getItem("roomname")}
                  </span>
                </p>
                <p>{t("already_02")}</p>
              </div>
              <Menu_button title={localStorage.getItem("roomname")} img_id={2} link="/room" />
            </div>
            :
            <></>
          }    
      </div>
  )
}


export default Alreadyin