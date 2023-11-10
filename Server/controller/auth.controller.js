import {pool} from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Función para verificar la contraseña
async function checkPassword(contraseñaNormal, hashedPassword) {
  try {
      const passwordMatch = await bcrypt.compare(contraseñaNormal, hashedPassword);
      return passwordMatch;
  } catch (error) {
      throw error;
  }
}

export const inicioSesion = async(req, res) => {
  const {Correo, Contrasena} = req.body;
  const contraseñaPlana = Contrasena;
  try {
    const resultado = await pool.query('SELECT * FROM usuario WHERE Correo = ?', [Correo]);
    if (resultado[0].length > 0) {
      const hashedPassword = resultado[0][0].Contrasena;
      console.log(hashedPassword);
      console.log(contraseñaPlana);
      const match = await checkPassword(contraseñaPlana, hashedPassword);

      if (match) {
        // Generar un token JWT
        const token = jwt.sign({ userId: resultado[0].Id_Usuario, username: Correo }, 'tu_secreto');
        res.status(200).json(token);
      } else {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    } else if(resultado[0].length === 0){
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
