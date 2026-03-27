import React from 'react';
const ProfilePage = ({ user, onLogout }) => {
  return (
    <div className="flex items-center bg-red-50 justify-center min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-120px)] p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Profile</h2>
        {user ? (
          <div className="space-y-4 text-gray-700">
            <p className="text-lg"><strong>Username:</strong> {user.username}</p>
            <p className="text-lg"><strong>Email:</strong> {user.email}</p>
            {/* In a real app, you wouldn't display the raw token */}
            <p className="text-sm text-gray-500 break-all"><strong>Mock Token:</strong> {user.token}</p>
            <button
              onClick={onLogout}
              className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-lg mt-6"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600">Please sign in to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;