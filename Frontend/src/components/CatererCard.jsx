import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CatererCard = ({ caterer, onViewDetails }) => {
  const {
    name,
    location = 'Location Not Specified',
    pricePerPlate = 0,
    cuisines = [],
    rating = 0,
    image = 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop'
  } = caterer;

  return (
    <article className="group relative flex flex-col bg-amber-50 rounded-2xl overflow-hidden border border-amber-200 shadow-[0_4px_16px_rgb(251,191,36,0.1)] hover:shadow-[0_8px_30px_rgb(251,191,36,0.2)] hover:-translate-y-1 transition-all duration-400 ease-out flex-1">

      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />

        {/* Subtle top gradient for tag readability */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Rating Pill overlay */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-black/5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-500">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Showcase Cuisine Tag Top Left */}
        {cuisines.length > 0 && (
          <div className="absolute top-3 left-3 bg-amber-500 text-amber-950 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
            {cuisines[0]}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="relative p-5 flex flex-col flex-1 z-10 bg-transparent">

        {/* Header: Title and Pricing */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1 leading-tight mb-1.5">
              {name}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-400">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{location}</span>
            </p>
          </div>

          <div className="text-right flex-shrink-0 bg-white/60 px-3 py-1.5 rounded-xl border border-amber-200/50 backdrop-blur-sm">
            {pricePerPlate > 0 ? (
              <>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Starting</p>
                <p className="text-sm font-bold text-gray-900 leading-none">
                  ₹{pricePerPlate.toLocaleString('en-IN')}
                  <span className="text-[10px] text-gray-500 font-normal ml-0.5">/pl</span>
                </p>
              </>
            ) : (
              <>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Pricing</p>
                <p className="text-xs font-bold text-gray-900 leading-none mt-1">Inquire</p>
              </>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-gray-100 my-3" />

        {/* Cuisines Layout */}
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {cuisines.slice(0, 3).map((c) => (
            <span key={c} className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-white/80 text-amber-900 border border-amber-200 transition-colors shadow-sm">
              {c}
            </span>
          ))}
          {cuisines.length > 3 && (
            <span className="px-2 py-1 rounded-md text-[10px] font-medium bg-white/80 text-amber-800 border border-amber-200 shadow-sm">
              +{cuisines.length - 3} more
            </span>
          )}
        </div>

        {/* Premium View Details Button */}
        <Link
          to={`/caterer/${caterer.slug || caterer._id}`}
          className="w-full relative overflow-hidden group/btn inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-gray-900 hover:bg-amber-500 hover:text-white transition-all duration-300 border border-gray-200 hover:border-amber-500 shadow-sm"
        >
          <span>View Full Profile</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

CatererCard.propTypes = {
  caterer: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    pricePerPlate: PropTypes.number.isRequired,
    cuisines: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default CatererCard;
