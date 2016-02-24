import React, { Component } from 'react';
import ClickOutHandler from 'react-onclickout';

export default class ToolbarControl extends Component {

  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  render(){
    let controlClass = this.state.visible ? 'toolbar-control toggled' : 'toolbar-control'
    let position = {
      top: this.props.top
    }
    let btnClass = 'app-toolbar-btn '+this.props.controlType+' '+this.props.btnClass

    let style = Object.assign({},
      {
        display: this.state.visible ? 'block' : 'none',
        position:'relative',
        left:42,
        top:-42
      },
      this.props.style )

    return (
      <ClickOutHandler onClickOut={this.handleClickOutside.bind(this)}>
        <div className={controlClass} style={{top: position.top}}>
          <button className={btnClass} onClick={this.toggleVisibility.bind(this)}></button>
          <div className="app-toolbar-fill" style={style}>
            <span className="toolbar-filters-wrap__close-btn" onClick={this.toggleVisibility.bind(this)}>×</span>
            {this.props.children}
          </div>
        </div>
      </ClickOutHandler>
    )
  }

  handleClickOutside(){
    this.setState({visible: false})
  }

  toggleVisibility(){
    this.setState({visible: !this.state.visible});

    if ( this.props.onToggle !== undefined ){
      this.props.onToggle();
    }
  }
}
