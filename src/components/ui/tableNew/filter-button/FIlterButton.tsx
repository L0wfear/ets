import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as cx from 'classnames';

const FilterButton: React.FC<any> = ({ active, disabled, onClick, noFilter }) =>
  !noFilter && (
    <EtsBootstrap.Button
      bsSize="small"
      disabled={disabled}
      className={cx('filter-button', { 'filter-button-active': active })}
      onClick={onClick}
    >
      <EtsBootstrap.Glyphicon glyph="filter" />
    </EtsBootstrap.Button>
  );

export default FilterButton;
