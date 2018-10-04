import * as React from 'react';
import * as cx from 'classnames';

import Collapse from 'components/ui/collapse/Collapse';

type PropsCollapseText= {
  classNameTitle?: string;
  title: any;
  dependentData: any;
  classNameContainer?: string;
};

type StateCollapseText= {

};

class CollapseText extends React.Component<PropsCollapseText, StateCollapseText> {
  state = {
    isOpen: false,
  };

  toggleIsOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  render() {
    return (
      <div className={this.props.classNameContainer}>
        <div className={cx('pointer', this.props.classNameTitle)} onClick={this.toggleIsOpen} >{this.props.title}</div>
        <Collapse {...this.props} isOpen={this.state.isOpen}/>
      </div>
    )
  }
}

export default CollapseText;
