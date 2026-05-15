import Menu_button from '../components/Menu_button';
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const HomePage = () => {

  const {t} =useTranslation();

  const [loggedIn, setLoggedIn] = useState (false);
  const [loading, setLoading] = useState (true);

  useEffect(() => {

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
        };
        if(result.verified==false){
          const lang = localStorage.getItem('i18nextLng');
          localStorage.clear();
          localStorage.setItem('i18nextLng',lang)
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
    <>
      <section id='homePage'>
          <div className="space-y-6 w-auto md:w-1/2">
            <h1 className="text-center text-4xl text-white font-bold md:text-left">
              {t('slogan')}
            </h1>
            <p className="text-white text-center md:text-left text-xl">
              {t('description')}
            </p>
            <div className='space-y-6'>
              {(localStorage.roomname!=undefined&&loading)?
                <Menu_button title={t('room')+" "+localStorage.roomname} img_id={1} link={'/room/'} />
                :
                ((!loading&&loggedIn)?
                  <Menu_button title={t('room')+" "+localStorage.roomname} img_id={1} link={'/room/'} />
                  :
                  <span />
                )
              }
              <Menu_button title={t('create room')} img_id={2} link='/create' />
              <Menu_button title={t('join room')} img_id={3} link='/join' />
              <Menu_button title={t('about')} img_id={4} link='/about' />
            </div>
          </div>

      </section>
    </>
  )
}

export default HomePage