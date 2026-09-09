const pool = require('../config/db');
const { successResponse, errorResponse } = require('../middlewares/response');

// GET /queues (Daftar antrean hari ini)
exports.getTodayQueues = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.*, p.name as patient_name 
       FROM queues q
       JOIN registrations r ON q.registration_id = r.id
       JOIN patients p ON r.patient_id = p.id
       WHERE q.created_at::date = CURRENT_DATE
       ORDER BY q.id ASC`
    );
    return successResponse(res, 200, 'Success', result.rows);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// POST /queues (Generate manual jika dibutuhkan)
exports.createQueue = async (req, res) => {
  try {
    const { registration_id } = req.body;
    const queue_number = await generateQueueNumber();
    const result = await pool.query(
      `INSERT INTO queues (registration_id, queue_number) VALUES ($1, $2) RETURNING *`,
      [registration_id, queue_number]
    );
    return successResponse(res, 201, 'Antrean berhasil dibuat', result.rows[0]);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// PUT /queues/:id/call (Memanggil antrean berikutnya)
exports.callQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE queues SET status = 'called', called_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) return errorResponse(res, 404, 'Antrean tidak ditemukan');
    
    // Sekalian ubah status registrasi menjadi "Check In"
    await pool.query(
      `UPDATE registrations SET status = 'Check In' 
       WHERE id = (SELECT registration_id FROM queues WHERE id = $1)`, [id]
    );

    return successResponse(res, 200, 'Antrean dipanggil', result.rows[0]);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// PUT /queues/:id/status (Selesai dilayani)
exports.updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status: 'waiting', 'called', 'done'

    const result = await pool.query(
      `UPDATE queues SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) return errorResponse(res, 404, 'Antrean tidak ditemukan');

    // Ubah status registrasi juga
    await pool.query(
      `UPDATE registrations SET status = 'Selesai' 
       WHERE id = (SELECT registration_id FROM queues WHERE id = $1)`, [id]
    );

    return successResponse(res, 200, 'Status antrean diperbarui', result.rows[0]);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

const generateQueueNumber = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const result = await pool.query(
    `SELECT COUNT(*) FROM queues WHERE created_at::date = $1`, [today]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `A${String(count).padStart(3, '0')}`;
};