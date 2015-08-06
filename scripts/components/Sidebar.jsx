import React, { Component } from 'react';
import CarInfo from './CarInfo.jsx';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class Sidebar extends Component {
  render() {

    return (
      <ReactCSSTransitionGroup transitionName="example">
        {this.props.selected ?
          <div key={this.props.selected.id} className="dashboard-sidebar" style={{ zIndex: 100 }}>
            <div style={{ height: "100%", overflow: "auto" }}>
              <CarInfo car={this.props.selected} flux={this.props.flux}/>
            </div>
          </div>
            :
        <div key="nothing"/>}
      </ReactCSSTransitionGroup>
    )
  }

}
