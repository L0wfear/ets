import React, { Component, PropTypes } from 'react';
import ClickOutHandler from 'react-onclickout';
import cx from 'classnames';
import { autobind } from 'core-decorators';

@autobind
export default class ToolbarControl extends Component {

  static get propTypes() {
    return {
      onToggle: PropTypes.func,
      controlType: PropTypes.string,
      btnClass: PropTypes.string,
      style: PropTypes.object,
      top: PropTypes.string,
      children: PropTypes.node,
    };
  }

  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  handleClickOutside() {
    if (this.state.visible === true) {
      this.setState({ visible: false });
    }
  }

  toggleVisibility() {
    this.setState({ visible: !this.state.visible });

    if (this.props.onToggle !== undefined) {
      this.props.onToggle();
    }
  }

  render() {
    const controlClass = this.state.visible ? 'toolbar-control toggled' : 'toolbar-control';
    const position = {
      top: this.props.top,
    };
    const btnClass = cx('app-toolbar-btn', this.props.controlType, this.props.btnClass);

    const style = Object.assign({}, {
      display: this.state.visible ? 'block' : 'none',
      position: 'relative',
      left: 42,
      top: -42,
    }, this.props.style);

    return (
      <ClickOutHandler onClickOut={this.handleClickOutside}>
        <div className={controlClass} style={{ top: position.top }}>
          <button className={btnClass} onClick={this.toggleVisibility} />
          <div className="app-toolbar-fill" style={style}>
            <span className="toolbar-filters-wrap__close-btn" onClick={this.toggleVisibility}>×</span>
            {this.props.children}
          </div>
        </div>
      </ClickOutHandler>
    );
  }
}
