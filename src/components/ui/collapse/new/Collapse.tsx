import * as React from 'react';
import {
  PanelWrap,
  PanelCollapseWrap,
  PanelBodyWrap,
} from 'components/ui/collapse/styled/styled';

type PropsCollapse = {
  isOpen: boolean;
};

type StateCollapse = {
};

class Collapse extends React.Component<PropsCollapse, StateCollapse> {
  onToggle = (e) => {
    console.log(e)
  }

  render() {
    console.log(this.props.isOpen)
    return (
      <PanelWrap onToggle={this.onToggle} expanded={this.props.isOpen}>
        <PanelCollapseWrap>
          <PanelBodyWrap>
            {this.props.children}
          </PanelBodyWrap>
        </PanelCollapseWrap>
      </PanelWrap>
    );
  }
}

export default Collapse;
