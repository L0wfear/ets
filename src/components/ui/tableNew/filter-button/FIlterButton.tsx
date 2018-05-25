import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';

const FilterButton: React.SFC<any> = ({ active, disabled, onClick, noFilter }) =>
  !noFilter && (
    <Button
      bsSize="small"
      disabled={disabled}
      className={cx('filter-button', { 'filter-button-active': active })}
      onClick={onClick}
    >
      <Glyphicon glyph="filter" />
    </Button>
  );

export default FilterButton;
