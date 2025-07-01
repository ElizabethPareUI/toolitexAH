const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Obtener el token del header
  const token = req.header('x-auth-token');

  // 2. Verificar si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, permiso no válido' });
  }

  // 3. Validar el token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Añadir el payload del usuario (que contiene el id) al objeto request
    req.user = decoded.user;
    next(); // Pasar al siguiente middleware o controlador
  } catch (err) {
    res.status(401).json({ msg: 'Token no es válido' });
  }
};
