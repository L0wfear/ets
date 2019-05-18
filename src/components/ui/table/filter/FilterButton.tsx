import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type PropsFilterButton = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

class FilterButton extends React.PureComponent<PropsFilterButton, any> {
  render() {
    const {
      active,
      disabled,
    } = this.props;

    return (
      <EtsBootstrap.Button bsSize="small" id="show-options-filter" disabled={disabled} active={active} onClick={this.props.onClick}>
        <EtsBootstrap.Glyphicon glyph="filter" />
      </EtsBootstrap.Button>
    );
  }
}

export default FilterButton;
