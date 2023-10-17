import {pool} from '../db.js'


export const getUsers = async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT * FROM usuario');
        res.json(resultado);
    } catch (error) {
        return res.status(500).json({message: error.message});

    }
}

export const getUser = async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT * FROM usuario WHERE Correo = ?', [req.params.id]);
        if (resultado.length === 0) return res.status(404).json({message: 'Usuario no encontrado'});
        res.json(resultado[0]);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

export const createUser = async (req, res) => {
    try {
        const {Nombre, Correo, Contrasena, Imagen, FK_Tipo_Usuario, TokenUsuario, TokenGoogle, TokenFacebook} = req.body;
        const [resultado] = await pool.query('INSERT INTO Usuario(Nombre, Correo, Contrasena, imagen, FK_Tipo_Usuario, TokenUsuario, TokenGoogle, TokenFacebook) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                Nombre,
                Correo,
                Contrasena,
                Imagen,
                FK_Tipo_Usuario,
                TokenUsuario,
                TokenGoogle,
                TokenFacebook
            ]);
        res.json({
            Id_Usuario: resultado.insertId,
            Nombre,
            Correo,
            Contrasena,
            Imagen,
            FK_Tipo_Usuario,
            TokenUsuario,
            TokenGoogle,
            TokenFacebook
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

export const updateUser = async (req, res) => {
    try {
        const {Nombre, Correo, Contrasena, Imagen, FK_Tipo_Usuario} = req.body;
        const [resultado] = await pool.query('UPDATE Usuario SET Nombre = ?, Correo = ?, Contrasena = ?, imagen = ?, FK_Tipo_Usuario = ?, TokenUsuario = ?, TokenGoogle = ?, TokenFacebook = ? WHERE Id_Usuario = ?', [Nombre, Correo, Contrasena, Imagen, FK_Tipo_Usuario, TokenUsuario, TokenGoogle, TokenFacebook, req.params.id]);

        if (resultado.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else if (resultado.affectedRows === 0) {
            res.status(400).json({ message: 'No se pudo actualizar el usuario' });
        } else {
            res.status(200).json({ message: 'Usuario actualizado' });
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

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