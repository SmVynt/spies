//import React from 'react'
import Menu_button from "../components/Menu_button";
import { useTranslation } from 'react-i18next';

const Privacy = () => {

  const {t} =useTranslation();

  return (
    <div className="bg-spyDarkPink p-4 space-y-6 page-panel">
      <h1 className="text-center text-4xl font-bold md:text-left text-spyYellow">
        Privacy policy
      </h1>
      <div className="text-white text-center md:text-left text-xl space-y-4">
        <p className="font-bold text-spyYellow">
          Data Collection
        </p>
        <p>
          We do not collect or store personal information on our servers.
          The site may collect a user-chosen display name for gameplay purposes only.
          Game session data is stored on your device in local storage, enabling you to continue your gameplay session.
        </p>
        <p className="font-bold text-spyYellow">
          Use of Data
        </p>
        <p>
          User-chosen names and game session data are used solely for the purpose of enhancing gameplay. No data is transferred to or stored on our servers.
        </p>
        <p className="font-bold text-spyYellow">
          Cookies and Tracking
        </p>
        <p>
          Our website does not use cookies or tracking for user identification. Local storage is solely used to improve your gaming experience.
        </p>
        <p className="font-bold text-spyYellow">
          Third-Party Links
        </p>
        <p>
          Partyspies.com may contain links to external sites. We are not responsible for the privacy practices of these external sites.
        </p>
        <p className="font-bold text-spyYellow">
          Data Security
        </p>
        <p>
          While we do not store personal data, we advise all users to ensure their devices are secure.
        </p>
        <p className="font-bold text-spyYellow">
          Policy Updates</p>
        <p>
          Any updates to this policy will be posted here, and continued use of the site implies acceptance.
        </p>
        <p className="font-bold text-spyYellow">
          Contact Us
        </p>
        <p>
          For questions regarding our Privacy Policy, please contact us at mail@partyspies.com
        </p>
      </div>
      <Menu_button title={t('back')} img_id={3} link='/' />
    </div>
  )
}

export default Privacy