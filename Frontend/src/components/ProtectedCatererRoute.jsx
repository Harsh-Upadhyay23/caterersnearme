import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCatererAuth } from '../context/CatererAuthContext';

const ProtectedCatererRoute = ({ children }) => {
  const { isAuthenticated, loading } = useCatererAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
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
