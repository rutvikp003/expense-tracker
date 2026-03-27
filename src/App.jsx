import React, { useState, useEffect, useCallback } from 'react';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ExpenseTrackerPage from './components/ExpenseTrackerPage';
import YearlyAnalyticsPage from './components/YearlyAnalyticsPage';
import ProfilePage from './components/ProfilePage';
import Chart from 'chart.js/auto';
import './App.css';

const App = () => {
  const [expenses, setExpenses] = useState([]); // Renamed to 'transactions' conceptually
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null); // State to hold user info and token
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle
  
  const generateMockToken = (username) => {
    return `mock_jwt_token_${username}_${Date.now()}`;
  };
  // --- Mock Authentication Logic ---
  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser && storedUser.token) {
      setUser(storedUser);
      setMessage(`Welcome back, ${storedUser.username}!`);
      // Automatically navigate to Expense Tracker if logged in
      setCurrentPage('expense-tracker');
    } else {
      setCurrentPage('auth'); // Go to auth page if not logged in
    }
  }, []);

  const handleLogin = (username, password) => {
    // Mock user database
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = storedUsers.find(u => u.username === username && u.password === password);

    if (foundUser) {
      const token = generateMockToken(username);
      const loggedInUser = { ...foundUser, token };
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setMessage('Sign in successful!');
      setCurrentPage('expense-tracker');
      setIsSidebarOpen(false); // Close sidebar on successful login
    } else {
      setMessage('Invalid username or password.');
    }
  };

  const handleSignUp = (username, email, password) => {
    // Mock user database
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    if (storedUsers.some(u => u.username === username)) {
      setMessage('Username already exists. Please choose another.');
      return;
    }
    if (storedUsers.some(u => u.email === email)) {
      setMessage('Email already registered. Please sign in or use a different email.');
      return;
    }

    const newUser = { username, email, password }; // In a real app, never store plain password
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    const token = generateMockToken(username);
    const loggedInUser = { ...newUser, token };
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setMessage('Sign up successful! You are now logged in.');
    setCurrentPage('expense-tracker');
    setIsSidebarOpen(false); // Close sidebar on successful sign up
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setExpenses([]); // Clear expenses on logout
    setMessage('You have been logged out.');
    setCurrentPage('auth'); // Redirect to auth page after logout
    setIsSidebarOpen(false); // Close sidebar on logout
  };

  // --- Transaction Management (now includes both income and expenses) ---
  const fetchExpenses = useCallback(() => { // Renamed to fetchTransactions conceptually
    if (user && user.username) {
      const userTransactions = JSON.parse(localStorage.getItem(`transactions_${user.username}`)) || []; // Updated localStorage key
      setExpenses(userTransactions);
    } else {
      setExpenses([]);
    }
  }, [user]);

  const saveExpense = useCallback((transaction) => { // Renamed to saveTransaction conceptually
    if (!user) {
      setMessage('Please sign in to save transactions.');
      return;
    }
    let updatedTransactions;
    if (transaction.id) {
      updatedTransactions = expenses.map(exp => exp.id === transaction.id ? transaction : exp);
      setMessage('Transaction updated successfully!');
    } else {
      transaction.id = Date.now();
      updatedTransactions = [...expenses, transaction];
      setMessage('Transaction added successfully!');
    }
    setExpenses(updatedTransactions);
    localStorage.setItem(`transactions_${user.username}`, JSON.stringify(updatedTransactions)); // Updated localStorage key
  }, [expenses, user]);

  const deleteExpense = useCallback((id) => { // Renamed to deleteTransaction conceptually
    if (!user) {
      setMessage('Please sign in to delete transactions.');
      return;
    }
    const updatedTransactions = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedTransactions);
    localStorage.setItem(`transactions_${user.username}`, JSON.stringify(updatedTransactions)); // Updated localStorage key
    setMessage('Transaction deleted successfully!');
  }, [expenses, user]);

  // Load transactions when user changes (on login/logout)
  useEffect(() => {
    fetchExpenses(); // Calls fetchTransactions
  }, [fetchExpenses, user]);

  // Render the current page based on state and authentication
  const renderPage = () => {
    // If not logged in and not on the auth page, redirect to auth page
    if (!user && currentPage !== 'auth') {
      setCurrentPage('auth');
      return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} message={message} setMessage={setMessage} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'expense-tracker':
        return (
          <ExpenseTrackerPage
            expenses={expenses} // 'expenses' now represents all transactions
            saveExpense={saveExpense}
            deleteExpense={deleteExpense}
            message={message}
            setMessage={setMessage}
          />
        );
      case 'yearly-analytics':
        return <YearlyAnalyticsPage expenses={expenses} />; // Pass all transactions
      case 'profile':
        return <ProfilePage user={user} onLogout={handleLogout} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} message={message} setMessage={setMessage} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 font-sans text-gray-800 flex flex-col lg:flex-row relative">
      {/* Mobile Menu Button (Hamburger Icon) */}
      <div className="lg:hidden bg-gray-800 p-4 flex justify-between items-center z-20 w-full">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">My Finances</h1>
      </div>

      {/* Sidebar Overlay (for mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <nav className={`fixed top-0 left-0 h-lvh w-64 bg-gray-800 text-white flex-col p-4 shadow-lg  transform transition-transform duration-300 ease-in-out z-20
                       ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0 lg:flex`}>
        <div className="text-2xl font-bold mb-8 text-center text-blue-300">
          My Finances
        </div>
        <ul className="space-y-4 flex-grow">
          {user && ( // Show these links only when logged in
            <>
              <li>
                <button
                  onClick={() => { setCurrentPage('home'); setIsSidebarOpen(false); }}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-200 ease-in-out ${
                    currentPage === 'home' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-700 text-gray-300 hover:shadow-lg'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('expense-tracker'); setIsSidebarOpen(false); }}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-200 ease-in-out ${
                    currentPage === 'expense-tracker' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-700 text-gray-300 hover:shadow-lg'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2-2m0 0l2-2m-2 2H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Add Transaction</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('yearly-analytics'); setIsSidebarOpen(false); }}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-200 ease-in-out ${
                    currentPage === 'yearly-analytics' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-700 text-gray-300 hover:shadow-lg'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3m0 0l3 3m-3-3v8m0-9a9 9 0 110 18 9 9 0 010-18z" />
                  </svg>
                  <span>Yearly Analytics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('profile'); setIsSidebarOpen(false); }}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-200 ease-in-out ${
                    currentPage === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-700 text-gray-300 hover:shadow-lg'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { handleLogout(); setIsSidebarOpen(false); }}
                  className="w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 text-red-300 hover:bg-gray-700 transition duration-200 ease-in-out hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </li>
            </>
          )}
          {!user && ( // Show these links only when logged out
            <li>
              <button
                onClick={() => { setCurrentPage('auth'); setIsSidebarOpen(false); }}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-200 ease-in-out ${
                  currentPage === 'auth' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-700 text-gray-300 hover:shadow-lg'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign In / Sign Up</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center shadow-lg">
          <h1 className="text-4xl font-extrabold tracking-tight">Expense Tracker</h1>
          <p className="mt-2 text-lg opacity-90">Manage your finances with ease</p>
        </header>
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;