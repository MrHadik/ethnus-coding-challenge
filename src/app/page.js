"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ totalSaleAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [month, search, currentPage]);

  const fetchTransactions = async () => {
    const res = await axios.get(`/api/transactions`, {
      params: {
        page: currentPage,
        perPage: 10,
        search,
        month
      }
    });
    setTransactions(res.data.transactions);
    setTotalPages(res.data.pagination.totalPages);
  };

  const fetchStatistics = async () => {
    const res = await axios.get(`/api/statistics`, { params: { month } });
    setStats(res.data);
  };

  const fetchBarChartData = async () => {
    const res = await axios.get(`/api/barchart`, { params: { month } });
    setBarChartData({
      labels: res.data.map(item => item.range),
      datasets: [{
        label: 'Number of Items',
        data: res.data.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setCurrentPage(1); // Reset to first page on month change
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
        <input
            type="text"
            placeholder="Search transactions"
            value={search}
            onChange={handleSearchChange}
            className="p-2 border rounded"
          />
        </div>
        <div>
        <label className="block mb-2">
            Select Month:
            <select
              value={month}
              onChange={handleMonthChange}
              className="ml-2 p-1 border rounded"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          
        </div>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="py-2 px-4 border-b">{transaction.title}</td>
              <td className="py-2 px-4 border-b">{transaction.description}</td>
              <td className="py-2 px-4 border-b">{transaction.price}</td>
              <td className="py-2 px-4 border-b">
                {new Date(transaction.dateOfSale).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-2 px-4 border-t" colSpan="4">
              <div className="flex justify-between items-center">
                <div>
                  Current Page: {currentPage}
                </div>
                <div>
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white py-1 px-4 rounded disabled:bg-gray-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white py-1 px-4 rounded disabled:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
                <div>
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="mb-4 bg-yellow-200 p-4 rounded">
        <h2 className="text-xl font-bold">Statistics - {month}</h2>
        <p>Total Sale Amount: {stats.totalSaleAmount}</p>
        <p>Total Sold Items: {stats.totalSoldItems}</p>
        <p>Total Not Sold Items: {stats.totalNotSoldItems}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Bar Chart</h2>
        <Bar data={barChartData} />
      </div>
    </div>
  </main>
  
  
  );
};

export default TransactionsPage;
