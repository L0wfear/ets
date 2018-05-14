import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

const getClassName = active =>
  cx(
    'filter-button',
    {
      'filter-button-active': active,
    }
  );

export default ({ active, disabled, onClick }) => (
  <Button bsSize="small" id='show-options-filter' disabled={disabled} className={getClassName(active)} onClick={onClick}>
    <Glyphicon glyph="filter" />
  </Button>
);
