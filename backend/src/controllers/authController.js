const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { successResponse, errorResponse } = require('../middlewares/response');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return errorResponse(res, 400, 'Email dan password wajib diisi');

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return errorResponse(res, 404, 'Email tidak terdaftar');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, 401, 'Password salah');

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return successResponse(res, 200, 'Login berhasil', {
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', error.message);
  }
};

exports.logout = async (req, res) => {
  // Dalam JWT stateless, client cukup menghapus token di sisi frontend.
  // Namun, jika ingin blacklist token (opsional), kamu bisa menyimpannya di DB/Redis.
  return successResponse(res, 200, 'Logout berhasil');
};