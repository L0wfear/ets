import React, { PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

export default function FilterButton({ active, disabled, onClick }) {
  const filterClass = cx('filter-button', {
    'filter-button-active': active,
  });

  return (
    <Button bsSize="small" disabled={disabled} className={filterClass} onClick={onClick}>
      <Glyphicon glyph="filter" />
    </Button>
  );
}

FilterButton.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
