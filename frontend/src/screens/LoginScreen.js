import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';
import logo from '../logo.png';
import illustrationImage from '../illustration.png';
import './LoginScreen.scss';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

  useEffect(() => {
    if (userInfo) {
      // Si es el admin de Panky, redirigir al dashboard exclusivo
      if (userInfo.email === 'adminpanky@test.com' && userInfo.isAdmin) {
        navigate('/panky-admin');
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
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
                <h1 className="login-title">Login</h1>
                
                <Card className="login-card">
                  <Card.Body>
                    <h3 className="form-title">Ingresá a tu cuenta</h3>
                    
                    {error && <Message variant='danger'>{error}</Message>}
                    {loading && <Loader />}
                    
                    <Form onSubmit={submitHandler} className="login-form">
                      <Form.Group className="mb-3">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          type='email'
                          placeholder='E-mail'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="modern-input"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <div className="password-input-wrapper">
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Contraseña'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="modern-input password-input"
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                          </button>
                        </div>
                      </Form.Group>

                      <div className="form-options">
                        <Form.Check
                          type="checkbox"
                          id="remember-me"
                          label="Recordar"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="remember-checkbox"
                        />
                        <Link to="/forgot-password" className="forgot-link">
                          Recuperar contraseña
                        </Link>
                      </div>

                      <Button 
                        type='submit' 
                        className="login-button"
                        disabled={loading}
                      >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                      </Button>
                    </Form>

                    <div className="register-link">
                      <span>Todavía no te registraste ? </span>
                      <Link 
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}
                        className="register-link-text"
                      >
                        Registrarse
                      </Link>
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
                  alt="Illustration" 
                  className="login-illustration"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginScreen;
