import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProductDetails, updateProduct } from '../actions/productActions';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading, error, product } = useSelector((state) => state.productDetails);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.productUpdate);

  useEffect(() => {
    // Verificar si el usuario es admin
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    if (successUpdate) {
      navigate('/panky/admin/dashboard');
    } else {
      if (!product || !product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

return (
    <Container>
        <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
                <FormContainer>
                    <h1>Editar Producto - Panky Hilados</h1>
                    {loadingUpdate && <Loader />}
                    {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="danger">{error}</Message>
                    ) : !product ? (
                        <Loader />
                    ) : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="name" className="my-3">
                                <Form.Label>Nombre del Producto</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId="category" className="my-3">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese categoría"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId="brand" className="my-3">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese marca"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId="price" className="my-3">
                                <Form.Label>Precio de Proveedor (ARS)</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <Form.Control
                                        type="number"
                                        step="500"
                                        min="10000"
                                        max="100000"
                                        placeholder="Ingrese precio en pesos argentinos"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                    <span className="input-group-text">ARS</span>
                                </div>
                                <Form.Text className="text-muted">
                                    Precio sugerido entre $10.000 y $100.000 ARS
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="countInStock" className="my-3">
                                <Form.Label>Stock Disponible</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese cantidad en stock"
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId="description" className="my-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Ingrese descripción"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <div className="d-flex justify-content-between align-items-center my-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate('/panky/admin/dashboard')}
                                    style={{ margin: '3px' }}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Volver al Dashboard
                                </Button>
                                
                                <Button type="submit" variant="primary">
                                    <i className="fas fa-save me-2"></i>
                                    Actualizar Producto
                                </Button>
                            </div>
                        </Form>
                    )}
                </FormContainer>
            </Col>
        </Row>
    </Container>
);
};

export default ProductEditScreen;
