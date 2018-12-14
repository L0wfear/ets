import * as React from 'react';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as Button from 'react-bootstrap/lib/Button';

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
      <Button bsSize="small" id="show-options-filter" disabled={disabled} active={active} onClick={this.props.onClick}>
        <Glyphicon glyph="filter" />
      </Button>
    );
  }
}

export default FilterButton;
