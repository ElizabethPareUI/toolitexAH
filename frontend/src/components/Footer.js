import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', color: '#333', paddingTop: '3rem', paddingBottom: '2rem', borderTop: '1px solid #e9ecef' }}>
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start mb-4 mb-md-0">
            <img
              src="/images/logo.png"
              alt="Toolitex Logo"
              width="150"
            />
          </Col>
          <Col md={8} className="text-center text-md-end">
            <h5 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: '#343a40' }}>Suscríbete a nuestro boletín</h5>
            <p style={{ fontFamily: 'Lato, sans-serif', color: '#6c757d' }}>Recibe las últimas novedades y ofertas especiales.</p>
            <Form className="d-flex justify-content-center justify-content-md-end mt-3">
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                className="me-2"
                style={{ maxWidth: '300px', fontFamily: 'Lato, sans-serif' }}
              />
              <Button variant="dark" type="submit" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                Suscribirse
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
          <Col className="text-center">
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.9rem', color: '#6c757d' }}>&copy; {new Date().getFullYear()} Toolitex. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
