import React from 'react';

const HomePage = () => (
  <div className="p-8 text-center flex flex-col bg-red-50 items-center justify-center h-full min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-120px)]">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Welcome to Your Expense Tracker!</h2>
    <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
      Effortlessly manage your daily expenses and income, categorize them, and visualize your financial health with insightful charts.
      Navigate through the sidebar to add new transactions or view your yearly analytics.
    </p>
    <div className="mt-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500 mx-auto animate-bounce" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm10 2a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 0114 6zm-3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 0111 6zm-3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 018 6zm-3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 015 6zm0 3a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 015 9zm3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 018 9zm3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 0111 9zm3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 0114 9zm0 3a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 0114 12zm-3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 0111 12zm-3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 018 12zm-3 0a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 015 12z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
);

export default HomePage;