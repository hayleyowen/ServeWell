//UPDATE

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
    const [charts, setCharts] = useState([]);
    const [activeChart, setActiveChart] = useState(null);
    const [chartName, setChartName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [switchingView, setSwitchingView] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Function to generate initial data with specified rows and columns
    function generateData(rows, cols) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({ value: "" }))
        );
    }

    const createNewChart = () => {
        if (!chartName) {
            const nextChartNumber = charts.length + 1;
            setChartName(`Member Chart ${nextChartNumber}`);
        }
        const newChart = {
            id: Date.now(),
            name: chartName,
            data: generateData(5, 5), // Initialize with 5x5 grid
            chartType: "pie",
            chartData: null,
        };
        setCharts([...charts, newChart]);
        setActiveChart(newChart.id);
        setChartName("");
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

            if (!activeChart) {
                // Generate automatic chart name
                const nextChartNumber = charts.length + 1;
                const newChartName = `Member Chart ${nextChartNumber}`;
                const newChart = {
                    id: Date.now(),
                    name: newChartName,
                    data: formattedData,
                    chartType: "pie",
                    chartData: null,
                };
                setCharts([...charts, newChart]);
                setActiveChart(newChart.id);
                updateChartData(newChart.id, formattedData);
            } else {
                setCharts(prevCharts => prevCharts.map(chart =>
                    chart.id === activeChart ? { ...chart, data: formattedData } : chart
                ));
                updateChartData(activeChart, formattedData);
            }
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
        if (activeChart) {
            const activeChartData = charts.find(chart => chart.id === activeChart);
            if (!activeChartData) return null; // Prevents errors
            const worksheetData = activeChartData.data.map(row => row.map(cell => cell.value));
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${charts.find(chart => chart.id === activeChart).name}.xlsx`);
        }
        handleClose();
    };

    const saveToCloud = async () => {
        if (activeChart) {
            const activeChartData = charts.find(chart => chart.id === activeChart);
            if (!activeChartData) return null;
            const worksheetData = activeChartData.data.map(row => row.map(cell => cell.value));
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            const fileBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([fileBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

            const formData = new FormData();
            formData.append("file", blob, `${charts.find(chart => chart.id === activeChart).name}.xlsx`);

            try {
                const response = await fetch("/api/uploadFile", {
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
        }
        handleClose();
    };

    const updateChartData = (chartId, spreadsheetData) => {
        if (spreadsheetData.length < 2) return;
        const labels = spreadsheetData[0].map(cell => cell.value);
        const datasets = spreadsheetData[0].map((_, colIndex) => {
            return spreadsheetData.slice(1).reduce((sum, row) => {
                const value = parseFloat(row[colIndex]?.value);
                return sum + (isNaN(value) ? 0 : value);
            }, 0);
        });

        setCharts(prevCharts => prevCharts.map(chart =>
            chart.id === chartId ? {
                ...chart,
                chartData: {
                    labels,
                    datasets: [{
                        label: 'Data Representation',
                        data: datasets,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }]
                }
            } : chart
        ));
    };

    const handleChartTypeChange = (chartId, type) => {
        setChartLoading(true);
        setCharts(prevCharts => prevCharts.map(chart =>
            chart.id === chartId ? { ...chart, chartType: type } : chart
        ));
        setTimeout(() => {
            setChartLoading(false);
        }, 500);
    };

    const deleteChart = (chartId) => {
        setCharts(charts.filter(chart => chart.id !== chartId));
        if (activeChart === chartId) {
            setActiveChart(charts.length > 1 ? charts[0].id : null);
        }
    };


    const toggleChart = () => {
        if (!activeChart || !charts.find(chart => chart.id === activeChart).data ||
            charts.find(chart => chart.id === activeChart).data.length === 0 ||
            charts.find(chart => chart.id === activeChart).data.every(row => row.every(cell => cell.value === ""))) {
            setAlertOpen(true);
            return;
        }

        setSwitchingView(true);
        setTimeout(() => {
            setShowChart(!showChart);
            setSwitchingView(false);
        }, 500);
    };

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
    );

    // Function to add a new row to the spreadsheet data
    const addRow = () => {
        if (activeChart) {
            setCharts(prevCharts =>
                prevCharts.map(chart =>
                    chart.id === activeChart
                        ? {
                            ...chart,
                            data: [...chart.data, Array(chart.data[0].length).fill({ value: "" })],
                        }
                        : chart
                )
            );
        }
    };

    // Function to add a new column to the spreadsheet data
    const addColumn = () => {
        if (activeChart) {
            setCharts(prevCharts =>
                prevCharts.map(chart =>
                    chart.id === activeChart
                        ? {
                            ...chart,
                            data: chart.data.map(row => [...row, { value: "" }]),
                        }
                        : chart
                )
            );
        }
    };

    return (
        <section className="h-screen flex flex-col">
            <div className="bg-white p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800">ServeWell</h1>
            </div>

            <div className="flex-1 flex flex-col bg-blue-500">
                <div className={`bg-white rounded-lg shadow-md p-6 m-4 flex flex-col items-center overflow-auto ${isFullScreen ? "fixed inset-0 z-50" : ""}`} style={{ maxHeight: isFullScreen ? '100vh' : '70vh', width: isFullScreen ? '100%' : '90%', margin: isFullScreen ? '0' : '0 auto' }}>
                    <div className="flex justify-between items-center w-full mb-4">
                        <h1 className="text-xl font-semibold text-gray-700">
                            Member SpreadSheet
                        </h1>
                        <div className="flex gap-4">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={showChart}
                                    onChange={toggleChart}
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

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={chartName}
                            onChange={(e) => setChartName(e.target.value)}
                            placeholder="Chart Name"
                            className="border p-2"
                        />
                        <button onClick={createNewChart} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Create Chart</button>
                    </div>
                    <div className="tabs-container border-b pb-2 h-12 flex-shrink-0">
                        {charts.map((chart) => (
                            <div
                                key={chart.id}
                                className={clsx("p-2 border rounded-md flex items-center mr-2", { "bg-gray-300": activeChart === chart.id })}
                            >
                                <button onClick={() => setActiveChart(chart.id)} className="mr-2">{chart.name}</button>
                                <button onClick={() => deleteChart(chart.id)} className="text-red-500 font-bold text-lg">✖</button>
                            </div>
                        ))}
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
                            {showChart && activeChart && charts.find(chart => chart.id === activeChart).chartData ? (
                                <div className="w-full h-96 flex flex-col items-center">
                                    <select
                                        className="mb-4 p-2 border rounded"
                                        value={charts.find(chart => chart.id === activeChart).chartType}
                                        onChange={(e) => handleChartTypeChange(activeChart, e.target.value)}
                                    >
                                        <option value="pie">Pie Chart</option>
                                        <option value="bar">Bar Chart</option>
                                        <option value="line">Line Chart</option>
                                    </select>
                                    {chartLoading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            {charts.find(chart => chart.id === activeChart).chartType === "pie" && <Pie data={charts.find(chart => chart.id === activeChart).chartData} />}
                                            {charts.find(chart => chart.id === activeChart).chartType === "bar" && <Bar data={charts.find(chart => chart.id === activeChart).chartData} />}
                                            {charts.find(chart => chart.id === activeChart).chartType === "line" && <Line data={charts.find(chart => chart.id === activeChart).chartData} />}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full overflow-auto border border-gray-300 rounded-lg">
                                    <div className="flex justify-end mb-2">
                                        <button onClick={addRow} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2">Add Row</button>
                                        <button onClick={addColumn} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Add Column</button>
                                    </div>
                                    {activeChart && (
                                        <Spreadsheet
                                            data={charts.find(chart => chart.id === activeChart).data}
                                            onChange={(newData) => {
                                                setCharts(prevCharts => prevCharts.map(chart =>
                                                    chart.id === activeChart ? { ...chart, data: newData } : chart
                                                ));
                                                updateChartData(activeChart, newData);
                                            }}
                                        />
                                    )}
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
}
