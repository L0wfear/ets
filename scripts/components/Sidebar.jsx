import React, { Component } from 'react';
import CarInfo from './CarInfo.jsx';

export default class Sidebar extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.selected === null) {
      return true;
    } else {
      return nextProps.selected.id !== this.props.selected.id;
    }
  }

  render() {
    let props = this.props;

    if (props.selected) {
      return (<div key={props.selected.id} className="dashboard-sidebar">
        <div style={{
          height: "100%",
          overflow: "auto"
        }}>
          <span className="dashboard-sidebar-close" onClick={this.close.bind(this)}>×</span>
          <CarInfo car={props.selected} flux={props.flux}/>
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
