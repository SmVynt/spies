//import React from 'react'
import Menu_button from "../components/Menu_button";
import { useTranslation } from 'react-i18next';
import HowTo1 from "../assets/images/HowTo1.svg";
import HowTo2 from "../assets/images/HowTo2.svg";
import HowTo3 from "../assets/images/HowTo3.svg";
import About_image from "../components/About_image";

const About = () => {

  const {t} =useTranslation();

  return (
    <div className="space-y-6 text-center text-white md:text-left bg-spyDarkPink p-4 page-panel">
      <h1 className="text-4xl font-bold text-spyYellow">
        {t("about")}
      </h1>
      <p className="text-xl">
        {t('about welcome')}
      </p>
      {/* How to */}
      <h1 className="text-4xl font-bold text-spyYellow">
        {t("about how to")}
      </h1>
      <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-6">
        <About_image title={t("about create room")} link={HowTo1} />
        <About_image title={t("about play")} link={HowTo2} />
        <About_image title={t("about win")} link={HowTo3} />
      </div>
      <div>
          <h1 className="text-2xl font-bold text-spyYellow">
            {t("about how to 1 title")}
          </h1>
          <p className="text-xl">
            {t('about how to 1 text')}
          </p>
      </div>
      <div>
          <h1 className="text-2xl font-bold text-spyYellow">
            {t("about how to 2 title")}
          </h1>
          <p className="text-xl">
            {t('about how to 2 text')}
          </p>
      </div>
      <div>
          <h1 className="text-2xl font-bold text-spyYellow">
            {t("about how to 3 title")}
          </h1>
          <p className="text-xl">
            {t('about how to 3 text')}
          </p>
      </div>
      <div>
          <h1 className="text-2xl font-bold text-spyYellow">
            {t("about how to 4 title")}
          </h1>
          <p className="text-xl">
            {t('about how to 4 text')}
          </p>
      </div>
      {/* Tips */}
      <h1 className="text-4xl font-bold text-spyYellow">
        {t("about tips")}
      </h1>
      <div>
          <h1 className="text-2xl font-bold text-spyYellow">
            {t("about tips 1 title")}
          </h1>
          <p className="text-xl">
            {t('about tips 1 text')}
          </p>
      </div>
      <div>
          <h1 className="text-2xl font-bold text-spyYellow">
            {t("about tips 2 title")}
          </h1>
          <p className="text-xl">
            {t('about tips 2 text')}
          </p>
      </div>
      <div>
          <h1 className="text-2xl font-bold text-spyYellow">
            {t("about tips 3 title")}
          </h1>
          <p className="text-xl">
            {t('about tips 3 text')}
          </p>
      </div>
      <p className="text-xl text-spyYellow text-spyYellow">
            {t('about final')}
      </p>
      <Menu_button title={t('back')} img_id={3} link='/' />
    </div>
  )
}

export default About