const pool = require('../config/db');
const { successResponse, errorResponse } = require('../middlewares/response');

// Helper: Auto Generate Nomor Rekam Medis (RM-YYYY-XXXX)
const generateRM = async () => {
  const year = new Date().getFullYear();
  const countResult = await pool.query('SELECT COUNT(*) FROM patients');
  const count = parseInt(countResult.rows[0].count) + 1;
  return `RM-${year}-${String(count).padStart(4, '0')}`;
};

// GET /patients?search=budi&page=1&limit=10
exports.getAllPatients = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM patients 
       WHERE name ILIKE $1 OR nik ILIKE $1 
       ORDER BY id DESC 
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM patients WHERE name ILIKE $1 OR nik ILIKE $1`,
      [`%${search}%`]
    );

    return successResponse(res, 200, 'Success', {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalResult.rows[0].count)
      }
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// GET /patients/:id
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (result.rows.length === 0) return errorResponse(res, 404, 'Pasien tidak ditemukan');
    
    return successResponse(res, 200, 'Success', result.rows[0]);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// POST /patients
exports.createPatient = async (req, res) => {
  try {
    const { nik, name, gender, birth_date, phone, address } = req.body;
    
    if (!nik || !name || !gender || !birth_date) 
      return errorResponse(res, 400, 'Nik, nama, jenis kelamin, dan tanggal lahir wajib diisi');

    // Cek duplikat NIK
    const checkNIK = await pool.query('SELECT * FROM patients WHERE nik = $1', [nik]);
    if (checkNIK.rows.length > 0) 
      return errorResponse(res, 400, 'NIK sudah terdaftar');

    const medical_record_no = await generateRM();

    const result = await pool.query(
      `INSERT INTO patients (medical_record_no, nik, name, gender, birth_date, phone, address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [medical_record_no, nik, name, gender, birth_date, phone, address]
    );

    return successResponse(res, 201, 'Pasien berhasil ditambahkan', result.rows[0]);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// PUT /patients/:id
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nik, name, gender, birth_date, phone, address } = req.body;

    const result = await pool.query(
      `UPDATE patients SET nik = $1, name = $2, gender = $3, birth_date = $4, phone = $5, address = $6 
       WHERE id = $7 RETURNING *`,
      [nik, name, gender, birth_date, phone, address, id]
    );

    if (result.rows.length === 0) return errorResponse(res, 404, 'Pasien tidak ditemukan');
    
    return successResponse(res, 200, 'Pasien berhasil diperbarui', result.rows[0]);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// DELETE /patients/:id
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return errorResponse(res, 404, 'Pasien tidak ditemukan');
    
    return successResponse(res, 200, 'Pasien berhasil dihapus');
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};