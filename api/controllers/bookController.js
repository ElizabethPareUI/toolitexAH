const Book = require('../models/Book');

// @desc    Crear un nuevo libro
exports.createBook = (req, res) => {
  res.send('Lógica para crear un libro');
};

// @desc    Obtener todos los libros
exports.getAllBooks = (req, res) => {
  res.send('Lógica para obtener todos los libros');
};

// @desc    Obtener un libro por ID
exports.getBookById = (req, res) => {
  res.send(`Lógica para obtener el libro con id ${req.params.id}`);
};

// @desc    Actualizar un libro
exports.updateBook = (req, res) => {
  res.send(`Lógica para actualizar el libro con id ${req.params.id}`);
};

// @desc    Eliminar un libro
exports.deleteBook = (req, res) => {
  res.send(`Lógica para eliminar el libro con id ${req.params.id}`);
};
