import PropTypes from 'prop-types';

const OPTIONS = [
  { label: 'All', value: Infinity },
  { label: '< ₹500', value: 500 },
  { label: '< ₹1,000', value: 1000 },
  { label: '< ₹2,000', value: 2000 },
  { label: '< ₹5,000', value: 5000 },
];

const PriceFilter = ({ maxPrice, onChange }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="section-label whitespace-nowrap">Budget:</span>
    {OPTIONS.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
          maxPrice === o.value
            ? 'bg-amber-500 border-amber-500 text-gray-950 shadow-md shadow-amber-900/30'
            : 'border-white/[0.08] text-gray-500 hover:text-gray-200 hover:border-white/20 hover:bg-white/5'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

PriceFilter.propTypes = { maxPrice: PropTypes.number.isRequired, onChange: PropTypes.func.isRequired };
export default PriceFilter;
