import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '', category = '', minPrice = '', maxPrice = '' }) => {
  // Construir query string para mantener filtros en la paginación
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    
    return params.toString();
  };

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={{
              pathname: !isAdmin ? `/page/${x + 1}` : `/admin/productlist/${x + 1}`,
              search: !isAdmin ? buildSearchParams() : ''
            }}
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
