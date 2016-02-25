import React, { Component } from 'react';
import CarInfo from './CarInfo.jsx';
import Div from '../ui/Div.jsx';

export default class Sidebar extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.selected === null) {
      return true;
    } else {
      return nextProps.selected.id !== this.props.selected.id;
    }
  }

  render() {
    let { selected } = this.props;

    return (
      <Div hidden={!selected} className="dashboard-sidebar">
        <span className="dashboard-sidebar-close" onClick={this.close.bind(this)}>×</span>
        <CarInfo car={selected} flux={this.props.flux} onclose={this.close.bind(this)}/>
      </Div>
    );
  }

  close() {
    let store = this.props.flux.getStore('points');
    store.handleSelectPoint(false)
  }

}
