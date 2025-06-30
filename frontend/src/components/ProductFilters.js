import React, { useState } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const ProductFilters = ({ categories, onFilterChange, currentFilters }) => {
  const [filters, setFilters] = useState({
    category: currentFilters?.category || '',
    minPrice: currentFilters?.minPrice || '',
    maxPrice: currentFilters?.maxPrice || '',
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    const emptyFilters = { category: '', minPrice: '', maxPrice: '' };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Filtros</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Precio mínimo</Form.Label>
              <Form.Control
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Precio máximo</Form.Label>
              <Form.Control
                type="number"
                placeholder="$999"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <div className="mb-3 w-100">
              <Button 
                variant="primary" 
                onClick={applyFilters}
                className="w-100 mb-2"
              >
                Aplicar
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={clearFilters}
                className="w-100"
                size="sm"
              >
                Limpiar
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductFilters;
