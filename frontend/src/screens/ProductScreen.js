import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProductDetails } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    dispatch(addToCart(id, qty));
    navigate('/cart');
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Regresar
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        product && product.name && (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating value={product.rating} text={`${product.numReviews} opiniones`} />
              </ListGroup.Item>
              <ListGroup.Item>Precio: ${product.price}</ListGroup.Item>
              <ListGroup.Item>Descripción: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Precio:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Estado:</Col>
                    <Col>
                      {product.stock > 0 ? 'En Stock' : 'Agotado'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.stock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Cantidad</Col>
                      <Col>
                        <Form.Control as='select' value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                          {[...Array(product.stock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button 
                    onClick={addToCartHandler}
                    className='btn-block' 
                    type='button' 
                    disabled={product.stock === 0}
                  >
                    Añadir al Carrito
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        )
      )}
    </>
  );
};

export default ProductScreen;
