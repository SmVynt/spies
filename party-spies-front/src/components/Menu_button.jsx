import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Menu_button = ({title = 'Menu_01', img_id=4, link = '/about'}) => {
  const img_class = img_id==1? 'menu-bg-1' : img_id==2? 'menu-bg-2' : img_id==3? 'menu-bg-3' : 'menu-bg-4';

  return (
    <div className='flex justify-center md:justify-start'>
        <Link to={link}>
        <div className={img_class + ' menu-button w-56 h-14 flex items-center justify-center'}>
          <div className="">
            <p className='text-xl font-bold text-black'>{title}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

Menu_button.propTypes ={
  title: PropTypes.string.isRequired,
  img_id: PropTypes.number,
  link: PropTypes.string.isRequired
}

export default Menu_button