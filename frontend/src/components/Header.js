import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="light" variant="light" expand="lg" collapseOnSelect className="py-3">
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 700, 
              fontSize: '1.8rem',
              color: '#333',
              display: 'flex',
              alignItems: 'center'
            }}>
              <img
                src="/images/logo.png"
                alt="Toolitex Logo"
                width="100"
                height="40"
                className="d-inline-block align-top"
                style={{ marginRight: '15px' }}
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {userInfo && userInfo.email === 'adminpanky@test.com' ? (
                // Navegación exclusiva para admin de Panky
                <>
                  <LinkContainer to='/panky-admin'>
                    <Nav.Link className="me-3 d-flex align-items-center">
                      <span className="material-symbols-outlined me-1">dashboard</span> Mi Dashboard
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/panky-hilados'>
                    <Nav.Link className="me-3 d-flex align-items-center">
                      <span className="material-symbols-outlined me-1">inventory</span> Mi Catálogo
                    </Nav.Link>
                  </LinkContainer>
                </>
              ) : (
                // Navegación normal para otros usuarios
                <>
                  {userInfo && (
                    <LinkContainer to='/dashboard'>
                      <Nav.Link className="me-3 d-flex align-items-center">
                        <span className="material-symbols-outlined me-1">dashboard</span> Panel
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  <LinkContainer to='/proveedor'>
                    <Nav.Link className="me-3 d-flex align-items-center">
                      <span className="material-symbols-outlined me-1">business</span> Portal Proveedores
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              {/* 
              <LinkContainer to='/cart'>
                <Nav.Link className="me-3 d-flex align-items-center">
                  <span className="material-symbols-outlined me-1">shopping_cart</span> Carrito
                </Nav.Link>
              </LinkContainer>
              */}
              {userInfo ? (
                <NavDropdown 
                  title={
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-2">
                        {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      {userInfo.name || 'Usuario'}
                    </div>
                  } 
                  id='username'
                  align="end"
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Mi Perfil</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.email === 'adminpanky@test.com' ? (
                    // Opciones específicas para admin de Panky
                    <>
                      <LinkContainer to='/panky-admin'>
                        <NavDropdown.Item>Mi Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/panky-hilados'>
                        <NavDropdown.Item>Mi Catálogo</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  ) : (
                    // Opciones para otros usuarios
                    <LinkContainer to='/dashboard'>
                      <NavDropdown.Item>Panel de Proveedores</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Item onClick={logoutHandler}>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className="d-flex align-items-center">
                    <span className="material-symbols-outlined me-1">person</span> Iniciar Sesión
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
