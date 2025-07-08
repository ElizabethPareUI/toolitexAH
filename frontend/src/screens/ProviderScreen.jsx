import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import logo from '../logo.png';
import illustrationImage from '../illustration.png';
import './LoginScreen.scss';

const ProviderScreen = () => {
  const [providerCode, setProviderCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Verificar autenticación
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!userInfo) {
      navigate('/login?redirect=proveedor');
    }
  }, [userInfo, navigate]);

  // Códigos de proveedores válidos y sus tiendas correspondientes
  const VALID_PROVIDERS = {
    '123MIA': {
      storeName: 'Mia Hilados',
      storeType: 'Lanas y Tejidos',
      redirectTo: '/mia-hilados'
    },
    '456PANKY': {
      storeName: 'Panky Hilados',
      storeType: 'Hilados Premium',
      redirectTo: '/panky-hilados'
    }
    // Aquí se pueden agregar más proveedores en el futuro
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular validación
    setTimeout(() => {
      const upperCode = providerCode.trim().toUpperCase();
      const providerInfo = VALID_PROVIDERS[upperCode];
      
      if (providerInfo) {
        // Guardar en localStorage que es un proveedor autorizado
        const accessData = {
          storeName: providerInfo.storeName,
          storeType: providerInfo.storeType,
          accessCode: upperCode,
          accessTime: new Date().toISOString(),
          timestamp: Date.now(),
          validCode: upperCode
        };
        
        localStorage.setItem('providerAccess', JSON.stringify(accessData));
        
        // Registrar la visita en el historial
        const storeKey = providerInfo.redirectTo.replace('/', '');
        const now = new Date().toISOString();
        
        // Obtener visitas existentes
        const existingVisits = JSON.parse(localStorage.getItem('visitedProviderStores') || '[]');
        
        // Actualizar o agregar nueva visita
        const updatedVisits = existingVisits.filter(visit => visit.store !== storeKey);
        const newVisit = {
          store: storeKey,
          lastVisit: now,
          visitCount: (existingVisits.find(v => v.store === storeKey)?.visitCount || 0) + 1
        };
        
        const newVisitedStores = [newVisit, ...updatedVisits].slice(0, 10);
        localStorage.setItem('visitedProviderStores', JSON.stringify(newVisitedStores));
        
        // Redirigir a la tienda correspondiente
        navigate(providerInfo.redirectTo);
      } else {
        setError('Código de proveedor inválido. Contacte al administrador.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <Container fluid className="h-100">
        <Row className="h-100 align-items-center">
          <Col lg={6} className="login-left">
            <div className="login-form-container">
              <div className="brand-section">
                <div className="brand-logo">
                  <div className="logo-icon">
                    <img src={logo} alt="Toolitex Logo" className="brand-logo-img" />
                  </div>
                </div>
              </div>

              <div className="login-form-wrapper">
                <h1 className="login-title">🏪 Portal de Proveedores</h1>
                
                <Card className="login-card">
                  <Card.Body>
                    <h3 className="form-title">Acceso a Catálogos de Tiendas</h3>
                    <p className="text-muted text-center mb-4">
                      Acceda a los catálogos de tiendas proveedoras que suben sus productos. 
                      Ingrese su código de acceso para navegar, ver productos y solicitar cotizaciones personalizadas.
                    </p>
                    
                    {userInfo && (
                      <Alert variant="success" className="mb-4">
                        <i className="fas fa-user-check me-2"></i>
                        Bienvenido, <strong>{userInfo.name}</strong>. Puede proceder con su código de proveedor.
                      </Alert>
                    )}
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={submitHandler} className="login-form">
                      <Form.Group className="mb-4">
                        <Form.Label>Código de Proveedor</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Código de acceso de su tienda'
                          value={providerCode}
                          onChange={(e) => setProviderCode(e.target.value)}
                          className="modern-input"
                          required
                          style={{ textTransform: 'uppercase' }}
                        />
                        <Form.Text className="text-muted">
                          🏪 Código proporcionado por Toolitex para acceder a catálogos específicos
                        </Form.Text>
                      </Form.Group>

                      <Button 
                        type='submit' 
                        className="login-button"
                        disabled={loading || !providerCode.trim()}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Verificando...
                          </>
                        ) : (
                          'Acceder'
                        )}
                      </Button>
                    </Form>

                    <div className="register-link">
                      <span>¿No tiene código de proveedor? </span>
                      <a href="mailto:proveedores@toolitex.com" className="register-link-text">
                        Contacte al administrador
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
          
          <Col lg={6} className="login-right d-none d-lg-block">
            <div className="illustration-container">
              <div className="illustration">
                <img 
                  src={illustrationImage} 
                  alt="Provider Access Illustration" 
                  className="login-illustration-img"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProviderScreen;
