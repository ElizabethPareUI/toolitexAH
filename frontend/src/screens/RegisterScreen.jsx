import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';
import logo from '../logo.png';
import illustrationImage from '../illustration.png';
import './LoginScreen.scss';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para validaciones
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  // Funciones de validación
  const validateName = (name) => {
    if (!name.trim()) return 'El nombre es requerido';
    if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (name.trim().length > 50) return 'El nombre no puede exceder 50 caracteres';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) return 'El nombre solo puede contener letras y espacios';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'El email es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Ingrese un email válido';
    if (email.length > 100) return 'El email no puede exceder 100 caracteres';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (password.length > 128) return 'La contraseña no puede exceder 128 caracteres';
    if (!/(?=.*[a-z])/.test(password)) return 'La contraseña debe contener al menos una letra minúscula';
    if (!/(?=.*[A-Z])/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula';
    if (!/(?=.*\d)/.test(password)) return 'La contraseña debe contener al menos un número';
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'La contraseña debe contener al menos un carácter especial (@$!%*?&)';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Debe confirmar la contraseña';
    if (confirmPassword !== password) return 'Las contraseñas no coinciden';
    return '';
  };

  // Validar todos los campos
  const validateForm = () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password)
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Manejar blur de campos
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(name);
        break;
      case 'email':
        error = validateEmail(email);
        break;
      case 'password':
        error = validatePassword(password);
        // También revalidar confirmPassword si ya se tocó
        if (touched.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(confirmPassword, password)
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(confirmPassword, password);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Limpiar errores cuando el usuario empieza a escribir
  const handleChange = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        if (touched.name) {
          setErrors(prev => ({ ...prev, name: validateName(value) }));
        }
        break;
      case 'email':
        setEmail(value);
        if (touched.email) {
          setErrors(prev => ({ ...prev, email: validateEmail(value) }));
        }
        break;
      case 'password':
        setPassword(value);
        if (touched.password) {
          setErrors(prev => ({ ...prev, password: validatePassword(value) }));
        }
        if (touched.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword, value) }));
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        if (touched.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value, password) }));
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    
    // Marcar todos los campos como tocados
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (validateForm()) {
      dispatch(register(name.trim(), email.trim(), password));
    } else {
      setMessage('Por favor, corrige los errores antes de continuar');
    }
  };

  // Función para obtener el estado de validación del campo
  const getFieldState = (field) => {
    if (!touched[field]) return '';
    return errors[field] ? 'is-invalid' : 'is-valid';
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
                <h1 className="login-title">Registro</h1>
                
                <Card className="login-card">
                  <Card.Body>
                    <h3 className="form-title">Creá tu cuenta</h3>
                    
                    {message && <Message variant='danger'>{message}</Message>}
                    {error && <Message variant='danger'>{error}</Message>}
                    {loading && <Loader />}
                    
                    <Form onSubmit={submitHandler} className="login-form">
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre completo</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Nombre completo'
                          value={name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                          className={`modern-input ${getFieldState('name')}`}
                          required
                        />
                        {touched.name && errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          type='email'
                          placeholder='E-mail'
                          value={email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                          className={`modern-input ${getFieldState('email')}`}
                          required
                        />
                        {touched.email && errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <div className="password-input-wrapper">
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Contraseña'
                            value={password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            onBlur={() => handleBlur('password')}
                            className={`modern-input password-input ${getFieldState('password')}`}
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
                        {touched.password && errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                        {!errors.password && password && (
                          <div className="password-requirements">
                            <small className="text-muted">
                              La contraseña debe contener: mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial
                            </small>
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirmar contraseña</Form.Label>
                        <div className="password-input-wrapper">
                          <Form.Control
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='Confirmar contraseña'
                            value={confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            onBlur={() => handleBlur('confirmPassword')}
                            className={`modern-input password-input ${getFieldState('confirmPassword')}`}
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                          </button>
                        </div>
                        {touched.confirmPassword && errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </Form.Group>

                      <Button 
                        type='submit' 
                        className="login-button"
                        disabled={loading}
                      >
                        {loading ? 'Registrando...' : 'Registrarse'}
                      </Button>
                    </Form>

                    <div className="register-link">
                      <span>¿Ya tenés cuenta? </span>
                      <Link 
                        to={redirect ? `/login?redirect=${redirect}` : '/login'}
                        className="register-link-text"
                      >
                        Iniciar sesión
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
                  alt="Register Illustration" 
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

export default RegisterScreen;
