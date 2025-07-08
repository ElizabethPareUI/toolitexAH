import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';

const PankyProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { userInfo } = useSelector((state) => state.userLogin);

  // Productos específicos de Panky Hilados
  const pankyProducts = useMemo(() => ({
    'panky-1': {
      id: 'panky-1',
      name: 'Hilo Acrílico Panky Premium',
      category: 'Acrílicos',
      stock: 150,
      priceProvider: 25.50,
      pricePublic: 38.90,
      supplier: 'Panky Premium Line',
      description: 'Hilo acrílico de alta calidad, ideal para tejidos duraderos',
      image: '/images/hilo-acrilico.jpg',
      brand: 'Panky'
    },
    'panky-2': {
      id: 'panky-2',
      name: 'Lana Merino Panky Soft',
      category: 'Lanas Premium',
      stock: 85,
      priceProvider: 62.30,
      pricePublic: 89.90,
      supplier: 'Panky Premium Line',
      description: 'Lana merino suave y cálida, perfecta para prendas de invierno',
      image: '/images/lana-merino.png',
      brand: 'Panky'
    },
    'panky-3': {
      id: 'panky-3',
      name: 'Algodón Panky Orgánico',
      category: 'Algodones',
      stock: 200,
      priceProvider: 18.75,
      pricePublic: 28.50,
      supplier: 'Panky Eco Line',
      description: 'Algodón 100% orgánico, certificado para productos eco-friendly',
      image: '/images/hilo-algodon.jpg',
      brand: 'Panky'
    },
    'panky-4': {
      id: 'panky-4',
      name: 'Lana Alpaca Panky Luxury',
      category: 'Lanas Premium',
      stock: 45,
      priceProvider: 95.60,
      pricePublic: 145.00,
      supplier: 'Panky Luxury Collection',
      description: 'Lana de alpaca de lujo, extremadamente suave y ligera',
      image: '/images/lana-alpaca.jpg',
      brand: 'Panky'
    },
    'panky-5': {
      id: 'panky-5',
      name: 'Mohair Panky Brillante',
      category: 'Mohair',
      stock: 60,
      priceProvider: 78.40,
      pricePublic: 119.90,
      supplier: 'Panky Specialty Fibers',
      description: 'Mohair con brillo natural, ideal para prendas elegantes',
      image: '/images/lana-mohair.jpg',
      brand: 'Panky'
    },
    'panky-6': {
      id: 'panky-6',
      name: 'Cashmere Panky Deluxe',
      category: 'Lanas Premium',
      stock: 30,
      priceProvider: 156.80,
      pricePublic: 239.90,
      supplier: 'Panky Luxury Collection',
      description: 'Cashmere de la más alta calidad, increíblemente suave',
      image: '/images/lana-cashmere.jpg',
      brand: 'Panky'
    }
  }), []);

  useEffect(() => {
    // Verificar si el usuario es admin de Panky
    if (!userInfo || !userInfo.isAdmin || userInfo.email !== 'adminpanky@test.com') {
      navigate('/login');
      return;
    }

    // Cargar datos del producto específico
    const product = pankyProducts[productId];
    if (product) {
      setName(product.name);
      setPrice(product.price || product.priceProvider || 0);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.stock);
      setDescription(product.description);
    } else {
      navigate('/panky-admin');
    }
  }, [productId, userInfo, navigate, pankyProducts]);

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Simular actualización exitosa
    setSuccessMessage('Producto actualizado exitosamente');
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      navigate('/panky-admin');
    }, 2000);
  };

  const product = pankyProducts[productId];

  if (!product) {
    return (
      <Container>
        <Alert variant="danger">
          Producto no encontrado
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <FormContainer>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Editar Producto - Panky Hilados</h1>
              <Button
                variant="secondary"
                onClick={() => navigate('/panky-admin')}
              >
                ← Volver al Dashboard
              </Button>
            </div>

            {successMessage && (
              <Alert variant="success">
                {successMessage}
              </Alert>
            )}

            <Form onSubmit={submitHandler}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="name" className="my-3">
                    <Form.Label>Nombre del Producto</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="brand" className="my-3">
                    <Form.Label>Marca</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese marca"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="category" className="my-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese categoría"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </Form.Group>

                  {/* Campo de proveedor eliminado */}
                </Col>

                <Col md={6}>
                  <Form.Group controlId="price" className="my-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="Precio del producto"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="countInStock" className="my-3">
                    <Form.Label>Stock Disponible</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Cantidad en stock"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </Form.Group>

                  {/* Campo de imagen eliminado */}
                </Col>
              </Row>

              <Form.Group controlId="description" className="my-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Descripción detallada del producto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex gap-2 mt-4">
                <Button type="submit" variant="primary" size="lg">
                  <i className="fas fa-save me-2"></i>
                  Guardar Cambios
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={() => navigate('/panky-admin')}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </FormContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default PankyProductEditScreen;
