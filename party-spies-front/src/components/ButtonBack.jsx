import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ButtonBack = ({img_id=4}) => {

  const {t} = useTranslation();

  const navigate = useNavigate();

  const img_class = img_id==1? 'menu-bg-1' : img_id==2? 'menu-bg-2' : img_id==3? 'menu-bg-3' : 'menu-bg-4';

  return (
    <div className='flex justify-center md:justify-start'>
        <button onClick={() => navigate(-1)}>
          <div className={img_class + ' menu-button w-56 h-14 flex items-center justify-center'}>
            <div className="">
                <p className='text-xl font-bold text-black'>{t("back")}</p>
            </div>
          </div>
        </button>
    </div>
  )
}

ButtonBack.propTypes ={
  img_id: PropTypes.number
}

export default ButtonBack