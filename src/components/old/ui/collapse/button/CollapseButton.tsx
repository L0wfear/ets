import * as React from 'react';

import Collapse from 'components/old/ui/collapse/Collapse';
import {
  GlyphiconCollapseButtonWrap,
  GlyphiconPointer,
} from 'components/old/ui/collapse/button/styled/styled';

import {
  PropsCollapseButton,
  StateCollapseButton,
} from 'components/old/ui/collapse/button/CollapseButton.h';

class CollapseButton extends React.Component<PropsCollapseButton, StateCollapseButton> {
  state = {
    isOpen: false,
  };

  toggleIsOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { isOpen } = this.state;

    return (
      <>
        <Collapse isOpen={isOpen}>
          { this.props.children }
        </Collapse>
        <GlyphiconCollapseButtonWrap isOpen={isOpen}>
          <GlyphiconPointer glyph={'menu-down'} onClick={this.toggleIsOpen} />
        </GlyphiconCollapseButtonWrap>
      </>
    );
  }
}

export default CollapseButton;
