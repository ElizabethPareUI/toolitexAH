import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './ProviderDashboard.scss';

const ProviderDashboard = () => {
  const [visitedStores, setVisitedStores] = useState([]);
  const navigate = useNavigate();

  // Verificar autenticación
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!userInfo) {
      navigate('/login?redirect=dashboard');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    // Cargar tiendas visitadas desde localStorage
    const storedVisits = localStorage.getItem('visitedProviderStores');
    if (storedVisits) {
      setVisitedStores(JSON.parse(storedVisits));
    }
  }, []);

  // Información de las tiendas proveedoras
  const storeInfo = {
    'mia-hilados': {
      name: 'Mia Hilados',
      description: 'Tienda proveedora especializada en lanas y tejidos premium',
      code: '123MIA',
      category: 'Lanas y Tejidos',
      color: '#FF6B6B',
      icon: <i className="fab fa-yarn"></i>
    },
    'panky-hilados': {
      name: 'Panky Hilados',
      description: 'Tienda proveedora de hilados premium y exclusivos',
      code: '456PANKY',
      category: 'Hilados Premium',
      color: '#4ECDC4',
      icon: <i className="fas fa-gift"></i>
    }
  };

  const handleStoreAccess = (storeKey) => {
    // Actualizar historial de visitas
    const now = new Date().toISOString();
    const updatedVisits = visitedStores.filter(visit => visit.store !== storeKey);
    const newVisit = {
      store: storeKey,
      lastVisit: now,
      visitCount: (visitedStores.find(v => v.store === storeKey)?.visitCount || 0) + 1
    };
    
    const newVisitedStores = [newVisit, ...updatedVisits].slice(0, 10); // Mantener solo las últimas 10
    setVisitedStores(newVisitedStores);
    localStorage.setItem('visitedProviderStores', JSON.stringify(newVisitedStores));

    // Navegar a la tienda
    navigate(`/${storeKey}`);
  };

  const handleAccessProvider = () => {
    navigate('/proveedor');
  };

  const formatLastVisit = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Hace un momento' : `Hace ${diffMins} minutos`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
    } else {
      return diffDays === 1 ? 'Ayer' : `Hace ${diffDays} días`;
    }
  };

  if (!userInfo) {
    return null; // No renderizar nada si no está autenticado
  }

  return (
    <>
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 mb-1">Panel de Catálogos</h1>
                <p className="text-muted">Acceso rápido a catálogos de tiendas proveedoras, {userInfo.name}</p>
              </div>
              <Button 
                variant="primary" 
                onClick={handleAccessProvider}
                className="d-flex align-items-center"
              >
                <i className="fas fa-plus me-2"></i>
                Acceder a Nuevo Proveedor
              </Button>
            </div>
          </Col>
        </Row>

        {/* Estadísticas rápidas */}
        <Row className="mb-4">
          <Col md={12}>              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="text-primary">{visitedStores.length}</h3>
                  <p className="mb-0">Catálogos Visitados</p>
                </Card.Body>
              </Card>
          </Col>
        </Row>

        {/* Tiendas visitadas recientemente */}
        {visitedStores.length > 0 ? (
          <Row className="mb-4">
            <Col>
              <h3 className="h4 mb-3">
                <i className="fas fa-history me-2"></i>
                Catálogos Visitados Recientemente
              </h3>
              <Row>
                {visitedStores.map((visit) => {
                  const store = storeInfo[visit.store];
                  if (!store) return null;
                  
                  return (
                    <Col md={6} lg={4} key={visit.store} className="mb-3">
                      <Card className="h-100 border-0 shadow-sm hover-card">
                        <Card.Body className="d-flex flex-column">
                          <div className="d-flex align-items-center mb-3">
                            <div 
                              className="store-icon me-3"
                              style={{ 
                                fontSize: '2rem',
                                background: store.color + '20',
                                padding: '10px',
                                borderRadius: '10px',
                                color: store.color
                              }}
                            >
                              {store.icon}
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="mb-1">{store.name}</h5>
                              <Badge bg="secondary" className="mb-1">
                                {store.category}
                              </Badge>
                              <small className="text-muted d-block">
                                {formatLastVisit(visit.lastVisit)}
                              </small>
                            </div>
                          </div>
                          
                          <p className="text-muted small mb-3">{store.description}</p>
                          
                          <div className="d-flex justify-content-end mt-auto">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleStoreAccess(visit.store)}
                            >
                              Acceder
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        ) : (
          <Row className="mb-4">
            <Col>
              <Alert variant="info" className="text-center">
                <i className="fas fa-info-circle me-2"></i>
                Aún no has visitado ningún catálogo. ¡Comienza explorando los productos de nuestras tiendas proveedoras!
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default ProviderDashboard;
