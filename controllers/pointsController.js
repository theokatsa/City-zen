const pool = require('../db');

exports.getMyPoints = async (req, res) => {
  try {
    const citizenId = req.user.citizenId;
    if (!citizenId) {
      return res.status(400).json({ error: 'Citizen ID not found in token' });
    }

    // Call stored procedure to get points
    const [rows] = await pool.query('CALL GetCitizenPoints(?)', [citizenId]);

    // The result of CALL is an array: rows[0] is the actual result set
    const pointsRow = rows[0][0];

    // Default to 0 if no points found
    const totalPoints = pointsRow ? pointsRow.points : 0;

    res.json({ points: totalPoints });
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ error: 'Server error while fetching points' });
  }
};
