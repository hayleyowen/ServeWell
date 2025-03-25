"use client";

import React, { useState, useEffect, useCallback } from "react";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Alert, Snackbar, Menu, MenuItem } from "@mui/material";
import clsx from "clsx";
import "@/app/globals.css";
import { FaSearch, FaEnvelope, FaPhone, FaComments, FaUsers } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

export default function FinancesTrackingPage() {
    const [data, setData] = useState(() => generateData(5, 5));
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
    const [chartType, setChartType] = useState("pie");
    const [chartData, setChartData] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [originalData, setOriginalData] = useState(null);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [contactMessage, setContactMessage] = useState('');
    const [memberListOpen, setMemberListOpen] = useState(false);

    // Function to generate initial data with specified rows and columns
    function generateData(rows, cols) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({ value: "" }))
        );
    }

    const createNewChart = () => {
        if (!chartName.trim()) {
            setAlertOpen(true); // Show an alert if the name is empty
            return;
        }
    
        const newChart = {
            id: Date.now(),
            name: chartName.trim(),
            data: generateData(5, 5), // Initialize with a 5x5 grid
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
            if (!activeChartData) return;
    
            const tabName = prompt("Enter a tab name for this file:");
            if (!tabName || tabName.trim() === "") {
                alert("Tab name is required.");
                return;
            }
    
            console.log("📤 Uploading file:", activeChartData.name, "Tab:", tabName);
    
            const worksheetData = activeChartData.data.map(row => row.map(cell => cell.value));
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
            const fileBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([fileBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
            const formData = new FormData();
            const file = new File([blob], `${activeChartData.name}.xlsx`, { type: blob.type });
    
            formData.append("file", file);
            formData.append("tab_name", tabName);
    
            try {
                const response = await fetch("/api/files", {
                    method: "POST",
                    body: formData,
                });
    
                const text = await response.text();
                console.log("📩 Raw API Response:", text);
    
                try {
                    const result = JSON.parse(text);
                    if (result.success) {
                        console.log("✅ File uploaded successfully");
                    } else {
                        console.error("❌ Upload failed:", result.error);
                    }
                } catch (jsonError) {
                    console.error("❌ Invalid JSON response:", text);
                }
            } catch (error) {
                console.error("❌ Error saving file:", error);
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
        setCharts(prevCharts => {
            const updatedCharts = prevCharts.filter(chart => chart.id !== chartId);
            setActiveChart(updatedCharts.length > 0 ? updatedCharts[0].id : null);
            return updatedCharts;
        });
    };

    useEffect(() => {
        const fetchStoredFile = async () => {
            try {
                const response = await fetch("/api/files");
                const text = await response.text();
                console.log("📥 Raw API Response:", text);
    
                let result;
                try {
                    result = JSON.parse(text);
                } catch (jsonError) {
                    console.error("❌ Failed to parse JSON response:", text);
                    return;
                }
    
                if (!response.ok || !result.success || !result.fileData) {
                    console.error("❌ Error: No valid file data found in response.");
                    return;
                }
    
                console.log("✅ File data received:", result.filename, "Tab:", result.tabName);
    
                // Decode Base64
                const byteCharacters = atob(result.fileData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const workbook = XLSX.read(byteArray.buffer, { type: "array" });
    
                if (!workbook || workbook.SheetNames.length === 0) {
                    console.error("❌ No valid sheets found in the file.");
                    return;
                }
    
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
    
                if (!worksheet) {
                    console.error("❌ Worksheet not found in the file.");
                    return;
                }
    
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
                if (!jsonData || jsonData.length === 0) {
                    console.warn("⚠️ Warning: The file is empty or contains no valid data.");
                    return;
                }
    
                // Format data properly
                const formattedData = jsonData.map(row =>
                    row.map(cell => ({ value: cell || "" }))
                );
    
                // If there are no active charts, create one for this file
                if (charts.length === 0 || !activeChart) {
                    console.log("📊 Creating new chart for loaded file...");
    
                    const newChart = {
                        id: Date.now(),
                        name: result.tabName || "Loaded Chart",
                        data: formattedData,
                        chartType: "pie",
                        chartData: null,
                    };
    
                    setCharts([...charts, newChart]);
                    setActiveChart(newChart.id);
                } else {
                    // Update existing active chart
                    setCharts(prevCharts =>
                        prevCharts.map(chart =>
                            chart.id === activeChart ? { ...chart, data: formattedData } : chart
                        )
                    );
                }
    
                console.log("✅ Successfully loaded spreadsheet data:", formattedData);
                updateChartData(activeChart, formattedData);
    
            } catch (error) {
                console.error("❌ Error fetching stored file:", error);
            }
        };
    
        fetchStoredFile();
    }, []);
    
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

    // Update filtered data whenever search query changes
    useEffect(() => {
        if (!activeChart || !charts.find(chart => chart.id === activeChart)?.data) {
            return;
        }

        const currentChart = charts.find(chart => chart.id === activeChart);
        
        if (!searchQuery.trim()) {
            // If no search query, show all data
            setFilteredData(currentChart.data);
            return;
        }

        const searchTerm = searchQuery.toLowerCase();
        
        // Filter and highlight matching data
        const filtered = currentChart.data.filter(row =>
            row.some(cell => 
                cell.value?.toString().toLowerCase().includes(searchTerm)
            )
        ).map(row =>
            row.map(cell => ({
                ...cell,
                className: cell.value?.toString().toLowerCase().includes(searchTerm)
                    ? "bg-yellow-200"
                    : ""
            }))
        );

        setFilteredData(filtered);
    }, [searchQuery, activeChart, charts]);

    const handleContactMember = (rowIndex) => {
        if (!activeChart) return;
        
        const currentData = charts.find(chart => chart.id === activeChart).data;
        if (!currentData || !currentData[rowIndex]) return;
        
        // Assuming first column is name, second is email
        const member = {
            name: currentData[rowIndex][0]?.value || '',
            email: currentData[rowIndex][1]?.value || '',
            rowIndex
        };
        
        setSelectedMember(member);
        setContactModalOpen(true);
        setMemberListOpen(false); // Close the member list
    };
    
    const openMemberList = () => {
        setMemberListOpen(true);
    };
    
    const handleSendEmail = async () => {
        if (!selectedMember || !contactMessage.trim()) {
            alert("Please enter a message");
            return;
        }
        
        try {
            setIsLoading(true);
            
            // Here you would integrate with your actual email service
            const response = await fetch('/api/contact/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: selectedMember.email,
                    message: contactMessage,
                    memberName: selectedMember.name
                }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert(`Email sent to ${selectedMember.name} successfully!`);
                setContactModalOpen(false);
                setContactMessage('');
            } else {
                alert(`Error: ${result.error || 'Failed to send email'}`);
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Add this function to get alphabetically sorted members
    const getSortedMembers = () => {
        if (!activeChart) return [];
        
        const currentData = charts.find(chart => chart.id === activeChart).data;
        if (!currentData) return [];
        
        // Filter out rows without names and create member objects
        const members = currentData
            .filter(row => row[0]?.value)
            .map((row, index) => ({
                name: row[0]?.value || '',
                email: row[1]?.value || '',
                rowIndex: index
            }));
        
        // Sort alphabetically by name
        return members.sort((a, b) => 
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
    };

    return (
        <section className="h-screen flex flex-col">
            <style>
                {`
                    .highlighted-cell {
                        background-color: yellow !important;
                        transition: background-color 0.3s;
                    }
                `}
            </style>
            <div className="bg-white p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800">ServeWell</h1>
            </div>
    
            <div className="flex-1 flex flex-col bg-blue-500 justify-center">
                <div className={`bg-white rounded-lg shadow-md p-6 m-4 flex flex-col items-center overflow-auto ${
                    isFullScreen ? "fixed inset-0 z-50" : ""
                }`} style={{ maxHeight: isFullScreen ? '100vh' : '70vh', width: isFullScreen ? '100%' : '90%', margin: isFullScreen ? '0' : '0 auto' }}>
                    
                    <div className="flex justify-between items-center w-full mb-4">
                        <h1 className="text-xl font-semibold text-gray-700">Member SpreadSheet</h1>
                        
                        <div className="flex gap-4">
                            {/* Search Bar */}
                            <div className="relative flex items-center">
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <FaSearch className="text-gray-600" />
                                </button>
                                {showSearch && (
                                    <input
                                        type="text"
                                        placeholder="Search members..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="absolute right-10 w-64 p-2 border rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                )}
                            </div>
    
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
    
                    {/* Chart Name Input & Create Button */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={chartName}
                            onChange={(e) => setChartName(e.target.value)}
                            placeholder="Chart Name"
                            className="border p-2 rounded-md"
                        />
                        <button 
                            onClick={createNewChart} 
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            disabled={!chartName.trim()} // Prevents empty chart names
                        >
                            Create Chart
                        </button>
                    </div>
    
                    {/* Chart Tabs */}
                    <div className="tabs-container border-b pb-2 h-12 flex-shrink-0">
                        {charts.map((chart) => (
                            <div
                                key={chart.id}
                                className={clsx("p-2 border rounded-md flex items-center mr-2", { "bg-gray-300": activeChart === chart.id })}
                            >
                                <button onClick={() => setActiveChart(chart.id)} className="mr-2">{chart.name}</button>
                                <button onClick={() => deleteChart(chart.id)} className="text-blue-500 font-bold text-lg">X</button>
                            </div>
                        ))}
                    </div>
    
                    <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="mb-4" />
                    <button onClick={handleSaveClick} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Save File
                    </button>
    
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
                                {/* Add a single email button above the spreadsheet */}
                                <div className="p-2 border-b flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Member SpreadSheet</h3>
                                    <button 
                                        onClick={openMemberList}
                                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    >
                                        <FaEnvelope className="mr-2" /> 
                                        Email Members
                                    </button>
                                </div>
                                
                                {/* Existing spreadsheet code */}
                                <div className="flex justify-end mb-2 p-2">
                                    <button onClick={addRow} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2">
                                        Add Row
                                    </button>
                                    <button onClick={addColumn} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-green-600">
                                        Add Column
                                    </button>
                                </div>
                                {activeChart && (
                                    <Spreadsheet
                                        data={searchQuery.trim() ? filteredData : charts.find(chart => chart.id === activeChart).data}
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
                {chartName.trim() ? "Upload data before showing charts!" : "Please enter a chart name!"}
            </Alert>
        </Snackbar>
        {/* Member List Modal - Updated to use sorted members */}
        {memberListOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FaUsers className="mr-2" /> Select Member to Email
                    </h2>
                    
                    <div className="overflow-y-auto flex-grow">
                        <div className="divide-y">
                            {getSortedMembers().map((member, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handleContactMember(member.rowIndex)}
                                    className="w-full text-left p-3 hover:bg-blue-50 flex justify-between items-center"
                                >
                                    <span>{member.name}</span>
                                    <span className="text-gray-500 text-sm">{member.email}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setMemberListOpen(false)}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
        {/* Email Contact Modal */}
        {contactModalOpen && selectedMember && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Email {selectedMember.name}</h2>
                    
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Sending to: {selectedMember.email}
                        </p>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                        </label>
                        <textarea
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={5}
                            placeholder={`Type your email message to ${selectedMember.name} here...`}
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setContactModalOpen(false)}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSendEmail}
                            disabled={!contactMessage.trim() || isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </section>
    );
    