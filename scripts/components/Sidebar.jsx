import React, { Component } from 'react';
import CarInfo from './CarInfo.jsx';

//var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class Sidebar extends Component {
  render() {

    let btnCloseStyle = {
      position: 'absolute',
      right: 15,
      top: 15,
      color: '#767676',
      fontSize: 18,
      cursor: 'pointer'
    }

    let props = this.props;

    if (props.selected) {
    //  debugger;
      return (<div key={this.props.selected.id} className="dashboard-sidebar" style={{
          zIndex: 100
        }}>
        <div style={{
          height: "100%",
          overflow: "auto"
        }}>
          <span style={btnCloseStyle} onClick={this.close.bind(this)}>×</span>
          <CarInfo car={this.props.selected} flux={this.props.flux}/>
        </div>
      </div>)
    } else {
      return <div key="nothing"/>
    }
  }

  close() {
    let store = this.props.flux.getStore('points');
    store.handleSelectPoint(false)
  }

}
