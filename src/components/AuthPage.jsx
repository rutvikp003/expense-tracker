import React, { useState } from 'react';

const AuthPage = ({ onLogin, onSignUp, message, setMessage }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    if (isSignIn) {
      onLogin(username, password);
    } else {
      onSignUp(username, email, password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-120px)] p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </h2>
        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="auth-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="auth-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out focus:shadow-lg"
              required
            />
          </div>
          {!isSignIn && (
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="auth-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out focus:shadow-lg"
                required={!isSignIn}
              />
            </div>
          )}
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="auth-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out focus:shadow-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-blue-600 hover:text-blue-800 font-medium transition duration-150 ease-in-out hover:underline"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};
export default AuthPage;