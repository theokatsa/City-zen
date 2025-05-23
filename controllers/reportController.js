// controllers/reportController.js
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// Multer setup (for image upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Exported multer upload middleware
exports.upload = upload.single('image');

// Controller: GET all reports
exports.getAllReports = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, r.category, r.description, r.priority, r.status, r.created_at,
             c.name AS citizen_name,
             l.address AS location_address
      FROM report r
      JOIN citizen c ON r.citizen_id = c.id
      JOIN location l ON r.location_id = l.id
      ORDER BY r.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller: Create a new report
exports.createReport = async (req, res) => {
  try {
    const { latitude, longitude, address, category, comment, citizen_id } = req.body;
    const imageFile = req.file;

    if (!latitude || !longitude || !address || !category || !imageFile || !citizen_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [locationResult] = await pool.query(
      'INSERT INTO location (latitude, longitude, address) VALUES (?, ?, ?)',
      [latitude, longitude, address]
    );

    const location_id = locationResult.insertId;

    const [reportResult] = await pool.query(
      `INSERT INTO report (citizen_id, location_id, category, description, status, created_at, image_path)
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [citizen_id, location_id, category, comment || '', 'pending', imageFile.filename]
    );

    res.json({ message: 'Report created successfully', reportId: reportResult.insertId });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
