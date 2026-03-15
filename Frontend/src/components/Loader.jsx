import PropTypes from 'prop-types';

const Loader = ({ className = "w-5 h-5" }) => {
  return (
    <img 
      src="/loading.png" 
      alt="Loading..." 
      className={`animate-spin object-contain ${className}`}
    />
  );
};

Loader.propTypes = {
  className: PropTypes.string
};

export default Loader;
