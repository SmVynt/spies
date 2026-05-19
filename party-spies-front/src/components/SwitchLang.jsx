import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div>
            <select
                className="bg-spyDarkPink text-spyPink" 
                value={localStorage.getItem("i18nextLng")}
                onChange={(e)=> changeLanguage(e.target.value)}
            >
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="ru">Русский</option>
            </select>
            {/*
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('ru')}>Русский</button>
            <button onClick={() => changeLanguage('de')}>Deutsch</button>
            */}
        </div>
    );
};

export default LanguageSwitcher
