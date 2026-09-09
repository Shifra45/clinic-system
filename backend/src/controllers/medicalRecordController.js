const pool = require('../config/db');
const { successResponse, errorResponse } = require('../middlewares/response');

// POST /medical-records (Simpan SOAP + Resep + Tindakan sekaligus)
exports.createMedicalRecord = async (req, res) => {
  try {
    const { 
      registration_id, 
      subjective, 
      blood_pressure, temperature, weight, height, 
      assessment, plan, 
      prescriptions, // Array of objects: [{ drug_name, dosage, quantity }]
      medical_actions // Array of strings: ["Injeksi", "Rontgen"]
    } = req.body;

    if (!registration_id) return errorResponse(res, 400, 'Registration ID wajib diisi');

    // 1. Insert SOAP ke tabel medical_records
    const mrResult = await pool.query(
      `INSERT INTO medical_records 
       (registration_id, subjective, blood_pressure, temperature, weight, height, assessment, plan) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [registration_id, subjective, blood_pressure, temperature, weight, height, assessment, plan]
    );
    const mr = mrResult.rows[0];

    // 2. Insert Resep Obat (jika ada)
    if (prescriptions && prescriptions.length > 0) {
      for (const ob of prescriptions) {
        await pool.query(
          `INSERT INTO prescriptions (medical_record_id, drug_name, dosage, quantity) 
           VALUES ($1, $2, $3, $4)`,
          [mr.id, ob.drug_name, ob.dosage, ob.quantity]
        );
      }
    }

    // 3. Insert Tindakan Medis (jika ada)
    if (medical_actions && medical_actions.length > 0) {
      for (const action of medical_actions) {
        await pool.query(
          `INSERT INTO medical_actions (medical_record_id, action_name) 
           VALUES ($1, $2)`,
          [mr.id, action]
        );
      }
    }

    // 4. Update status pendaftaran menjadi 'Selesai'
    await pool.query(`UPDATE registrations SET status = 'Selesai' WHERE id = $1`, [registration_id]);

    return successResponse(res, 201, 'Pemeriksaan berhasil disimpan', mr);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

// GET /medical-records/:patientId (Riwayat Pemeriksaan Pasien)
exports.getMedicalRecordByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    // Ambil semua rekam medis milik pasien
    const result = await pool.query(
      `SELECT mr.*, r.visit_date, r.poli, p.name as patient_name
       FROM medical_records mr
       JOIN registrations r ON mr.registration_id = r.id
       JOIN patients p ON r.patient_id = p.id
       WHERE r.patient_id = $1
       ORDER BY mr.created_at DESC`,
      [patientId]
    );

    return successResponse(res, 200, 'Success', result.rows);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};