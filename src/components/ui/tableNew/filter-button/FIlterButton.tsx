import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as cx from 'classnames';

const FilterButton: React.FC<any> = ({ active, disabled, onClick, noFilter }) =>
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
