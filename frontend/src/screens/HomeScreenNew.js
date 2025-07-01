import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();

  const accessPlans = [
    {
      id: 1,
      title: 'Plan Básico',
      description: 'Acceso a catálogo general de productos textiles',
      price: 'Gratuito',
      features: [
        'Visualización de productos',
        'Información básica de precios',
        'Contacto directo con vendedores',
        'Soporte por email'
      ],
      buttonText: 'Registrarse',
      buttonVariant: 'outline-primary',
      popular: false
    },
    {
      id: 2,
      title: 'Plan Proveedor Premium',
      description: 'Acceso exclusivo a tiendas especializadas con precios mayoristas',
      price: 'Bajo autorización',
      features: [
        'Acceso a Mia Hilados - Lanas y Tejidos',
        'Acceso a Panky Hilados - Hilados Premium',
        'Precios de proveedor exclusivos',
        'Sistema de cotización avanzado',
        'Soporte prioritario',
        'Catálogos especializados'
      ],
      buttonText: 'Solicitar Acceso',
      buttonVariant: 'primary',
      popular: true
    },
    {
      id: 3,
      title: 'Plan Distribuidor',
      description: 'Para distribuidores y mayoristas con volúmenes altos',
      price: 'Contactar',
      features: [
        'Todos los beneficios de Proveedor Premium',
        'Descuentos por volumen',
        'Envíos preferenciales',
        'Asesoría comercial personalizada',
        'Términos de pago extendidos',
        'Dashboard de gestión'
      ],
      buttonText: 'Contactar Ventas',
      buttonVariant: 'outline-primary',
      popular: false
    }
  ];

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '80px 0' 
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="text-center text-lg-start">
                <img
                  src="/images/logo.png"
                  alt="Toolitex Logo"
                  style={{ width: '150px', height: 'auto', marginBottom: '30px' }}
                />
                <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '20px' }}>
                  Toolitex
                </h1>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '30px', opacity: '0.9' }}>
                  Plataforma Integral de Productos Textiles
                </h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: '0.85' }}>
                  Conectamos proveedores especializados con distribuidores profesionales. 
                  Accede a catálogos exclusivos de lanas, hilados y productos textiles premium.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <Button 
                    size="lg" 
                    variant="light" 
                    style={{ fontWeight: '600', padding: '12px 30px' }}
                    onClick={() => navigate('/proveedor')}
                  >
                    Acceso Proveedores
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline-light" 
                    style={{ fontWeight: '600', padding: '12px 30px' }}
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="text-center">
                <img 
                  src="/images/illustration.png" 
                  alt="Toolitex Platform" 
                  style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section style={{ padding: '80px 0' }}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                ¿Qué es Toolitex?
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '50px' }}>
                Toolitex es la plataforma líder que conecta el mundo textil profesional. 
                Ofrecemos acceso especializado a catálogos exclusivos de proveedores autorizados, 
                con precios mayoristas y herramientas de gestión avanzadas.
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div style={{ fontSize: '3rem', color: '#667eea', marginBottom: '20px' }}>
                    <i className="fas fa-store"></i>
                  </div>
                  <h4 style={{ fontWeight: '600', marginBottom: '15px' }}>Tiendas Especializadas</h4>
                  <p style={{ color: '#666' }}>
                    Acceso a catálogos exclusivos de Mia Hilados, Panky Hilados y más 
                    proveedores especializados en productos textiles premium.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div style={{ fontSize: '3rem', color: '#667eea', marginBottom: '20px' }}>
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h4 style={{ fontWeight: '600', marginBottom: '15px' }}>Precios Mayoristas</h4>
                  <p style={{ color: '#666' }}>
                    Obtén acceso a precios especiales de proveedor con descuentos 
                    significativos sobre precios de venta al público.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div style={{ fontSize: '3rem', color: '#667eea', marginBottom: '20px' }}>
                    <i className="fas fa-tools"></i>
                  </div>
                  <h4 style={{ fontWeight: '600', marginBottom: '15px' }}>Herramientas Profesionales</h4>
                  <p style={{ color: '#666' }}>
                    Sistema de cotización, gestión de pedidos y comunicación 
                    directa con proveedores para optimizar tu negocio.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Plans Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center mb-5">
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '20px', color: '#333' }}>
                Planes de Acceso
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>
                Elige el plan que mejor se adapte a las necesidades de tu negocio
              </p>
            </Col>
          </Row>
          
          <Row>
            {accessPlans.map((plan) => (
              <Col lg={4} md={6} className="mb-4" key={plan.id}>
                <Card 
                  className={`h-100 border-0 shadow-sm position-relative ${plan.popular ? 'border-primary' : ''}`}
                  style={plan.popular ? { border: '2px solid #667eea !important' } : {}}
                >
                  {plan.popular && (
                    <Badge 
                      bg="primary" 
                      style={{ 
                        position: 'absolute', 
                        top: '-10px', 
                        right: '20px',
                        fontSize: '0.8rem',
                        padding: '8px 15px'
                      }}
                    >
                      Más Popular
                    </Badge>
                  )}
                  
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="text-center mb-4">
                      <h3 style={{ fontWeight: '700', color: '#333', marginBottom: '10px' }}>
                        {plan.title}
                      </h3>
                      <p style={{ color: '#666', marginBottom: '20px' }}>
                        {plan.description}
                      </p>
                      <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                        {plan.price}
                      </div>
                    </div>
                    
                    <div className="flex-grow-1">
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {plan.features.map((feature, index) => (
                          <li key={index} style={{ marginBottom: '10px', color: '#666' }}>
                            <i className="fas fa-check text-success me-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        variant={plan.buttonVariant}
                        size="lg"
                        className="w-100"
                        style={{ fontWeight: '600' }}
                        onClick={() => {
                          if (plan.id === 2) {
                            navigate('/proveedor');
                          } else if (plan.id === 1) {
                            navigate('/register');
                          } else {
                            window.location.href = 'mailto:ventas@toolitex.com?subject=Consulta Plan Distribuidor';
                          }
                        }}
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section style={{ 
        padding: '80px 0', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white' 
      }}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '20px' }}>
                ¿Listo para comenzar?
              </h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: '0.9' }}>
                Únete a la red de profesionales textiles más grande de la región
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button 
                  size="lg" 
                  variant="light" 
                  style={{ fontWeight: '600', padding: '15px 40px' }}
                  onClick={() => navigate('/proveedor')}
                >
                  Acceso Proveedores
                </Button>
                <Button 
                  size="lg" 
                  variant="outline-light" 
                  style={{ fontWeight: '600', padding: '15px 40px' }}
                  onClick={() => window.location.href = 'mailto:info@toolitex.com'}
                >
                  Contactar Ventas
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomeScreen;
