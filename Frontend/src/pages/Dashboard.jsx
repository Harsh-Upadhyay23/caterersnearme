import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-12 p-8" style={{ background: '#f9fafb' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-600">Manage your event quotes and favorite caterers from your dashboard.</p>
        </div>

        {/* Placeholder Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Active Quotes</h3>
            <p className="text-4xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Saved Caterers</h3>
            <p className="text-4xl font-bold text-gray-900">3</p>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Upcoming Events</h3>
            <p className="text-4xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No quotes yet</h2>
          <p className="text-gray-500 mb-6">Browse our caterers and request your first quote.</p>
          <a href="/caterers" className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors">Explore Caterers</a>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
