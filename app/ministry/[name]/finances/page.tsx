"use client";

import React, { useState, useEffect, useCallback } from "react";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Alert, Snackbar, Menu, MenuItem } from "@mui/material";
import clsx from "clsx";
import "@/app/globals.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

export default function FinancesTrackingPage() {
  const [data, setData] = useState(() => generateData(5, 5));
  const [isLoading, setIsLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState("pie");
  const [chartData, setChartData] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [switchingView, setSwitchingView] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  function generateData(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ value: "" }))
    );
  }

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
      updateChartData(formattedData);
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleSaveClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const saveToComputer = () => {
      const worksheetData = data.map(row => row.map(cell => cell.value));
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "updated_finances.xlsx");
      handleClose();
    };

    const saveToCloud = async () => {
      if (!data || data.length === 0) {
          console.error("No data to save");
          return;
      }

      const worksheetData = data.map(row => row.map(cell => cell.value));
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const fileBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([fileBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      const formData = new FormData();
      formData.append("file", blob, "finances.xlsx");

      try {
          const response = await fetch("/api/files", {
              method: "POST",
              body: formData,
          });

          const result = await response.json();
          if (result.success) {
              console.log("File uploaded successfully");
          } else {
              console.error("Upload failed:", result.error);
          }
      } catch (error) {
          console.error("Error saving file:", error);
      }

      handleClose();
  };

  

  const updateChartData = useCallback((spreadsheetData) => {
    if (spreadsheetData.length < 2) {
      setChartData(null);
      return;
    }

    const labels = spreadsheetData[0].map(cell => cell.value);
    const datasets = spreadsheetData[0].map((_, colIndex) => {
      return spreadsheetData.slice(1).reduce((sum, row) => {
        const value = parseFloat(row[colIndex]?.value);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Data Representation',
          data: datasets,
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1
        }
      ]
    });
  }, []);

  useEffect(() => {
      const fetchStoredFile = async () => {
          try {
              const response = await fetch("/api/files", {
                  method: "GET",  
              });
              const result = await response.json();

              if (response.ok && result.success && result.fileData) {
                  const binaryStr = atob(result.fileData);
                  const byteArray = new Uint8Array(binaryStr.length);
                  for (let i = 0; i < binaryStr.length; i++) {
                      byteArray[i] = binaryStr.charCodeAt(i);
                  }

                  const workbook = XLSX.read(byteArray, { type: "array" });
                  const firstSheetName = workbook.SheetNames[0];
                  const worksheet = workbook.Sheets[firstSheetName];
                  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                  const formattedData = jsonData.map(row =>
                      row.map(cell => ({ value: cell || "" }))
                  );

                  setData(formattedData);
                  updateChartData(formattedData);
              }
          } catch (error) {
              console.error("Error fetching stored file:", error);
          }
      };

      fetchStoredFile();
  }, []);

  

  const toggleChart = () => {
    if (!showChart && !chartData) {
      setAlertOpen(true);
    } else {
      setSwitchingView(true);
      setTimeout(() => {
        setShowChart(!showChart);
        setSwitchingView(false);
      }, 500);
    }
  };

  const handleChartTypeChange = (e) => {
    setChartLoading(true);
    setChartType(e.target.value);
    setTimeout(() => {
      setChartLoading(false);
    }, 500);
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  );

  return (
    <section className="t-20 min-h-screen flex flex-col pt-20">
      <div className="t-15 flex-1 flex flex-col bg-gradient-to-t from-blue-300 to-blue-600 p-30">
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
          
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="mb-4" />
          <button onClick={handleSaveClick} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save File</button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={saveToComputer}>Save to this computer</MenuItem>
            <MenuItem onClick={saveToCloud}>Save to the cloud</MenuItem>
          </Menu>
          {isLoading || switchingView ? (
            <LoadingSpinner />
          ) : (
            <>
              {showChart && chartData ? (
                <div className="w-full h-96 flex flex-col items-center">
                  <select
                    className="mb-4 p-2 border rounded"
                    value={chartType}
                    onChange={handleChartTypeChange}
                  >
                    <option value="pie">Pie Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                  </select>
                  {chartLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {chartType === "pie" && <Pie data={chartData} />}
                      {chartType === "bar" && <Bar data={chartData} />}
                      {chartType === "line" && <Line data={chartData} />}
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full overflow-auto border border-gray-300 rounded-lg">
                  <Spreadsheet data={data} onChange={setData} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity="warning">
          Upload data before showing charts!
        </Alert>
      </Snackbar>
    </section>
  );
  