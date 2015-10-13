import React, { Component } from 'react';
import Filter from './Filter.jsx';
import ToolbarControl from './ToolbarControl.js';

export default class ToolbarSearch extends Component {

  constructor(flux, props) {
    super(flux, props)

    this.state = {
      canFocus: false
    }
  }

  render() {

    let style = {
      position: 'absolute',
      right: 30,
      top: 6,
      background: 'transparent',
      color: '#ccc'
    }

    return (
      <ToolbarControl controlType="search" top="0px" btnClass={this.btnClassName} onToggle={this.onToggle.bind(this)}>
        <Filter ref="search_text" onFilterChange={this.onFilterChange.bind(this)} className="bnso-filter" title="гос. номер или номер БНСО" name="bnso_gos"/>
        {this.state.canFocus && <button style={style} onClick={this.focusOnLonelyCar.bind(this)} className="btn btn-default btn-sm"><span className="glyphicon glyphicon-screenshot"></span>&nbsp;Показать</button>}
      </ToolbarControl>
      )
  }

  onFilterChange(value) {
    if (!!value && value.length > 0) {
      this.btnClassName = 'have-filter'
    } else {
      this.btnClassName = ''
    }

    if (value.length > 0) {
      let count = 0;
      let store = this.props.store;

      for (let k in store.state.byConnectionStatus) {
        count += store.state.byConnectionStatus[k];
      }

      this.setState({
        canFocus: count === 1
      })
    }
  }

  focusOnLonelyCar() {
    let store = this.props.store;
    let onlyPoint = store.getVisiblePoints()[0];
    let map = olmap;
    let view = map.getView();
    let size = map.getSize()

    view.centerOn(onlyPoint.marker.coords, size, [size[0]/2, size[1]/2])
    view.setZoom(15);
  }

  onToggle() {
    let inputDOM = React.findDOMNode(this.refs.search_text).firstChild;
    setTimeout(function() {
      inputDOM.focus()
    }, 150);
  }

}
