import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; 

const YearlyAnalyticsPage = ({ expenses }) => { // 'expenses' now includes both income and expenses
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState('');
  const [llmInsight, setLlmInsight] = useState(''); // State for LLM generated insight
  const [isLoadingInsight, setIsLoadingInsight] = useState(false); // Loading state for LLM

  const expensePieChartRef = useRef(null); // Renamed for clarity
  const incomePieChartRef = useRef(null); // New ref for income pie chart
  const monthlyBarChartRef = useRef(null); // Renamed for clarity
  const cumulativeLineChartRef = useRef(null); // Renamed for clarity

  const expensePieChartInstance = useRef(null);
  const incomePieChartInstance = useRef(null); // New instance for income pie chart
  const monthlyBarChartInstance = useRef(null);
  const cumulativeLineChartInstance = useRef(null);


  // Filter transactions for the selected year
  const filteredTransactions = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getFullYear() === parseInt(selectedYear);
  });

  const filteredIncome = filteredTransactions.filter(t => t.type === 'income');
  const filteredExpenses = filteredTransactions.filter(t => t.type === 'expense');

  // --- Expense Pie Chart Data (Expenses by Category for the Year) ---
  const expenseCategoryData = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});
  const expensePieChartLabels = Object.keys(expenseCategoryData);
  const expensePieChartValues = Object.values(expenseCategoryData);

  // --- Income Pie Chart Data (Income by Category for the Year) ---
  const incomeCategoryData = filteredIncome.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + parseFloat(inc.amount);
    return acc;
  }, {});
  const incomePieChartLabels = Object.keys(incomeCategoryData);
  const incomePieChartValues = Object.values(incomeCategoryData);


  // --- Monthly Bar Chart Data (Monthly Expenses & Income for the Year) ---
  const monthlyExpensesRawData = filteredExpenses.reduce((acc, exp) => {
    const month = new Date(exp.date).getMonth(); // 0-indexed month
    acc[month] = (acc[month] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});
  const monthlyIncomeRawData = filteredIncome.reduce((acc, inc) => {
    const month = new Date(inc.date).getMonth();
    acc[month] = (acc[month] || 0) + parseFloat(inc.amount);
    return acc;
  }, {});

  const monthNames = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));
  const monthlyExpensesValues = monthNames.map((_, i) => monthlyExpensesRawData[i] || 0);
  const monthlyIncomeValues = monthNames.map((_, i) => monthlyIncomeRawData[i] || 0);


  // --- Line Chart Data (Cumulative Net Flow for the Year) ---
  let cumulativeNetFlow = 0;
  const cumulativeNetValues = monthNames.map((_, i) => {
    cumulativeNetFlow += (monthlyIncomeValues[i] || 0) - (monthlyExpensesValues[i] || 0);
    return cumulativeNetFlow;
  });


  // Calculate summary statistics
  const totalIncome = filteredIncome.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const netSavings = totalIncome - totalExpenses;

  // Determine Most Spent Category
  const mostSpentCategory = expensePieChartLabels.length > 0
    ? expensePieChartLabels[expensePieChartValues.indexOf(Math.max(...expensePieChartValues))]
    : 'N/A';


  // Update charts whenever dependencies change
  useEffect(() => {
    renderCharts();
    // Clear LLM insight when data changes
    setLlmInsight('');
    // Cleanup function for charts
    return () => {
      if (expensePieChartInstance.current) {
        expensePieChartInstance.current.destroy();
      }
      if (incomePieChartInstance.current) {
        incomePieChartInstance.current.destroy();
      }
      if (monthlyBarChartInstance.current) {
        monthlyBarChartInstance.current.destroy();
      }
      if (cumulativeLineChartInstance.current) {
        cumulativeLineChartInstance.current.destroy();
      }
    };
  }, [expenses, selectedYear, expensePieChartLabels, expensePieChartValues, incomePieChartLabels, incomePieChartValues, monthlyExpensesValues, monthlyIncomeValues, cumulativeNetValues]);

  const renderCharts = () => {
    // Destroy existing chart instances before creating new ones
    if (expensePieChartInstance.current) {
      expensePieChartInstance.current.destroy();
    }
    if (incomePieChartInstance.current) {
      incomePieChartInstance.current.destroy();
    }
    if (monthlyBarChartInstance.current) {
      monthlyBarChartInstance.current.destroy();
    }
    if (cumulativeLineChartInstance.current) {
      cumulativeLineChartInstance.current.destroy();
    }

    // Render Expense Pie Chart
    if (expensePieChartRef.current) {
      expensePieChartInstance.current = new Chart(expensePieChartRef.current, {
        type: 'pie',
        data: {
          labels: expensePieChartLabels,
          datasets: [{
            data: expensePieChartValues,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#A1E8AF', '#F7B7A3'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Expenses by Category (Selected Year)',
              font: { size: 16 }
            }
          }
        }
      });
    }

    // Render Income Pie Chart
    if (incomePieChartRef.current) {
      incomePieChartInstance.current = new Chart(incomePieChartRef.current, {
        type: 'pie',
        data: {
          labels: incomePieChartLabels,
          datasets: [{
            data: incomePieChartValues,
            backgroundColor: [
              '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#F44336'
            ], // Greenish/Yellowish palette for income
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Income by Category (Selected Year)',
              font: { size: 16 }
            }
          }
        }
      });
    }

    // Render Monthly Income vs. Expenses Bar Chart
    if (monthlyBarChartRef.current) {
      monthlyBarChartInstance.current = new Chart(monthlyBarChartRef.current, {
        type: 'bar',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Monthly Income',
              data: monthlyIncomeValues,
              backgroundColor: 'rgba(75, 192, 192, 0.6)', // Teal for income
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Monthly Expenses',
              data: monthlyExpensesValues,
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red for expenses
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Monthly Income vs. Expenses (Selected Year)',
              font: { size: 16 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount ($)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          }
        }
      });
    }

    // Render Cumulative Net Flow Line Chart
    if (cumulativeLineChartRef.current) {
      cumulativeLineChartInstance.current = new Chart(cumulativeLineChartRef.current, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [{
            label: 'Cumulative Net Flow',
            data: cumulativeNetValues,
            fill: false,
            borderColor: '#FF9F40', // Orange for net flow
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Cumulative Net Flow Trend (Selected Year)',
              font: { size: 16 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cumulative Amount ($)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Month'
              }
            }
          }
        }
      });
    }
  };

  // --- Gemini API Integration: Get Spending Insights ---
  const getSpendingInsights = async () => {
    setIsLoadingInsight(true);
    setLlmInsight(''); // Clear previous insight
    setMessage(''); // Clear any previous messages

    if (filteredTransactions.length === 0) {
      setMessage('No transactions recorded for this year to generate insights.');
      setIsLoadingInsight(false);
      return;
    }

    // Prepare data for the LLM prompt
    let prompt = `Analyze the following yearly financial data for the year ${selectedYear} and provide insightful tips for better financial management and highlight any noticeable spending patterns. Focus on actionable advice and clear observations.

  Total Income: $${totalIncome.toFixed(2)}
  Total Expenses: $${totalExpenses.toFixed(2)}
  Net Savings/Loss: $${netSavings.toFixed(2)}
  
  Spending by Category:
` ;
    for (const category in expenseCategoryData) {
      prompt += `${category}: $${expenseCategoryData[category].toFixed(2)}\n`;
    }

    prompt += `\nIncome by Category:
`;
    for (const category in incomeCategoryData) {
      prompt += `${category}: $${incomeCategoryData[category].toFixed(2)}\n`;
    }

    prompt += `\nMonthly Income:
`;
    monthNames.forEach((month, index) => {
      prompt += `${month}: $${monthlyIncomeValues[index].toFixed(2)}\n`;
    });

    prompt += `\nMonthly Expenses:
`;
    monthNames.forEach((month, index) => {
      prompt += `${month}: $${monthlyExpensesValues[index].toFixed(2)}\n`;
    });

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "" // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setLlmInsight(text);
      } else {
        setMessage('Failed to get insights from AI. Please try again.');
        console.error('Gemini API response structure unexpected:', result);
      }
    } catch (error) {
      setMessage('Error connecting to AI service. Please check your network or try again later.');
      console.error('Error calling Gemini API:', error);
    } finally {
      setIsLoadingInsight(false);
      setTimeout(() => setMessage(''), 5000); // Clear message after a delay
    }
  };


  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount']; // Added 'Type'
    const rows = expenses.map(exp => [exp.id, exp.date, exp.type, exp.category, exp.description, exp.amount]); // Added exp.type
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'transactions.csv'); // Changed filename
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setMessage('Your browser does not support downloading CSV directly. Please copy the text manually.');
    }
  };

  const exportToPDF = () => {
    setMessage('PDF export is typically handled by the backend for better formatting and performance.');
  };

  return (
    <div className="p-4 md:p-8 bg-red-50 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Yearly Financial Analysis Dashboard</h2> {/* Updated title */}

      {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

      {/* Year Selector and Insight Button */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <label htmlFor="year-select" className="text-lg font-medium text-gray-700">Select Year:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-200 ease-in-out focus:shadow-lg"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <button
          onClick={getSpendingInsights}
          disabled={isLoadingInsight}
          className="py-2 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingInsight ? 'Generating...' : '✨ Get Financial Insights'} {/* Updated button text */}
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center transition duration-200 ease-in-out hover:shadow-xl hover:border-blue-400">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center transition duration-200 ease-in-out hover:shadow-xl hover:border-red-400">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center transition duration-200 ease-in-out hover:shadow-xl hover:border-purple-400">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Net Savings/Loss</h3>
          <p className={`text-3xl font-bold ${netSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ${netSavings.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center transition duration-200 ease-in-out hover:shadow-xl hover:border-orange-400">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Most Spent Category</h3>
          <p className="text-3xl font-bold text-purple-600">
            {mostSpentCategory}
          </p>
        </div>
      </div>

      {/* LLM Generated Insight Section */}
      {llmInsight && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8 transition duration-300 ease-in-out transform hover:scale-[1.005] hover:shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-gray-700 text-center">AI Financial Insights ✨</h3> {/* Updated title */}
          <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: llmInsight.replace(/\n/g, '<br/>') }} />
        </div>
      )}
      {isLoadingInsight && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-4 border-blue-500 border-opacity-75"></div>
          <p className="text-gray-600 mt-2">Generating insights...</p>
        </div>
      )}


      {/* Charts - Dashboard Layout (4 equal columns on large screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"> {/* Changed to 2 columns on md and up */}
        {/* Cumulative Net Flow Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center transition duration-200 ease-in-out hover:shadow-xl hover:border-orange-400">
          <canvas ref={cumulativeLineChartRef} className="w-full h-80"></canvas> {/* Adjusted height for consistency */}
        </div>
        {/* Monthly Income vs. Expenses Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center transition duration-200 ease-in-out hover:shadow-xl hover:border-blue-400">
          <canvas ref={monthlyBarChartRef} className="w-full h-80"></canvas>
        </div>
        {/* Expenses by Category Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center transition duration-200 ease-in-out hover:shadow-xl hover:border-pink-400">
          <canvas ref={expensePieChartRef} className="w-full h-80"></canvas>
        </div>
        {/* Income by Category Pie Chart (New) */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center transition duration-200 ease-in-out hover:shadow-xl hover:border-green-400">
          <canvas ref={incomePieChartRef} className="w-full h-80"></canvas>
        </div>
      </div>

      {/* Export Section */}
      <div className="p-4 md:p-8 bg-gray-50 border-t border-gray-200 text-center mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Export Reports</h2>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={exportToCSV}
            className="py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Export to CSV
          </button>
          <button
            onClick={exportToPDF}
            className="py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearlyAnalyticsPage;