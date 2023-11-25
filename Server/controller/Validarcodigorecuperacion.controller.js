// En tu controlador para verificar el código al ingresar
const checkCodeQuery = 'SELECT * FROM Usuario WHERE Correo = ? AND TokenBeFocus = ?';
const checkCodeParams = ['correo_del_usuario@example.com', codigo_ingresado_por_el_usuario];

// Ejecuta la consulta para verificar el código
db.query(checkCodeQuery, checkCodeParams, (error, results) => {
  if (error) {
    console.error(error);
  } else {
    if (results.length > 0) {
      // El código es válido
      console.log('Código válido. Permitir cambio de contraseña.');
      
    } else {
      // El código no es válido
      console.log('Código inválido o expirado.');
    }
  }
});
