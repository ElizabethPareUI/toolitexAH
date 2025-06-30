import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { logout } from '../actions/userActions';
import { listPankyProducts } from '../actions/productActions';
import PankyProductFilters from '../components/PankyProductFilters';
import PankyPagination from '../components/PankyPagination';
import '../styles/panky-components.scss';

const PankyAdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Estados locales para filtros y paginación
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest',
    page: 1,
    limit: 6
  });

  // Obtener información del usuario logueado
  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading, error, products, pagination, filters: availableFilters } = useSelector((state) => state.pankyProducts);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Manejar cambios en filtros
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...newFilters, page: 1 }; // Resetear a página 1 cuando cambien filtros
    setFilters(updatedFilters);
    dispatch(listPankyProducts(updatedFilters));
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    dispatch(listPankyProducts(updatedFilters));
  };

  useEffect(() => {
    // Verificar si el usuario es admin de Panky
    if (!userInfo || !userInfo.isAdmin || userInfo.email !== 'adminpanky@test.com') {
      navigate('/login');
      return;
    }

    // Cargar productos de Panky desde la base de datos con filtros iniciales
    dispatch(listPankyProducts(filters));
  }, [dispatch, navigate, userInfo, filters]);

  if (!userInfo || !userInfo.isAdmin) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Acceso Restringido</h4>
          <p>Solo administradores pueden acceder a esta sección.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header del Dashboard */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center p-4 bg-white rounded shadow-sm">
            <div>
              <h1 className="h2 mb-1" style={{ color: '#6a0d83' }}>
                <i className="fas fa-cogs me-2"></i>
                Panel de Administración - Panky Hilados
              </h1>
              <p className="text-muted mb-0">
                Bienvenido, {userInfo.name} | Gestiona tu catálogo de productos
              </p>
            </div>
            <div>
              <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => navigate('/')}
              >
                <i className="fas fa-home me-1"></i>
                Inicio
              </Button>
              <Button 
                variant="danger"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Mostrar error si existe */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">
              <h4>Error al cargar productos</h4>
              <p>{error}</p>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Estadísticas rápidas */}
      {!loading && products && products.length > 0 && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="fas fa-box fa-2x text-primary mb-2"></i>
                <h5>Total Productos</h5>
                <h3 className="text-primary">{products.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="fas fa-warehouse fa-2x text-success mb-2"></i>
                <h5>Stock Total</h5>
                <h3 className="text-success">
                  {products.reduce((total, product) => total + product.countInStock, 0)}
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="fas fa-tags fa-2x text-info mb-2"></i>
                <h5>Categorías</h5>
                <h3 className="text-info">
                  {new Set(products.map(p => p.category)).size}
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="fas fa-exclamation-triangle fa-2x text-warning mb-2"></i>
                <h5>Stock Bajo</h5>
                <h3 className="text-warning">
                  {products.filter(p => p.countInStock <= 50).length}
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Título del catálogo */}
      <Row className="mb-3">
        <Col>
          <h2 style={{ color: '#6a0d83' }}>
            <i className="fas fa-edit me-2"></i>
            Catálogo de Productos - Panky Hilados
          </h2>
          <p className="text-muted">Haz clic en "Editar" para modificar cualquier producto</p>
        </Col>
      </Row>

      {/* Filtros de búsqueda */}
      {availableFilters && (
        <PankyProductFilters
          onFilterChange={handleFilterChange}
          filters={availableFilters.appliedFilters}
          categories={availableFilters.categories}
          priceRange={availableFilters.priceRange}
          loading={loading}
        />
      )}

      {/* Mostrar loading */}
      {loading && (
        <Row>
          <Col className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando productos...</p>
          </Col>
        </Row>
      )}

      {/* Catálogo de productos */}
      {!loading && products && products.length > 0 && (
        <Row>
          {products.map((product) => (
            <Col lg={3} md={4} sm={6} key={product._id} className="mb-4">
              <Card className="h-100 shadow-sm product-card">
                <Card.Img 
                  variant="top" 
                  src={product.image} 
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="h6 mb-1" style={{ color: '#6a0d83' }}>
                        {product.name}
                      </Card.Title>
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
                        <span className="h6 text-success mb-0">
                          ${product.price.toLocaleString('es-AR')} ARS
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="w-100"
                      onClick={() => navigate(`/panky/productos/${product._id}/editar`)}
                    >
                      <i className="fas fa-edit me-1"></i>
                      Editar Producto
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Paginación */}
      {!loading && pagination && pagination.pages > 1 && (
        <PankyPagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {/* Mensaje si no hay productos */}
      {!loading && (!products || products.length === 0) && !error && (
        <Row>
          <Col className="text-center">
            <Alert variant="info">
              <h4>No hay productos disponibles</h4>
              <p>Aún no se han agregado productos de Panky al catálogo.</p>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PankyAdminDashboard;
