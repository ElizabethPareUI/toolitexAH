import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';

const PankyProductFilters = ({ 
  onFilterChange, 
  filters = {}, 
  categories = [], 
  priceRange = { minPrice: 0, maxPrice: 1000 },
  loading = false 
}) => {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest'
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
    <div className="panky-product-filters mb-4 p-3" style={{ 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h5 className="mb-3 text-primary">
        <i className="fas fa-filter me-2"></i>
        Filtros de Búsqueda
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

          {/* Botones de acción */}
          <Col md={6} lg={2} className="d-flex align-items-end">
            <Button
              variant="outline-secondary"
              onClick={handleClearFilters}
              disabled={loading}
              className="w-100"
            >
              <i className="fas fa-eraser me-1"></i>
              Limpiar
            </Button>
          </Col>
        </Row>

        <Row className="g-3 mt-2">
          {/* Filtros de precio */}
          <Col md={3}>
            <Form.Label>Precio mínimo (ARS)</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder={`Min: ${priceRange.minPrice?.toLocaleString('es-AR') || '10.000'}`}
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                disabled={loading}
                min={priceRange.minPrice}
                max={priceRange.maxPrice}
                step="500"
              />
              <InputGroup.Text>ARS</InputGroup.Text>
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Label>Precio máximo (ARS)</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder={`Max: ${priceRange.maxPrice?.toLocaleString('es-AR') || '100.000'}`}
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                disabled={loading}
                min={priceRange.minPrice}
                max={priceRange.maxPrice}
                step="500"
              />
              <InputGroup.Text>ARS</InputGroup.Text>
            </InputGroup>
          </Col>

          {/* Disponibilidad */}
          <Col md={3} className="d-flex align-items-end">
            <Form.Check
              type="checkbox"
              id="inStock"
              label="Solo productos disponibles"
              checked={localFilters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              disabled={loading}
              className="mb-2"
            />
          </Col>

          {/* Información de resultados */}
          <Col md={3} className="d-flex align-items-end justify-content-end">
            <small className="text-muted mb-2">
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-1"></i>
                  Buscando...
                </>
              ) : (
                <>
                  <i className="fas fa-info-circle me-1"></i>
                  Filtros aplicados
                </>
              )}
            </small>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PankyProductFilters;
