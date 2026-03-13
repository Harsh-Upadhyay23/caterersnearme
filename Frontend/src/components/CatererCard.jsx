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
    <article className="group relative flex flex-col bg-[#0c0c11] rounded-[20px] overflow-hidden border border-white/[0.04] hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 flex-1">
      
      {/* ── Gorgeous Image Header ── */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-900 border-b border-white/[0.02]">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 group-hover:rotate-1 transition-all duration-700 ease-out opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        {/* Soft gradient to blend the image into the card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c11] via-[#0c0c11]/50 to-transparent" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
        
        {/* Rating Pill overlay */}
        {rating > 0 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-white tracking-wide">{rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* Highlight Cuisine Tag Top Left */}
        {cuisines.length > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-[#2a1600] px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase shadow-xl">
            {cuisines[0]}
          </div>
        )}
      </div>

      {/* ── Beautiful Card Body ── */}
      <div className="relative p-6 flex flex-col flex-1 z-10 -mt-12">
        
        {/* Floating Price Badge */}
        {pricePerPlate > 0 ? (
          <div className="self-end bg-[#15151e] border border-white/[0.08] shadow-2xl rounded-2xl px-5 py-2.5 mb-2 group-hover:border-amber-500/40 group-hover:shadow-amber-500/20 transition-all duration-300 backdrop-blur-md">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-none mb-1.5 font-semibold">Starting from</p>
            <p className="text-xl font-bold text-amber-400 leading-none">
              ₹{pricePerPlate.toLocaleString('en-IN')}
              <span className="text-[11px] text-gray-500 font-medium ml-0.5">/pl</span>
            </p>
          </div>
        ) : (
          <div className="self-end bg-[#15151e] border border-white/[0.08] shadow-2xl rounded-2xl px-5 py-2.5 mb-2 group-hover:border-amber-500/40 group-hover:shadow-amber-500/20 transition-all duration-300 backdrop-blur-md">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-none mb-1.5 font-semibold">Pricing</p>
            <p className="text-sm font-bold text-amber-400 leading-none">
              Inquire
            </p>
          </div>
        )}

        {/* Title & Location */}
        <div className="mb-5 mt-1">
          <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-amber-300 transition-colors line-clamp-1 leading-tight">
            {name}
          </h3>
          <p className="text-sm text-gray-400 flex items-center gap-1.5 font-medium">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.04] text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="truncate">{location}</span>
          </p>
        </div>

        {/* Cuisines Layout */}
        <div className="flex flex-wrap gap-1.5 mb-8 mt-auto">
          {cuisines.map((c) => (
            <span key={c} className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white/[0.03] text-gray-300 border border-white/[0.05] hover:bg-white/[0.06] transition-colors cursor-default">
              {c}
            </span>
          ))}
        </div>

        {/* Premium View Details Button */}
        <Link 
          to={`/caterer/${caterer.slug || caterer._id}`}
          className="w-full relative overflow-hidden group/btn inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-[#1a1a24] text-white hover:text-black hover:bg-amber-400 transition-all duration-300 border border-white/[0.08] hover:border-amber-400 shadow-lg"
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
