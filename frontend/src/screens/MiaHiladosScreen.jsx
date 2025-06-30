import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { listMiaProducts } from '../actions/productActions';
import ProductFilters from '../components/ProductFilters';
import PaginationComponent from '../components/PaginationComponent';
import Loader from '../components/Loader';

const MiaHiladosScreen = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener productos de Mia desde la API
  const { loading, error, products, pagination, filters: availableFilters } = useSelector((state) => state.miaProducts);

  // Función para cargar productos con filtros
  const loadProductsWithFilters = (currentFilters = filters, page = currentPage) => {
    const filterParams = { ...currentFilters, page, limit: 6 };
    
    if (currentFilters.search) filterParams.search = currentFilters.search;
    if (currentFilters.category !== 'all') filterParams.category = currentFilters.category;
    if (currentFilters.minPrice) filterParams.minPrice = currentFilters.minPrice;
    if (currentFilters.maxPrice) filterParams.maxPrice = currentFilters.maxPrice;
    if (currentFilters.inStock) filterParams.inStock = 'true';
    
    dispatch(listMiaProducts(filterParams));
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset a primera página cuando cambian filtros
    loadProductsWithFilters(newFilters, 1);
  };

  // Función para manejar cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadProductsWithFilters(filters, page);
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
      
      // Cargar productos de Mia desde la API
      dispatch(listMiaProducts());
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
        totalPrice: (selectedProduct.price * quantity).toFixed(2),
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
                <h2 className="mb-0" style={{ color: 'white', fontSize: '2.5rem' }}>
                  {pagination ? pagination.total : (products ? products.length : 0)}
                </h2>
                <small style={{ color: 'white', opacity: '0.9' }}>Especializados en tejido</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtros de productos */}
        <Row className="mb-4">
          <Col>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              availableCategories={availableFilters?.categories || []}
              showBrandFilter={false}
              placeholders={{
                search: 'Buscar en productos Mia Hilados...',
                category: 'Todas las categorías Mia'
              }}
            />
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

        {loading ? (
          <Loader />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <Row>
              {products && products.map((product) => (
                <Col lg={4} md={6} className="mb-4" key={product._id}>
                  <Card className="h-100 border-0 shadow-sm product-card">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={e => { e.target.src = '/images/placeholder.png'; }}
                    />
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
                      
                      <p className="text-muted small mb-3">
                        <i className="fas fa-truck me-1"></i>
                        Marca: {product.brand}
                      </p>

                      {product.description && (
                        <p className="text-muted small mb-3">
                          {product.description}
                        </p>
                      )}

                      <div className="pricing-info">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Precio Proveedor:</span>
                          <span className="h5 text-success mb-0">
                            ${product.price}
                          </span>
                        </div>
                        
                        {product.publicPrice && (
                          <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted small">Precio Público:</span>
                              <span className="text-decoration-line-through text-muted">
                                ${product.publicPrice}
                              </span>
                            </div>

                            <div className="text-center">
                              <small className="text-success">
                                <i className="fas fa-percentage me-1"></i>
                                Ahorro: {(((product.publicPrice - product.price) / product.publicPrice) * 100).toFixed(0)}%
                              </small>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-3 d-grid">
                        <Button 
                          variant="primary" 
                          size="sm"
                          disabled={product.countInStock === 0}
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
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Paginación */}
            {pagination && pagination.pages > 1 && (
              <Row className="mt-4">
                <Col>
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                  />
                </Col>
              </Row>
            )}
          </>
        )}

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
              <strong>Precio Proveedor:</strong> ${selectedProduct?.price}<br />
              <strong>Stock Disponible:</strong> {selectedProduct?.countInStock}<br />
              {selectedProduct?.category && <><strong>Categoría:</strong> {selectedProduct.category}<br /></>}
              {selectedProduct?.brand && <><strong>Marca:</strong> {selectedProduct.brand}</>}
            </p>
            <Form>
              <Form.Group controlId="formQuantity">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                  min={1}
                  max={selectedProduct?.countInStock || 999}
                />
              </Form.Group>
              <div className="mt-2">
                <strong>Total estimado: ${(selectedProduct?.price * quantity).toFixed(2)}</strong>
              </div>
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
