const express = require('express');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const cors = require('cors'); 
const app = express();
const { spawn } = require('child_process');


app.use(cors());
app.use(express.json());

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

// Route 5: Generate insights using Python script
app.post('/api/insights', express.json(), (req, res) => {
  const { prompt, excelFile } = req.body;

  if (!prompt || !excelFile) {
    return res.status(400).json({ error: 'Missing prompt or excelFile' });
  }

  const pythonProcess = spawn('python3', ['domoInsights.py', prompt, excelFile]);

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', data => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', data => {
    error += data.toString();
  });

  pythonProcess.on('close', code => {
    if (code !== 0 || error) {
      console.error('Python error:', error);
      return res.status(500).json({ error: error || 'Python script failed' });
    }

    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch (e) {
      console.error('Failed to parse Python output:', result);
      res.status(500).json({ error: 'Invalid JSON returned from Python' });
    }
  });
});



module.exports = app;
const PORT = 5000;
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}


