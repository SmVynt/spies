import PropTypes from 'prop-types';

const About_image = ({title = 'Start', link = '/assets/images/HowTo1.svg'}) => {
  return (
    <div className='flex flex-col items-center justify-center md:flex-1 md:justify-start'>
      <p className='text-3xl font-bold text-spyYellow text-center md:flex md:items-end md:justify-center md:min-h-[4.5rem]'>{title}</p>
      <img className='w-full h-auto object-contain' src={link} alt={title} />
    </div>
  )
}

About_image.propTypes ={
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
}

export default About_image