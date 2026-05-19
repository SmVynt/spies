//import React from 'react'
import Menu_button from "../components/Menu_button";
import { useTranslation } from 'react-i18next';

const Terms = () => {

  const {t} =useTranslation();

  return (
    <div className="bg-spyDarkPink p-4 space-y-6 page-panel">
      <h1 className="text-center text-4xl text-spyYellow font-bold md:text-left">
        Terms and Conditions
      </h1>
      <div className="text-white text-center md:text-left text-xl space-y-4">
        <p>
          Welcome to Partyspies.com! By accessing or using our website, you agree to be bound by the terms outlined below. If you do not agree to these terms, please refrain from using our website.
        </p>
        <p className="font-bold text-spyYellow">
          Use of Site
        </p>
        <p>
          Our website provides entertainment and social gaming experiences. Users are responsible for their interactions on the platform and any content they share.
        </p>
        <p className="font-bold text-spyYellow">
          Accounts and Security
        </p>
        <p>
          Users can choose a unique name for gameplay purposes. All data related to gameplay is stored locally on your device and not collected by our servers.
        </p>
        <p className="font-bold text-spyYellow">
          Intellectual Property
        </p>
        <p>
          All content on this site, including logos, design, and multimedia, is owned by Partyspies.com. Users may not reproduce or distribute our content without prior permission.
        </p>
        <p className="font-bold text-spyYellow">
          Limitation of Liability
        </p>
        <p>
          Partyspies is not liable for any damages arising from the use of this site. The site is provided &quot;as is&quot; without warranties of any kind.
        </p>
        <p className="font-bold text-spyYellow">
          Changes to Terms
        </p>
        <p>
          We may modify these terms periodically. Changes will be posted here, and continued use of the site implies acceptance of any updates.
        </p>
        <p className="font-bold text-spyYellow">
          Contact Us
        </p>
        <p>
          For questions about these terms, contact us at mail@partyspies.com
        </p>
      </div>
      <Menu_button title={t('back')} img_id={3} link='/' />
    </div>
  )
}

export default Terms