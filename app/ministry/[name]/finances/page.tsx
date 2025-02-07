"use client";

import React, { useState } from "react";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import clsx from "clsx";
import "@/app/globals.css";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FinancesPage() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [data, setData] = useState(generateData(5, 5));
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChart, setShowChart] = useState(false);

  function generateData(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ value: "" }))
    );
  }

  const updateDimensions = () => {
    const newRows = parseInt(rows, 10);
    const newCols = parseInt(cols, 10);

    if (newRows > 0 && newCols > 0) {
      setData(generateData(newRows, newCols));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const formattedData = jsonData.map((row) =>
        row.map((cell) => ({ value: cell || "" }))
      );

      setData(formattedData);
      setRows(formattedData.length);
      setCols(formattedData[0]?.length || 0);
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const chartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <section className="h-screen flex flex-col">
      <div className="flex-1 flex flex-col bg-blue-500">
        <div className="flex flex-col items-center justify-center pt-8">
          <h2 className="text-2xl font-bold text-white mb-8">
            Financial Tracking Homepage
          </h2>
        </div>

        <div className={`bg-white rounded-lg shadow-md p-6 m-4 flex flex-col items-center overflow-auto ${isFullScreen ? "fixed inset-0 z-50" : ""}`} style={{ maxHeight: isFullScreen ? '100vh' : '70vh', width: isFullScreen ? '100%' : '90%', margin: isFullScreen ? '0' : '0 auto' }}>
          <div className="flex justify-between items-center w-full mb-4">
            <h1 className="text-xl font-semibold text-gray-700">
              Customizable Spreadsheet
            </h1>
            <div className="flex gap-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={showChart}
                  onChange={() => setShowChart(!showChart)}
                  className="mr-2"
                />
                Show Chart
              </label>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {isFullScreen ? "Exit Full Screen" : "Full Screen"}
              </button>
            </div>
          </div>

          {showChart ? (
            <Pie data={chartData} className="w-full h-full" />
          ) : (
            <>
              <div className="mb-4 flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rows:</label>
                  <input
                    type="number"
                    min="1"
                    value={rows}
                    onChange={(e) => setRows(e.target.value)}
                    className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Columns:</label>
                  <input
                    type="number"
                    min="1"
                    value={cols}
                    onChange={(e) => setCols(e.target.value)}
                    className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>

                <button
                  onClick={updateDimensions}
                  className="self-end bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
              </div>

              <div className="mb-4">
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
                  Upload Excel or Google Sheets file:
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="mt-2 block text-sm text-gray-600"
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
              ) : (
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <Spreadsheet
                    data={data}
                    onChange={(updatedData) => setData(updatedData)}
                    className="border border-gray-300 rounded-lg overflow-auto"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
} 