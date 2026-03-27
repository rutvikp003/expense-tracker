import React, { useState, useEffect, useRef } from 'react';
import { FaEdit } from "react-icons/fa";


const ExpenseTrackerPage = ({ expenses, saveExpense, deleteExpense, message, setMessage }) => {
  const [editingExpense, setEditingExpense] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('expense'); // 'expense' or 'income'

  const expenseCategories = ['Food', 'Rent', 'Travel', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gift', 'Refund', 'Other Income'];

  // Handle form submission for adding/editing transactions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !date) {
      setMessage('Amount and Date are required!');
      return;
    }

    const newTransaction = {
      id: editingExpense ? editingExpense.id : null,
      amount: parseFloat(amount),
      category,
      description,
      date,
      type, // Include the transaction type
    };
    saveExpense(newTransaction); // Renamed from saveExpense to saveTransaction conceptually
    resetForm();
  };

  // Populate form when editing a transaction
  const handleEdit = (transaction) => {
    setEditingExpense(transaction);
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setDescription(transaction.description);
    setDate(transaction.date);
    setType(transaction.type); // Set the type when editing
    setMessage('');
  };

  // Handle deleting a transaction
  const handleDelete = (id) => {
    console.log('Confirm delete for transaction ID:', id);
    deleteExpense(id); // Renamed from deleteExpense to deleteTransaction conceptually
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setEditingExpense(null);
    setAmount('');
    setCategory(type === 'expense' ? 'Food' : 'Salary'); // Reset category based on current type
    setDescription('');
    setDate('');
    // Keep type as is, or reset to 'expense' if preferred: setType('expense');
    setTimeout(() => setMessage(''), 3000);
  };

  // Update category options when type changes
  useEffect(() => {
    if (type === 'expense') {
      setCategory('Food');
    } else {
      setCategory('Salary');
    }
  }, [type]);


  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      {/* Transaction Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">{editingExpense ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector (Income/Expense) */}
          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600 h-5 w-5"
                name="transactionType"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
              />
              <span className="ml-2 text-gray-700 font-medium">Expense</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-green-600 h-5 w-5"
                name="transactionType"
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
              />
              <span className="ml-2 text-gray-700 font-medium">Income</span>
            </label>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out focus:shadow-lg"
              placeholder="e.g., 50.00"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white transition duration-200 ease-in-out focus:shadow-lg"
              required
            >
              {type === 'expense' ? (
                expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                incomeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              )}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out focus:shadow-lg"
              placeholder="e.g., Dinner with friends / Monthly Salary"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white transition duration-200 ease-in-out focus:shadow-lg"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              {editingExpense ? 'Update Transaction' : 'Add Transaction'}
            </button>
            {editingExpense && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Transaction List */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Recent Transactions</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-600 italic">No transactions added yet. Start by adding one!</p>
        ) : (
          <ul className="space-y-4">
            {expenses
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
              .slice(0, 5) // Show only the 5 most recent transactions
              .map(transaction => (
                <li key={transaction.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-md shadow-sm border border-gray-200 transition duration-200 ease-in-out hover:shadow-lg hover:border-blue-300">
                  <div className="mb-2 sm:mb-0">
                    <p className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.category} - {transaction.description}</p>
                    <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition duration-150 ease-in-out transform hover:scale-110"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition duration-150 ease-in-out transform hover:scale-110"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 000 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseTrackerPage;