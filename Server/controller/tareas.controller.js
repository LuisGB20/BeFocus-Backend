import { pool } from '../db.js';

export const getTareas = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const [resultado] = await pool.query('SELECT * FROM Tarea WHERE FK_Usuario = ? ORDER BY Fecha ASC', [id_usuario]);
        res.json(resultado);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTarea = async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT * FROM Tarea WHERE Id_Tarea = ?', [req.params.id]);
        if (resultado.length === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json(resultado[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createTarea = async (req, res) => {
    try {
        const { Descripcion, Fecha, Materia, Estatus, FK_Usuario } = req.body;
        const [resultado] = await pool.query('INSERT INTO Tarea(Descripcion, Fecha, Materia, Estatus, FK_Usuario) VALUES (?, ?, ?, ?, ?)',
            [
                Descripcion,
                Fecha,
                Materia,
                Estatus,
                FK_Usuario
            ]);
        res.json({
            id: resultado.insertId,
            Descripcion,
            Fecha,
            Materia,
            Estatus,
            FK_Usuario
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateTarea = async (req, res) => {
    try {
        const { Descripcion, Fecha, Materia, Estatus } = req.body;
        const [resultado] = await pool.query('UPDATE Tarea SET Descripcion = ?, Fecha = ?, Materia = ?, Estatus = ? WHERE Id_Tarea = ?', [Descripcion, Fecha, Materia, Estatus, req.params.id]);
        if (resultado.length === 0) {
            res.status(404).json({ message: 'Tarea no encontrada' });
        } else if (resultado.affectedRows === 0) {
            res.status(400).json({ message: 'No se pudo actualizar la tarea' });
        } else {
            res.status(200).json({ message: 'Tarea actualizada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTarea = async (req, res) => {
    try {
        const [resultado] = await pool.query('DELETE FROM Tarea WHERE Id_Tarea = ?', [req.params.id]);
        if (resultado.length === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
        if (resultado.affectedRows === 0) return res.status(400).json({ message: 'No se pudo eliminar la tarea' });
        if (resultado.affectedRows === 1) return res.status(200).json({ message: 'Tarea eliminada' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
