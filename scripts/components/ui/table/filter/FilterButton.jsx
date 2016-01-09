import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

const FilterButton = (props) => {

  const filterClass = cx('filter-button', {
    'filter-button-active': props.active,
    'open': props.show,
    'right': props.direction === 'right',
    'left': props.direction !== 'right'
  });

  return (
    <Button bsSize="small" className={filterClass} onClick={props.onClick}>
      <Glyphicon glyph="filter"/>
    </Button>
  );
};

export default FilterButton;
