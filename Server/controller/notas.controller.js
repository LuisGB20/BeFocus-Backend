import { pool } from "../db.js";

export const getNotas = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const [resultado] = await pool.query('SELECT Id_Nota, Titulo, Contenido, Fecha_Creacion FROM Nota WHERE FK_Usuario = ? ORDER BY Fecha_Creacion ASC', [id_usuario]);
        res.json(resultado);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getNota = async (req, res) => {
    try {
        const [resultado] = await pool.query('SELECT * FROM Nota WHERE Id_Nota = ?', [req.params.id])

        if (resultado.length === 0) return res.status(404).json({ message: 'Nota no encontrada' });

        res.json(resultado[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

};

export const createNota = async (req, res) => {
    try {
        const { Titulo, Contenido, FK_Usuario, Fecha_Creacion } = req.body;
        const [resultado] = await pool.query('INSERT INTO Nota(Titulo, Contenido, FK_Usuario, Fecha_Creacion) VALUES (?, ?, ?, ?)',
            [
                Titulo,
                Contenido,
                FK_Usuario,
                Fecha_Creacion
            ])
        res.json({
            id: resultado.insertId,
            Titulo,
            Contenido,
            FK_Usuario,
            Fecha_Creacion
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const updateNota = async (req, res) => {
    try {
        const { Titulo, Contenido } = req.body;
        const [resultado] = await pool.query('UPDATE Nota SET Titulo = ?, Contenido = ? WHERE Id_Nota = ?', [Titulo, Contenido, req.params.id]);

        if (resultado.length === 0) {
            res.status(404).json({ message: 'Nota no encontrada' });
        } else if (resultado.affectedRows === 0) {
            res.status(400).json({ message: 'No se pudo actualizar la nota' });
        } else {
            res.status(200).json({ message: 'Nota actualizada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const deleteNota = async (req, res) => {
    try {
        const [resultado] = await pool.query('DELETE FROM Nota WHERE Id_Nota = ?', [req.params.id])

        if (resultado.length === 0) return res.status(404).json({ message: 'Nota no encontrada' });
        if (resultado.affectedRows === 0) return res.status(400).json({ message: 'No se pudo eliminar la nota' });
        if (resultado.affectedRows === 1) return res.status(200).json({ message: 'Nota eliminada' });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}