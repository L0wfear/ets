import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type PropsFilterButton = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const FilterButton: React.FC<PropsFilterButton> = React.memo(
  (props) => {
    const {
      active,
      disabled,
    } = props;

    return (
      <EtsBootstrap.Button bsSize="small" id="show-options-filter" disabled={disabled} active={active} onClick={props.onClick}>
        <EtsBootstrap.Glyphicon glyph="filter" />
      </EtsBootstrap.Button>
    );
  },
);

export default FilterButton;
