import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';

const MiaHiladosScreen = () => {
  const [providerInfo, setProviderInfo] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quotedProducts, setQuotedProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar acceso de proveedor con validaciones adicionales de seguridad
    const accessInfo = localStorage.getItem('providerAccess');
    if (!accessInfo) {
      navigate('/proveedor');
      return;
    }

    try {
      const parsedInfo = JSON.parse(accessInfo);
      
      // Verificaciones de seguridad múltiples
      const isValidCode = parsedInfo.accessCode === '123MIA';
      const hasValidStructure = parsedInfo.validCode === '123MIA';
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
    
    const emailBody = `Solicitud de Cotización - Mia Hilados
    
Proveedor: ${providerInfo.accessCode}
Fecha: ${new Date().toLocaleDateString('es-ES')}

Productos solicitados:
${productList}

Total estimado: $${total.toFixed(2)}

Por favor confirmar disponibilidad y condiciones de entrega.

Saludos cordiales.`;

    const subject = `Cotización Mia Hilados - ${new Date().toLocaleDateString('es-ES')}`;
    const mailtoLink = `mailto:proveedores@miahilados.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.open(mailtoLink);
  };

  // Productos específicos de Mia Hilados - Especialistas en Lanas y Tejidos
  const miaHiladosProducts = [
    {
      id: 1,
      name: 'Lana Merino Premium Mia Hilados',
      category: 'Lanas Premium',
      stock: 150,
      priceProvider: 45.99,
      pricePublic: 65.99,
      supplier: 'Mia Hilados Collection',
      description: 'Lana merino 100% natural, ideal para tejidos delicados'
    },
    {
      id: 2,
      name: 'Hilo de Alpaca Andina Mia',
      category: 'Fibras Naturales',
      stock: 89,
      priceProvider: 78.50,
      pricePublic: 110.00,
      supplier: 'Mia Hilados Premium',
      description: 'Fibra de alpaca baby, suavidad excepcional'
    },
    {
      id: 3,
      name: 'Cashmere Mia Luxury',
      category: 'Lanas de Lujo',
      stock: 25,
      priceProvider: 125.00,
      pricePublic: 180.00,
      supplier: 'Mia Hilados Luxury',
      description: 'Cashmere importado, la máxima expresión del lujo'
    },
    {
      id: 4,
      name: 'Bambú Eco Mia Verde',
      category: 'Ecológico Mia',
      stock: 200,
      priceProvider: 32.75,
      pricePublic: 48.99,
      supplier: 'Mia Hilados Eco',
      description: 'Fibra de bambú 100% sostenible, antibacterial'
    },
    {
      id: 5,
      name: 'Mohair Sedoso Mia Texture',
      category: 'Texturas Especiales',
      stock: 67,
      priceProvider: 89.99,
      pricePublic: 125.50,
      supplier: 'Mia Hilados Texture',
      description: 'Mohair sedoso con brillo natural, ideal para chales'
    },
    {
      id: 6,
      name: 'Kit Agujas Bambú Mia Pro',
      category: 'Accesorios Mia',
      stock: 45,
      priceProvider: 156.00,
      pricePublic: 220.00,
      supplier: 'Mia Hilados Tools',
      description: 'Set completo agujas circulares y rectas, bambú premium'
    },
    {
      id: 7,
      name: 'Lana Oveja Patagónica Mia',
      category: 'Lanas Regionales',
      stock: 120,
      priceProvider: 38.50,
      pricePublic: 55.00,
      supplier: 'Mia Hilados Regional',
      description: 'Lana 100% patagónica, textura rústica natural'
    },
    {
      id: 8,
      name: 'Hilo Algodón Mia Soft',
      category: 'Algodones Premium',
      stock: 180,
      priceProvider: 28.99,
      pricePublic: 42.50,
      supplier: 'Mia Hilados Cotton',
      description: 'Algodón mercerizado, ideal para ropa de bebé'
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
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container>
        {/* Header de Mia Hilados */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-gradient" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)', color: 'white' }}>
                <Row className="align-items-center">
                  <Col>
                    <h1 className="mb-1" style={{ fontWeight: '700', fontSize: '2.8rem' }}>🧶 Mia Hilados</h1>
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
            <Alert variant="success" className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none' }}>
              <Alert.Heading style={{ color: 'white' }}>
                <i className="fas fa-store me-2"></i>
                🧶 Catálogo de Mia Hilados - Productos Especializados en Lanas y Tejidos
              </Alert.Heading>
              <p className="mb-0" style={{ color: 'white', opacity: '0.9' }}>
                Acceso autorizado desde: {new Date(providerInfo.accessTime).toLocaleString('es-ES')}
                <br />
                <small>Explore nuestros productos, vea detalles y solicite cotizaciones personalizadas</small>
              </p>
            </Alert>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)' }}>
              <Card.Body className="text-center">
                <h5 className="mb-1" style={{ color: 'white' }}>🧶 Productos de Lanas y Tejidos</h5>
                <h2 className="mb-0" style={{ color: 'white', fontSize: '2.5rem' }}>{miaHiladosProducts.length}</h2>
                <small style={{ color: 'white', opacity: '0.9' }}>Especializados en tejido</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Catálogo de productos para proveedores */}
        <Row>
          <Col>
            <h3 className="mb-4">
              <i className="fas fa-cut me-2" style={{ color: '#8B4513' }}></i>
              🧶 Catálogo Mia Hilados - Lanas y Accesorios para Tejido
            </h3>
            <p className="text-muted mb-4">
              Productos especializados para tejido, bordado y manualidades. Precios exclusivos para proveedores autorizados.
            </p>
          </Col>
        </Row>

        <Row>
          {miaHiladosProducts.map((product) => (
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
                  
                  <p className="text-muted small mb-3">
                    <i className="fas fa-truck me-1"></i>
                    Proveedor: {product.supplier}
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

                  <div className="mt-3 d-grid">
                    <Button 
                      variant="primary" 
                      size="sm"
                      disabled={product.stock === 0}
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
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Footer */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)' }}>
              <Card.Body className="text-center">
                <h5 style={{ color: 'white', marginBottom: '15px' }}>🧶 Mia Hilados - Tu especialista en lanas y tejidos</h5>
                <p style={{ color: 'white', margin: '0', opacity: '0.9' }}>
                  <i className="fas fa-phone me-2"></i>
                  Contacto: +54 11 4567-8900 | 
                  <i className="fas fa-envelope ms-2 me-2"></i>
                  proveedores@miahilados.com
                  <br />
                  <small className="mt-2 d-block">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Especialistas en lanas premium, fibras naturales y accesorios para tejido
                  </small>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal para Solicitar Cotización */}
        <Modal show={showQuoteModal} onHide={() => setShowQuoteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Solicitar Cotización</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedProduct?.name}</h5>
            <p>
              <strong>Precio Proveedor:</strong> ${selectedProduct?.priceProvider.toFixed(2)}<br />
              <strong>Stock Disponible:</strong> {selectedProduct?.stock}
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
      </Container>
    </div>
  );
};

export default MiaHiladosScreen;
