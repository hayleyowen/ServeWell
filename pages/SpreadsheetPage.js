import React, { useState } from "react";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";

const SpreadsheetPage = () => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [data, setData] = useState(generateData(5, 5));
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Generate an empty spreadsheet of the given size
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

    setIsLoading(true); // Show spinner while processing
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Convert JSON data into the format required by react-spreadsheet
      const formattedData = jsonData.map((row) =>
        row.map((cell) => ({ value: cell || "" }))
      );

      setData(formattedData);
      setRows(formattedData.length);
      setCols(formattedData[0]?.length || 0);
      setIsLoading(false); // Hide spinner after processing
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Customizable Spreadsheet
      </h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <div>
          <label>Rows:</label>
          <input
            type="number"
            min="1"
            value={rows}
            onChange={(e) => setRows(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "5px",
              width: "60px",
            }}
          />
        </div>
        <div>
          <label>Columns:</label>
          <input
            type="number"
            min="1"
            value={cols}
            onChange={(e) => setCols(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "5px",
              width: "60px",
            }}
          />
        </div>
        <button
          onClick={updateDimensions}
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Update
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="fileUpload" style={{ marginRight: "10px" }}>
          Upload Excel or Google Sheets file:
        </label>
        <input
          type="file"
          id="fileUpload"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #007BFF",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      ) : (
        <Spreadsheet
          data={data}
          onChange={(updatedData) => setData(updatedData)}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
          }}
        />
      )}
    </div>
  );
};

export default SpreadsheetPage;
