import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createPankyProduct } from '../actions/productActions';
import { PANKY_PRODUCT_CREATE_RESET } from '../constants/productConstants';

const PankyProductCreateModal = ({ show, onHide, onProductCreated }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const { loading, error, success } = useSelector((state) => state.pankyProductCreate);

  // Categorías disponibles
  const categories = [
    'Lanas',
    'Hilos',
    'Agujas',
    'Accesorios',
    'Herramientas',
    'Otros'
  ];

  useEffect(() => {
    if (success) {
      // Resetear formulario
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        countInStock: '',
        image: null,
      });
      setImagePreview(null);
      setFormErrors({});
      
      // Llamar callback para actualizar la lista
      if (onProductCreated) {
        onProductCreated();
      }
      
      // Resetear estado de Redux
      dispatch({ type: PANKY_PRODUCT_CREATE_RESET });
      
      // Cerrar modal
      onHide();
    }
  }, [success, onProductCreated, onHide, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo si existe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)'
        }));
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          image: 'La imagen no puede superar 5MB'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error si existe
      if (formErrors.image) {
        setFormErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'La descripción es requerida';
    }
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 1000) {
      errors.price = 'El precio debe ser un número mayor o igual a $1,000';
    }
    
    if (!formData.category) {
      errors.category = 'La categoría es requerida';
    }
    
    if (formData.countInStock && (isNaN(formData.countInStock) || Number(formData.countInStock) < 0)) {
      errors.countInStock = 'El stock debe ser un número positivo';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    dispatch(createPankyProduct(formData));
  };

  const handleClose = () => {
    // Resetear formulario al cerrar
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      countInStock: '',
      image: null,
    });
    setImagePreview(null);
    setFormErrors({});
    dispatch({ type: PANKY_PRODUCT_CREATE_RESET });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto Panky</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Producto *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.name}
                  placeholder="Ej: Lana Merino Premium"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.category}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              isInvalid={!!formErrors.description}
              placeholder="Describe las características del producto..."
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.description}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Precio (COP) *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.price}
                  placeholder="Mínimo $1,000"
                  min="1000"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.price}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Precio mínimo: $1,000 COP
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Disponible</Form.Label>
                <Form.Control
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.countInStock}
                  placeholder="0"
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.countInStock}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Imagen del Producto</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              isInvalid={!!formErrors.image}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.image}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Formatos permitidos: JPEG, PNG, GIF, WEBP. Tamaño máximo: 5MB
            </Form.Text>
            
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Producto'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PankyProductCreateModal;
