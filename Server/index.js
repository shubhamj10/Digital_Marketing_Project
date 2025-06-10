const express = require('express');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const cors = require('cors'); 
const app = express();
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
dotenv.config();

app.use(cors());
app.use(express.json());



const openai = new OpenAI({ apiKey: process.env.open_ai_key });
const EXCEL_FOLDER = path.join(__dirname, 'data');

function cleanExcelData(data) {
  if (!Array.isArray(data) || data.length === 0) return "No usable data";

  const filteredRows = data.filter(row => Object.values(row).some(value => value !== null && value !== 0 && value !== ''));

  const validColumns = Object.keys(filteredRows[0]).filter(col =>
    filteredRows.some(row => row[col] !== null && row[col] !== 0 && row[col] !== '')
  );

  const cleanedData = filteredRows.map(row => {
    const cleanedRow = {};
    validColumns.forEach(col => cleanedRow[col] = row[col]);
    return cleanedRow;
  });

  const table = [validColumns.join('\t')];
  cleanedData.slice(0, 50).forEach(row => {
    table.push(validColumns.map(col => row[col]).join('\t'));
  });

  return table.join('\n');
}


// Route 1
app.get('/data/sales-data', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'sales-data.xlsx');  
  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    res.json(jsonData); 
  } else {
    res.status(404).send('File not found');
  }
});

// Route 2:
app.get('/data/piechart-general-spends', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'Distribution of Spends (in INR) as per Month & Brand Selection.csv');

  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const pieChartData = jsonData.map(item => ({
      Label: item.Distribution,
      Value: item.Spends,
    }));

    res.json(pieChartData);
  } else {
    res.status(404).send('File not found');
  }
});

// Route 3: 
app.get('/data/piechart-digital-spends', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'Distribution of Other Digital Spends (in INR) as per Month & Brand Selection.csv');

  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const pieChartData = jsonData.map(item => ({
      Label: item.PLATFORM_MOD,
      Value: item.Spends,
    }));

    res.json(pieChartData);
  } else {
    res.status(404).send('File not found');
  }
});

// route 4
app.get('/data/spends-data', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'spends_data.xlsx');

  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Fix the Month column if it's a number (Excel serial date)
    jsonData = jsonData.map(item => {
      if (item.Month && !isNaN(item.Month)) {
        const excelSerialDate = Number(item.Month);
        const jsDate = new Date(Math.round((excelSerialDate - 25569) * 86400 * 1000));
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonth = `${monthNames[jsDate.getMonth()]}-${String(jsDate.getFullYear()).slice(2)}`;
        return { ...item, Month: formattedMonth };
      }
      return item;
    });

    res.json(jsonData);
  } else {
    res.status(404).send('File not found');
  }
});

// Route 5:
app.post('/api/insights', async (req, res) => {
  const { prompt, excelFile } = req.body;

  if (!prompt || !excelFile || excelFile.includes('..') || excelFile.startsWith('/')) {
    return res.status(400).json({ error: 'Invalid or missing prompt/excelFile' });
  }

  const filePath = path.join(EXCEL_FOLDER, excelFile);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `File not found: ${excelFile}` });
  }

  try {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const dataString = cleanExcelData(data);
    const fullPrompt = `${prompt}\n\nHere is the dataset:\n${dataString}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert data analyst." },
        { role: "user", content: fullPrompt }
      ],
      temperature: 0.5
    });

    const insight = completion.choices[0].message.content;
    res.json({ insight });
  } catch (err) {
    console.error("Insight generation failed:", err.message);
    res.status(500).json({ error: "Failed to generate insight", details: err.message });
  }
});

module.exports = app;
const PORT = 5000;
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}


