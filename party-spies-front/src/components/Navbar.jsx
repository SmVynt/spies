import logo from '../assets/images/logo-spies-ph.png';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <>
    <div className="flex flex-col mx-12 my-8 md:mx-24 md:my-16">
         <Link className="flex justify-center md:justify-start"
            to='/'
          >
           <img className="h-24" src={logo} alt=""/>
         </Link>
    </div>
    </>
  );
};


export default Navbar