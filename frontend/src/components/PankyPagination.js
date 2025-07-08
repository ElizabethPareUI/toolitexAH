import React from 'react';
import { Pagination, Row, Col } from 'react-bootstrap';

const PankyPagination = ({ 
  pagination, 
  onPageChange, 
  loading = false 
}) => {
  const { page, pages, pageSize, total, hasNextPage, hasPrevPage } = pagination;

  if (pages <= 1) return null;

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== page && !loading) {
      onPageChange(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Calcular el rango de páginas a mostrar
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pages, startPage + maxVisiblePages - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Primera página y puntos suspensivos si es necesario
    if (startPage > 1) {
      items.push(
        <Pagination.Item
          key={1}
          onClick={() => handlePageClick(1)}
          disabled={loading}
        >
          1
        </Pagination.Item>
      );
      
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    // Páginas del rango
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => handlePageClick(number)}
          disabled={loading}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Última página y puntos suspensivos si es necesario
    if (endPage < pages) {
      if (endPage < pages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      
      items.push(
        <Pagination.Item
          key={pages}
          onClick={() => handlePageClick(pages)}
          disabled={loading}
        >
          {pages}
        </Pagination.Item>
      );
    }

    return items;
  };

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="panky-pagination mt-4">
      <Row className="align-items-center">
        <Col md={6}>
          <div className="pagination-info">
            <small className="text-muted">
              Mostrando {startItem} - {endItem} de {total} productos
            </small>
          </div>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Pagination className="mb-0">
            <Pagination.First
              onClick={() => handlePageClick(1)}
              disabled={!hasPrevPage || loading}
            />
            <Pagination.Prev
              onClick={() => handlePageClick(page - 1)}
              disabled={!hasPrevPage || loading}
            />
            
            {renderPaginationItems()}
            
            <Pagination.Next
              onClick={() => handlePageClick(page + 1)}
              disabled={!hasNextPage || loading}
            />
            <Pagination.Last
              onClick={() => handlePageClick(pages)}
              disabled={!hasNextPage || loading}
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default PankyPagination;
