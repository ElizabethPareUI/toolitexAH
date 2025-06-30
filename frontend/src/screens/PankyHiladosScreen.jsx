import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';

const PankyHiladosScreen = () => {
  const [providerInfo, setProviderInfo] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quotedProducts, setQuotedProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  
  // Obtener información del usuario logueado para verificar si es admin
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    // Verificar acceso de proveedor con validaciones adicionales de seguridad
    const accessInfo = localStorage.getItem('providerAccess');
    if (!accessInfo) {
      navigate('/proveedor');
      return;
    }

    try {
      const parsedInfo = JSON.parse(accessInfo);
      
      // Verificaciones de seguridad múltiples para Panky Hilados
      const isValidCode = parsedInfo.accessCode === '456PANKY';
      const hasValidStructure = parsedInfo.validCode === '456PANKY';
      const isRecentAccess = parsedInfo.timestamp && (Date.now() - parsedInfo.timestamp) < (24 * 60 * 60 * 1000); // 24 horas
      
      if (!isValidCode || !hasValidStructure || !isRecentAccess) {
        localStorage.removeItem('providerAccess');
        navigate('/proveedor');
        return;
      }
      
      setProviderInfo(parsedInfo);
    } catch (error) {
      // Si hay error al parsear, eliminar el acceso y redirigir
      localStorage.removeItem('providerAccess');
      navigate('/proveedor');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('providerAccess');
    navigate('/');
  };

  // Función para manejar la solicitud de cotización
  const handleQuoteRequest = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowQuoteModal(true);
  };

  // Función para confirmar la cotización
  const confirmQuote = () => {
    if (selectedProduct && quantity > 0) {
      const newQuote = {
        id: Date.now(),
        product: selectedProduct,
        quantity: quantity,
        totalPrice: (selectedProduct.priceProvider * quantity).toFixed(2),
        date: new Date().toISOString()
      };
      
      setQuotedProducts([...quotedProducts, newQuote]);
      setToastMessage(`Cotización agregada: ${quantity}x ${selectedProduct.name}`);
      setShowToast(true);
      setShowQuoteModal(false);
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Función para generar email de cotización
  const generateQuoteEmail = () => {
    if (quotedProducts.length === 0) {
      setToastMessage('No hay productos en la cotización');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const total = quotedProducts.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
    const productList = quotedProducts.map(item => 
      `- ${item.quantity}x ${item.product.name} - $${item.totalPrice}`
    ).join('\n');
    
    const emailBody = `Solicitud de Cotización - Panky Hilados
    
Proveedor: ${providerInfo.accessCode}
Fecha: ${new Date().toLocaleDateString('es-ES')}

Productos solicitados:
${productList}

Total estimado: $${total.toFixed(2)}

Por favor confirmar disponibilidad y condiciones de entrega.

Saludos cordiales.`;

    const subject = `Cotización Panky Hilados - ${new Date().toLocaleDateString('es-ES')}`;
    const mailtoLink = `mailto:proveedores@pankyhilados.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.open(mailtoLink);
  };

  // Productos específicos de Panky Hilados - Especialistas en Hilados Premium
  const pankyHiladosProducts = [
    {
      id: 1,
      name: 'Hilo Seda Premium Panky',
      category: 'Sedas Naturales',
      stock: 75,
      priceProvider: 1000,
      pricePublic: 1200,
      supplier: 'Panky Premium Collection',
      description: 'Seda 100% natural con brillo espectacular'
    },
    {
      id: 2,
      name: 'Lana Ovina Panky Select',
      category: 'Lanas Seleccionadas',
      stock: 120,
      priceProvider: 1000,
      pricePublic: 1300,
      supplier: 'Panky Selections',
      description: 'Lana ovina premium seleccionada a mano'
    },
    {
      id: 3,
      name: 'Hilo Metálico Panky Glam',
      category: 'Hilos Especiales',
      stock: 45,
      priceProvider: 1000,
      pricePublic: 1250,
      supplier: 'Panky Glamour Line',
      description: 'Hilos con fibras metálicas para proyectos únicos'
    },
    {
      id: 4,
      name: 'Chenille Panky Soft',
      category: 'Texturas Premium',
      stock: 80,
      priceProvider: 1000,
      pricePublic: 1100,
      supplier: 'Panky Soft Touch',
      description: 'Chenille ultra suave para mantas y cojines'
    },
    {
      id: 5,
      name: 'Lino Panky Natural',
      category: 'Fibras Ecológicas',
      stock: 95,
      priceProvider: 1000,
      pricePublic: 1150,
      supplier: 'Panky Eco Line',
      description: 'Lino 100% orgánico, perfecto para verano'
    },
    {
      id: 6,
      name: 'Kit Ganchillos Panky Pro',
      category: 'Herramientas Panky',
      stock: 30,
      priceProvider: 1000,
      pricePublic: 1250,
      supplier: 'Panky Tools Professional',
      description: 'Set profesional de ganchillos ergonómicos'
    },
    {
      id: 7,
      name: 'Hilo Acrílico Panky Colors',
      category: 'Acrílicos Premium',
      stock: 200,
      priceProvider: 1000,
      pricePublic: 1200,
      supplier: 'Panky Color Range',
      description: 'Acrílico premium en 50 colores vibrantes'
    },
    {
      id: 8,
      name: 'Lana Bouclé Panky Texture',
      category: 'Texturas Especiales',
      stock: 60,
      priceProvider: 1000,
      pricePublic: 1300,
      supplier: 'Panky Texture Studio',
      description: 'Bouclé con textura única para proyectos modernos'
    }
  ];

  if (!providerInfo) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Cargando información del proveedor...
        </Alert>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container>
        {/* Header de Panky Hilados */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-gradient" style={{ background: 'linear-gradient(135deg, #6a0d83 0%, #a855f7 100%)', color: 'white' }}>
                <Row className="align-items-center">
                  <Col>
                    <h1 className="mb-1" style={{ fontWeight: '700', fontSize: '2.8rem' }}>🎨 Panky Hilados</h1>
                    <p className="mb-0 opacity-90" style={{ fontSize: '1.2rem' }}>Catálogo de Productos - Tienda Proveedora</p>
                  </Col>
                  <Col xs="auto">
                    {quotedProducts.length > 0 && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="me-2"
                        onClick={generateQuoteEmail}
                      >
                        <i className="fas fa-envelope me-1"></i>
                        Enviar Cotización ({quotedProducts.length})
                      </Button>
                    )}
                    <Badge bg="light" text="dark" className="me-2">
                      Acceso: {providerInfo.accessCode}
                    </Badge>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={handleLogout}
                      style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                    >
                      <i className="fas fa-sign-out-alt me-1"></i>
                      Salir
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Información del proveedor */}
        <Row className="mb-4">
          <Col md={8}>
            <Alert variant="info" className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #6a0d83 0%, #a855f7 100%)', border: 'none' }}>
              <Alert.Heading style={{ color: 'white' }}>
                <i className="fas fa-palette me-2"></i>
                🎨 Catálogo de Panky Hilados - Productos Premium y Texturas Especiales
              </Alert.Heading>
              <p className="mb-0" style={{ color: 'white', opacity: '0.9' }}>
                Acceso autorizado desde: {new Date(providerInfo.accessTime).toLocaleString('es-ES')}
                <br />
                <small>Explore productos premium, vea detalles y solicite cotizaciones personalizadas</small>
              </p>
            </Alert>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #6a0d83 0%, #a855f7 100%)' }}>
              <Card.Body className="text-center">
                <h5 className="mb-1" style={{ color: 'white' }}>🎨 Productos Premium</h5>
                <h2 className="mb-0" style={{ color: 'white', fontSize: '2.5rem' }}>{pankyHiladosProducts.length}</h2>
                <small style={{ color: 'white', opacity: '0.9' }}>Hilados y texturas exclusivas</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Catálogo de productos para proveedores */}
        <Row>
          <Col>
            <h3 className="mb-4">
              <i className="fas fa-paint-brush me-2" style={{ color: '#6a0d83' }}></i>
              🎨 Catálogo Panky Hilados - Hilados Premium y Texturas Especiales
            </h3>
            <p className="text-muted mb-4">
              Productos premium especializados en hilados de alta calidad, sedas naturales y texturas únicas. Precios exclusivos para proveedores autorizados.
            </p>
          </Col>
        </Row>

        <Row>
          {pankyHiladosProducts.map((product) => (
            <Col lg={4} md={6} className="mb-4" key={product.id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-1">{product.name}</h5>
                    <Badge 
                      bg={product.stock > 100 ? 'success' : product.stock > 50 ? 'warning' : 'danger'}
                      className="ms-2"
                    >
                      Stock: {product.stock}
                    </Badge>
                  </div>
                  
                  <p className="text-muted small mb-2">
                    <i className="fas fa-tag me-1"></i>
                    {product.category}
                  </p>
                  
                  <p className="text-muted small mb-2">
                    <i className="fas fa-industry me-1"></i>
                    {product.supplier}
                  </p>

                  <p className="text-muted small mb-3" style={{ fontSize: '0.85rem' }}>
                    {product.description}
                  </p>

                  <div className="pricing-info">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Precio Proveedor:</span>
                      <span className="h5 text-success mb-0">
                        ${product.priceProvider.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted small">Precio Público:</span>
                      <span className="text-decoration-line-through text-muted">
                        ${product.pricePublic.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-center">
                      <small className="text-success">
                        <i className="fas fa-percentage me-1"></i>
                        Ahorro: {(((product.pricePublic - product.priceProvider) / product.pricePublic) * 100).toFixed(0)}%
                      </small>
                    </div>
                  </div>

                  <div className="mt-3 d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      disabled={product.stock === 0}
                      style={{ borderColor: '#6a0d83', color: '#6a0d83' }}
                      onClick={() => handleQuoteRequest(product)}
                    >
                      {product.stock > 0 ? (
                        <>
                          <i className="fas fa-cart-plus me-1"></i>
                          Solicitar Cotización
                        </>
                      ) : (
                        'Sin Stock'
                      )}
                    </Button>
                    
                    {/* Botón de editar solo para admins */}
                    {userInfo && userInfo.isAdmin && (
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => navigate(`/panky/productos/${product.id}/editar`)}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Editar Producto
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal de Cotización */}
        <Modal show={showQuoteModal} onHide={() => setShowQuoteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Solicitar Cotización</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedProduct?.name}</h5>
            <p>
              <strong>Precio Proveedor:</strong> ${selectedProduct?.priceProvider.toFixed(2)}
            </p>
            <Form>
              <Form.Group controlId="formQuantity">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                  min={1}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuoteModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={confirmQuote}>
              Confirmar Cotización
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast de confirmación */}
        <ToastContainer position="top-end" className="p-3">
          <Toast 
            bg="success" 
            onClose={() => setShowToast(false)} 
            show={showToast} 
            delay={3000} 
            autohide
          >
            <Toast.Body className="text-white">
              <i className="fas fa-check-circle me-2"></i>
              {toastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Footer */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #6a0d83 0%, #a855f7 100%)' }}>
              <Card.Body className="text-center">
                <h5 style={{ color: 'white', marginBottom: '15px' }}>🎨 Panky Hilados - Especialistas en hilados premium</h5>
                <p style={{ color: 'white', margin: '0', opacity: '0.9' }}>
                  <i className="fas fa-phone me-2"></i>
                  Contacto: +54 11 7890-1234 | 
                  <i className="fas fa-envelope ms-2 me-2"></i>
                  proveedores@pankyhilados.com
                  <br />
                  <small className="mt-2 d-block">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Especialistas en hilados premium, sedas naturales, texturas especiales y herramientas profesionales
                  </small>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal para Solicitar Cotización */}
        <Modal show={showQuoteModal} onHide={() => setShowQuoteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Solicitar Cotización - Panky Hilados</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedProduct?.name}</h5>
            <p>
              <strong>Precio Proveedor:</strong> ${selectedProduct?.priceProvider.toFixed(2)}<br />
              <strong>Stock Disponible:</strong> {selectedProduct?.stock}<br />
              <strong>Descripción:</strong> {selectedProduct?.description}
            </p>
            <Form>
              <Form.Group controlId="formQuantity">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                  min={1}
                  max={selectedProduct?.stock}
                />
              </Form.Group>
              <p className="mt-2">
                <strong>Total estimado:</strong> ${selectedProduct ? (selectedProduct.priceProvider * quantity).toFixed(2) : '0.00'}
              </p>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuoteModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={confirmQuote} style={{ backgroundColor: '#6a0d83', borderColor: '#6a0d83' }}>
              Confirmar Cotización
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast de confirmación */}
        <ToastContainer position="top-end" className="p-3">
          <Toast 
            bg="success" 
            onClose={() => setShowToast(false)} 
            show={showToast} 
            delay={3000} 
            autohide
          >
            <Toast.Body className="text-white">
              <i className="fas fa-check-circle me-2"></i>
              {toastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default PankyHiladosScreen;
