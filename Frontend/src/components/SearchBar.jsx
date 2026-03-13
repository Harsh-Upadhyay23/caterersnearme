import PropTypes from 'prop-types';

const SearchBar = ({ value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-600">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
      </svg>
    </div>
    <input
      id="caterer-search"
      type="text"
      placeholder="Search by caterer name…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field pl-10 pr-10"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    )}
  </div>
);

SearchBar.propTypes = { value: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired };
export default SearchBar;
