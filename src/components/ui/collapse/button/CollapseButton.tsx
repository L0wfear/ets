import * as React from 'react';
import * as cx from 'classnames';
import { Glyphicon } from 'react-bootstrap';

import Collapse from 'components/ui/collapse/Collapse';

require('components/ui/collapse/button/CollapseButton.scss');

type PropsButtonCollapse = {
};

type StateButtonCollapse = {

};

class ButtonCollapse extends React.Component<PropsButtonCollapse, StateButtonCollapse> {
  state = {
    isOpen: false,
  };

  toggleIsOpen = () => (
    this.setState({
      isOpen: !this.state.isOpen,
    })
  )

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <Collapse isOpen={isOpen}/>
        <div className={cx('glyphicon_wrap', { is_open: isOpen})}>
          <Glyphicon glyph={'menu-down'} onClick={this.toggleIsOpen} />
        </div>
      </div>
    );
  }
}

export default ButtonCollapse;
