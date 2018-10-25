import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
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
