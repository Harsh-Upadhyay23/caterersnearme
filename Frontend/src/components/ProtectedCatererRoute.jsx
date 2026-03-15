import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCatererAuth } from '../context/CatererAuthContext';
import Loader from './Loader';

const ProtectedCatererRoute = ({ children }) => {
  const { isAuthenticated, loading } = useCatererAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <Loader className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/caterer/login" replace />;
  }

  return children;
};

ProtectedCatererRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedCatererRoute;
