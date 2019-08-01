import * as React from 'react';
import {
  PanelWrap,
  PanelCollapseWrap,
  PanelBodyWrap,
} from 'components/old/ui/collapse/styled/styled';

type PropsCollapse = {
  isOpen: boolean;
};

type StateCollapse = {
};

class Collapse extends React.Component<PropsCollapse, StateCollapse> {
  onToggle = (e) => {
    // toggle
  }

  render() {
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
