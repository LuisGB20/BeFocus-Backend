import { pool } from '../db.js';

export const getTareas = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT Id_Tarea, Descripcion, Fecha, Materia FROM Tarea ORDER BY Fecha ASC');
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTarea = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Tarea WHERE Id_Tarea = ?', [req.params.id]);

        if (result.length === 0) return res.status(404).json({ message: 'Tarea no encontrada' });

        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createTarea = async (req, res) => {
    try {
        const { Descripcion, Fecha, Materia, FK_Usuario } = req.body;
        const [result] = await pool.query('INSERT INTO Tarea(Descripcion, Fecha, Materia, FK_Usuario) VALUES (?, ?, ?, ?)',
            [
                Descripcion,
                Fecha,
                Materia,
                FK_Usuario
            ]);
        res.json({
            id: result.insertId,
            Descripcion,
            Fecha,
            Materia,
            FK_Usuario
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateTarea = async (req, res) => {
    try {
        const { Descripcion, Fecha, Materia } = req.body;
        const [result] = await pool.query('UPDATE Tarea SET Descripcion = ?, Fecha = ?, Materia = ? WHERE Id_Tarea = ?', [Descripcion, Fecha, Materia, req.params.id]);

        if (result.length === 0) {
            res.status(404).json({ message: 'Tarea no encontrada' });
        } else if (result.affectedRows === 0) {
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
        const [result] = await pool.query('DELETE FROM Tarea WHERE Id_Tarea = ?', [req.params.id]);
        if (result.length === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
        if (result.affectedRows === 0) return res.status(400).json({ message: 'No se pudo eliminar la tarea' });
        if (result.affectedRows === 1) return res.status(200).json({ message: 'Tarea eliminada' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
