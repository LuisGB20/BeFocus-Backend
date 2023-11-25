import { pool } from '../db.js';
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';

// Genera un código de verificación
const verificationCode = randomstring.generate(8);

// Configura tu transporte de correo electrónico (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'infodreamx2023@gmail.com',
    pass: 'Dreamx-2023-Info',
  },
});

export const forgetpassword = async (req, res) => {
  try {
    const { Correo } = req.body;
    const [resultado] = await pool.query('SELECT * FROM Usuario WHERE Correo = ?', [Correo]);

    if (resultado.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const mailOptions = {
      from: 'infodreamx2023@gmail.com',
      to: Correo,
      subject: 'Código de verificación',
      text: `Tu código de verificación es: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // Guarda el código en la base de datos
    const updateTokenQuery = 'UPDATE Usuario SET TokenBeFocus = ? WHERE Correo = ?';

    // Valores para la actualización
    const updateParams = [verificationCode, Correo];

    // Ejecuta la consulta para actualizar el campo en la base de datos
    pool.query(updateTokenQuery, updateParams, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el token del usuario' });
      }

      // Verifica si se actualizaron filas
      if (results.affectedRows === 0) {
        return res.status(400).json({ message: 'No se pudo actualizar el token del usuario' });
      }

      res.status(200).json({ message: 'Token del usuario actualizado' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
