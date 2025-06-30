import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { listPankyProducts } from '../actions/productActions';
import PankyProductFilters from '../components/PankyProductFilters';
import Loader from '../components/Loader';

const PankyHiladosScreen = () => {
  const [providerInfo, setProviderInfo] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quotedProducts, setQuotedProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest'
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener información del usuario logueado para verificar si es admin
  const { userInfo } = useSelector((state) => state.userLogin);
  
  // Obtener productos de Panky desde la API
  const { loading, error, products, pagination, filters: availableFilters } = useSelector((state) => state.pankyProducts);

  // Función para cargar productos con filtros
  const loadProductsWithFilters = (currentFilters = filters) => {
    const filterParams = {};
    
    if (currentFilters.search) filterParams.search = currentFilters.search;
    if (currentFilters.category !== 'all') filterParams.category = currentFilters.category;
    if (currentFilters.minPrice) filterParams.minPrice = currentFilters.minPrice;
    if (currentFilters.maxPrice) filterParams.maxPrice = currentFilters.maxPrice;
    if (currentFilters.inStock) filterParams.inStock = 'true';
    
    dispatch(listPankyProducts(filterParams));
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadProductsWithFilters(newFilters);
  };

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
      
      // Cargar productos de Panky desde la API
      dispatch(listPankyProducts());
    } catch (error) {
      // Si hay error al parsear, eliminar el acceso y redirigir
      localStorage.removeItem('providerAccess');
      navigate('/proveedor');
    }
  }, [navigate, dispatch]);

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
                <h2 className="mb-0" style={{ color: 'white', fontSize: '2.5rem' }}>{products ? products.length : '0'}</h2>
                <small style={{ color: 'white', opacity: '0.9' }}>Hilados y texturas exclusivas</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtros de productos */}
        <Row className="mb-4">
          <Col>
            <PankyProductFilters
              onFilterChange={handleFilterChange}
              filters={filters}
              categories={availableFilters?.categories || []}
              priceRange={availableFilters?.priceRange || { min: 0, max: 1000 }}
              loading={loading}
            />
          </Col>
        </Row>

        {/* Catálogo de productos para proveedores */}
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="mb-1">
                  <i className="fas fa-paint-brush me-2" style={{ color: '#6a0d83' }}></i>
                  🎨 Catálogo Panky Hilados - Hilados Premium y Texturas Especiales
                </h3>
                <p className="text-muted mb-0">
                  Productos premium especializados en hilados de alta calidad, sedas naturales y texturas únicas. 
                  {pagination && pagination.total && (
                    <span className="ms-2">
                      <Badge bg="secondary">{pagination.total} productos encontrados</Badge>
                    </span>
                  )}
                </p>
              </div>
              
              {/* Filtros activos */}
              {(filters.category !== 'all' || filters.search || filters.minPrice || filters.maxPrice || filters.inStock) && (
                <div className="d-flex flex-wrap gap-1">
                  {filters.category !== 'all' && (
                    <Badge bg="primary" className="me-1">
                      Categoría: {filters.category}
                    </Badge>
                  )}
                  {filters.search && (
                    <Badge bg="info" className="me-1">
                      Búsqueda: {filters.search}
                    </Badge>
                  )}
                  {filters.inStock && (
                    <Badge bg="success" className="me-1">
                      En stock
                    </Badge>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge bg="warning" className="me-1">
                      Precio: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          {loading && (
            <Col className="text-center">
              <Loader />
            </Col>
          )}
          
          {error && (
            <Col>
              <Alert variant="danger">
                Error al cargar productos: {error}
              </Alert>
            </Col>
          )}
          
          {products && products.length > 0 ? (
            products.map((product) => (
            <Col lg={4} md={6} className="mb-4" key={product._id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-1">{product.name}</h5>
                    <Badge 
                      bg={product.countInStock > 100 ? 'success' : product.countInStock > 50 ? 'warning' : 'danger'}
                      className="ms-2"
                    >
                      Stock: {product.countInStock}
                    </Badge>
                  </div>
                  
                  <p className="text-muted small mb-2">
                    <i className="fas fa-tag me-1"></i>
                    {product.category}
                  </p>

                  <p className="text-muted small mb-3" style={{ fontSize: '0.85rem' }}>
                    {product.description}
                  </p>

                  <div className="pricing-info">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Precio:</span>
                      <span className="h5 text-success mb-0">
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      disabled={product.countInStock === 0}
                      style={{ borderColor: '#6a0d83', color: '#6a0d83' }}
                      onClick={() => handleQuoteRequest(product)}
                    >
                      {product.countInStock > 0 ? (
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
                        onClick={() => navigate(`/panky/productos/${product._id}/editar`)}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Editar Producto
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
          ) : (
            !loading && (
              <Col className="text-center">
                <Alert variant="info">
                  <h5>No hay productos disponibles</h5>
                  <p>Aún no hay productos en el catálogo de Panky Hilados.</p>
                </Alert>
              </Col>
            )
          )}
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
