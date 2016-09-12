import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

export default function FilterButton(props) {

  const filterClass = cx('filter-button', {
    'filter-button-active': props.active
  });

  return (
    <Button bsSize="small" disabled={props.disabled} className={filterClass} onClick={props.onClick}>
      <Glyphicon glyph="filter"/>
    </Button>
  );
}
