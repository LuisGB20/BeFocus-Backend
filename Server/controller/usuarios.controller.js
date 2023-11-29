import { pool } from '../db.js'
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'; // Importa la biblioteca jsonwebtoken
import bcrypt from 'bcrypt';


export const getUsers = async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT * FROM usuario');
        res.json(resultado);
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

export const getUser = async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT * FROM usuario WHERE Correo = ?', [req.params.Correo]);
        if (resultado.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(resultado[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const getUserGoogle = async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT * FROM usuario WHERE TokenGoogle = ?', [req.params.tokenGoogle]);

        console.log(resultado.length)

        if (resultado.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        const Correo = resultado[0].Correo;
        // Genera un token JWT para el usuario
        const token = jwt.sign({ userId: resultado[0].Id_Usuario, username: Correo }, 'tu_secreto');
        console.log("Este es el token: " + token)
        resultado[0].TokenBeFocus = token
        console.log(resultado[0])
        return res.json(resultado[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createUser = async (req, res) => {
    try {

        // Validar los datos de entrada
        validationResult(req).throw();

        const { Nombre, Correo, Contrasena, Imagen, FK_Tipo_Usuario, TokenBeFocus, TokenGoogle } = req.body;

        let hashedPassword = null

        if (Contrasena) {
            // Hash de la contraseña antes de almacenarla en la base de datos
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(Contrasena, saltRounds);
            console.log(hashedPassword)
        }

        // Insertar el usuario en la base de datos con la contraseña hasheada
        const [resultado] = await pool.query('INSERT INTO Usuario(Nombre, Correo, Contrasena, Imagen, FK_Tipo_Usuario, TokenBeFocus, TokenGoogle) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Nombre, Correo, hashedPassword, Imagen, FK_Tipo_Usuario, TokenBeFocus, TokenGoogle]);

        // Genera un token JWT para el usuario
        const token = jwt.sign({ userId: resultado.insertId, username: Correo }, 'tu_secreto');

        res.json({
            Id_Usuario: resultado.insertId,
            Nombre,
            Correo,
            Imagen,
            FK_Tipo_Usuario,
            TokenBeFocus: token,
            TokenGoogle,
        });
    } catch (error) {
        return res.status(400).json({ message: 'Error en la validación de datos' });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { Nombre, Correo, Contrasena, Imagen, FK_Tipo_Usuario, TokenBeFocus } = req.body;
        let hashedPassword = null;

        if (Contrasena) {
            // Verifica si la contraseña proporcionada es diferente de la almacenada en la base de datos
            const [user] = await pool.query('SELECT Contrasena FROM Usuario WHERE Id_Usuario = ?', [req.params.id]);
            console.log(user)
            console.log(Contrasena)

            if (user.length > 0) {
                const storedPassword = user[0].Contrasena;
                console.log(storedPassword)
                console.log(Contrasena)
                console.log(storedPassword === Contrasena)

                // Compara las contraseñas
                const isPasswordMatch = await bcrypt.compare(Contrasena, storedPassword);

                if (!(storedPassword === Contrasena)) {
                    console.log(isPasswordMatch)
                    console.log("Contraseñas diferentes")
                    // Hash de la nueva contraseña antes de actualizarla en la base de datos
                    const saltRounds = 10;
                    hashedPassword = await bcrypt.hash(Contrasena, saltRounds);
                } else {
                    console.log("Contraseña igual");
                    // Si las contraseñas son iguales, no es necesario hacer el hash
                    hashedPassword = Contrasena;
                }
            }
        }

        const [resultado] = await pool.query(
            'UPDATE Usuario SET Nombre = ?, Correo = ?, Contrasena = ?, imagen = ?, FK_Tipo_Usuario = ?, TokenBeFocus = ? WHERE Id_Usuario = ?',
            [Nombre, Correo, hashedPassword, Imagen, FK_Tipo_Usuario, TokenBeFocus, req.params.id]
        );

        if (resultado.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else if (resultado.affectedRows === 0) {
            res.status(400).json({ message: 'No se pudo actualizar el usuario' });
        } else {
            res.status(200).json({ message: 'Usuario actualizado' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const [resultado] = await pool.query('DELETE FROM Usuario WHERE Id_Usuario = ?', [req.params.id]);

        if (resultado.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        if (resultado.affectedRows === 0) return res.status(400).json({ message: 'No se pudo eliminar el usuario' });
        if (resultado.affectedRows === 1) return res.status(200).json({ message: 'Usuario eliminado' });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}