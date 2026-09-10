const pool = require('../config/db');
const { successResponse, errorResponse } = require('../middlewares/response');

// Helper Auto Generate Nomor Antrean (A001, A002, ...)
const generateQueueNumber = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const result = await pool.query(
    `SELECT COUNT(*) FROM queues WHERE created_at::date = $1`, [today]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `A${String(count).padStart(3, '0')}`;
};

// GET /registrations
exports.getAllRegistrations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name as patient_name, u.name as doctor_name, q.queue_number
       FROM registrations r
       JOIN patients p ON r.patient_id = p.id
       LEFT JOIN users u ON r.doctor_id = u.id
       LEFT JOIN queues q ON r.id = q.registration_id
       ORDER BY r.id DESC`
    );
    return successResponse(res, 200, 'Success', result.rows);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// POST /registrations
exports.createRegistration = async (req, res) => {
  try {
    const { patient_id, doctor_id, poli, visit_date, payment_type, initial_complaint } = req.body;
    
    if (!patient_id || !poli || !visit_date || !payment_type) 
      return errorResponse(res, 400, 'Data pendaftaran tidak lengkap');

    // Insert ke tabel registrations
    const regResult = await pool.query(
      `INSERT INTO registrations (patient_id, doctor_id, poli, visit_date, payment_type, initial_complaint) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [patient_id, doctor_id, poli, visit_date, payment_type, initial_complaint]
    );

    const registration = regResult.rows[0];

    // Otomatis buatkan antrean
    const queue_number = await generateQueueNumber();
    const queueResult = await pool.query(
      `INSERT INTO queues (registration_id, queue_number) VALUES ($1, $2) RETURNING *`,
      [registration.id, queue_number]
    );

    return successResponse(res, 201, 'Pendaftaran berhasil', {
      registration,
      queue: queueResult.rows[0]
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// PUT /registrations/:id
exports.updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor_id, poli, status } = req.body;

    const result = await pool.query(
      `UPDATE registrations SET doctor_id = $1, poli = $2, status = $3 WHERE id = $4 RETURNING *`,
      [doctor_id, poli, status, id]
    );

    if (result.rows.length === 0) return errorResponse(res, 404, 'Pendaftaran tidak ditemukan');
    
    return successResponse(res, 200, 'Status pendaftaran diperbarui', result.rows[0]);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};