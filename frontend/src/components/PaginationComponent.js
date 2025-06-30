import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  loading = false,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // Ajustar startPage si hay espacio al final
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Primera página
    if (startPage > 1) {
      items.push(
        <Pagination.Item
          key={1}
          active={currentPage === 1}
          onClick={() => handlePageChange(1)}
          disabled={loading}
        >
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    // Páginas visibles
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={currentPage === page}
          onClick={() => handlePageChange(page)}
          disabled={loading}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={loading}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className={`d-flex justify-content-center ${className}`}>
      <Pagination className="mb-0">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          <i className="fas fa-chevron-left"></i>
        </Pagination.Prev>
        
        {renderPaginationItems()}
        
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          <i className="fas fa-chevron-right"></i>
        </Pagination.Next>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
