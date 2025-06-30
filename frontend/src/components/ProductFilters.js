import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';

const ProductFilters = ({ 
  onFilterChange, 
  filters = {}, 
  categories = [], 
  priceRange = { min: 0, max: 1000 },
  loading = false,
  brandName = "Productos"
}) => {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest',
    ...filters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'newest'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'oldest', label: 'Más antiguos' },
    { value: 'name_asc', label: 'Nombre A-Z' },
    { value: 'name_desc', label: 'Nombre Z-A' },
    { value: 'price_asc', label: 'Precio menor a mayor' },
    { value: 'price_desc', label: 'Precio mayor a menor' },
    { value: 'rating', label: 'Mejor valorados' }
  ];

  return (
    <div className="product-filters mb-4 p-3" style={{ 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h5 className="mb-3 text-primary">
        <i className="fas fa-filter me-2"></i>
        Filtros de {brandName}
      </h5>
      
      <Form>
        <Row className="g-3">
          {/* Búsqueda por texto */}
          <Col md={6} lg={4}>
            <Form.Label>Buscar producto</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                disabled={loading}
              />
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
            </InputGroup>
          </Col>

          {/* Filtro por categoría */}
          <Col md={6} lg={3}>
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={localFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={loading}
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Ordenamiento */}
          <Col md={6} lg={3}>
            <Form.Label>Ordenar por</Form.Label>
            <Form.Select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              disabled={loading}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Botón limpiar */}
          <Col md={6} lg={2}>
            <Form.Label>&nbsp;</Form.Label>
            <div className="d-grid">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={handleClearFilters}
                disabled={loading}
              >
                <i className="fas fa-times me-1"></i>
                Limpiar
              </Button>
            </div>
          </Col>

          {/* Filtros de precio */}
          <Col md={6} lg={3}>
            <Form.Label>Precio mínimo</Form.Label>
            <Form.Control
              type="number"
              placeholder={`Desde $${priceRange.min || 0}`}
              value={localFilters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              disabled={loading}
              min={0}
            />
          </Col>

          <Col md={6} lg={3}>
            <Form.Label>Precio máximo</Form.Label>
            <Form.Control
              type="number"
              placeholder={`Hasta $${priceRange.max || 1000}`}
              value={localFilters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              disabled={loading}
              min={0}
            />
          </Col>

          {/* Solo en stock */}
          <Col md={6} lg={3}>
            <Form.Label>&nbsp;</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="stock-switch"
                label="Solo con stock"
                checked={localFilters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                disabled={loading}
              />
            </div>
          </Col>

          {/* Botón aplicar (opcional) */}
          <Col md={6} lg={3}>
            <Form.Label>&nbsp;</Form.Label>
            <div className="d-grid">
              <Button 
                variant="primary" 
                size="sm"
                disabled={loading}
                onClick={() => onFilterChange(localFilters)}
              >
                <i className="fas fa-search me-1"></i>
                {loading ? 'Buscando...' : 'Aplicar'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProductFilters;
