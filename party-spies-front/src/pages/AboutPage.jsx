//import React from 'react'
import Menu_button from "../components/Menu_button";
import { useTranslation } from 'react-i18next';

const About = () => {

  const {t} =useTranslation();

  return (
    <div className="space-y-6 text-center text-white md:text-left bg-spyDarkPink p-4 md:w-1/2">
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