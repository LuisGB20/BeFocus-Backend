import { pool } from '../db.js';
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import bcrypt from 'bcrypt';

// Genera un código de verificación
const generarCodigoVerificacion = () => {
  return randomstring.generate(6);
};

const enviarCorreo = async (correo, codigo) => {
  console.log("Enviando correo")
  // Configurar el transporter de correo electrónico
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'infodreamx2023@gmail.com',
      pass: 'acyoatlvlxgwfoxx',
    },
  });

  // Configurar el mensaje de correo electrónico
  const mensaje = {
    from: 'infodreamx2023@gmail.com',
    to: correo,
    subject: 'Código de verificación',
    html: `
    <p style="font-size: 16px; color: #333; line-height: 1.6;">¡Hola!</p>
    <p style="font-size: 18px; color: #007BFF; line-height: 1.6;">Gracias por elegir BeFocus.</p>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">Tu código de verificación es:</p>
    <h2 style="font-size: 24px; color: #007BFF; margin-bottom: 20px;">${codigo}</h2>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">Este código expirará en 10 minutos. Úsalo pronto para completar tu proceso de verificación.</p>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">¡Gracias por confiar en nosotros!</p>
    <p style="font-size: 16px; color: #333; line-height: 1.6;">El equipo de BeFocus</p>    
    `,
  };

  try {
    // Enviar el correo
    const info = await transporter.sendMail(mensaje);
    console.log(info);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    // Puedes manejar el error según tus necesidades
  }
};

const limpiarCodigosVerificacion = async () => {
  // Eliminar códigos expirados después de enviar el correo
  const deleteExpiredCodesQuery = 'UPDATE Usuario SET FechaCreacionCodigo = NULL WHERE FechaCreacionCodigo < NOW() - INTERVAL 10 MINUTE;';
  
  // Utiliza la versión basada en promesas de la función query
  await pool.query(deleteExpiredCodesQuery);

  console.log('Códigos expirados eliminados exitosamente');
}

export const forgetpassword = async (req, res) => {
  try {
    const { Correo } = req.body;

    console.log(Correo);

    // Check if the user exists
    const userExistsQuery = 'SELECT * FROM Usuario WHERE Correo = ?';
    const userExistsParams = [Correo];

    const userExistsResult = await pool.query(userExistsQuery, userExistsParams);

    if (userExistsResult[0].length === 0) {
      // User does not exist
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log(userExistsResult[0])

    // Generate verification code
    const codigoVerificacion = generarCodigoVerificacion();
    console.log(codigoVerificacion);

    // Update the token and timestamp in the database
    const updateTokenQuery = 'UPDATE Usuario SET TokenBeFocus = ?, FechaCreacionCodigo = CURRENT_TIMESTAMP WHERE Correo = ?';
    const updateParams = [codigoVerificacion, Correo];

    // Execute the query to update the database
    const updateResult = await pool.query(updateTokenQuery, updateParams);

    // Check if rows were affected
    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: 'No se pudo actualizar el token del usuario' });
    }

    // Send the email to the user
    await enviarCorreo(Correo, codigoVerificacion);

    // Clean expired verification codes after sending the email
    await limpiarCodigosVerificacion();

    res.status(200).json({ message: 'Token del usuario actualizado y código de verificación enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const verificarCodigo = async (req, res) => {
  try {
    const { Correo, CodigoVerificacion } = req.body;

    console.log(Correo)
    console.log(CodigoVerificacion)

    // Verificar si el usuario existe y el código de verificación es válido
    const userVerificationQuery = 'SELECT * FROM Usuario WHERE Correo = ? AND TokenBeFocus = ? AND FechaCreacionCodigo >= NOW() - INTERVAL 10 MINUTE;';
    const userVerificationParams = [Correo, CodigoVerificacion];

    const userVerificationResult = await pool.query(userVerificationQuery, userVerificationParams);

    console.log(userVerificationResult[0])

    if (userVerificationResult[0].length === 0) {
      // No se encontró el usuario o el código de verificación es incorrecto o ha expirado
      return res.status(400).json({ message: 'Código de verificación inválido o expirado' });
    }

    // Realizar acciones adicionales si la verificación es exitosa

    res.status(200).json({ message: 'Código de verificación válido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const actualizarContrasena = async (req, res) => {
  try {
    const { Contrasena, Correo } = req.body;

    console.log("Actualizar contra")
    console.log(Contrasena)
    console.log(Correo)

    // Hash de la nueva contraseña antes de actualizarla en la base de datos
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Contrasena, saltRounds);

    // Verificar si el usuario existe y actualizar la contraseña
    const updatePasswordQuery = 'UPDATE Usuario SET Contrasena = ? WHERE Correo = ?;';
    const updatePasswordParams = [hashedPassword, Correo];

    const updatePasswordResult = await pool.query(updatePasswordQuery, updatePasswordParams);

    if (updatePasswordResult[0].affectedRows === 0) {
      
      // Algo ha salido mal, intentalo mas tarde
      return res.status(404).json({ message: 'Algo ha salido mal, intentalo mas tarde' });
    }
    console.log(updatePasswordResult[0])

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};