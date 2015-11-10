import React, { Component } from 'react';
import Filter from './Filter.jsx';
import ToolbarControl from './ToolbarControl.js';

export default class ToolbarSearch extends Component {

  constructor(flux, props) {
    super(flux, props)

    this.state = {
      canFocus: false,
      btnClassName: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({canFocus: nextProps.carsCount === 1})  
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
      <ToolbarControl controlType="search" top="0px" btnClass={this.state.btnClassName} onToggle={this.onToggle.bind(this)}>
        <Filter ref="search_text" onFilterChange={this.onFilterChange.bind(this)} className="bnso-filter" title="гос. номер или номер БНСО" name="bnso_gos"/>
        {this.state.canFocus && <button style={style} onClick={this.props.focusOnLonelyCar} className="btn btn-default btn-sm"><span className="glyphicon glyphicon-screenshot"></span>&nbsp;Показать</button>}
      </ToolbarControl>
      )
  }

  onFilterChange(value) {
    this.setState({btnClassName: !!value && value.length > 0 ? 'have-filter' : ''})
  }

  onToggle() {
    let inputDOM = React.findDOMNode(this.refs.search_text).firstChild;
    setTimeout(function() {
      inputDOM.focus()
    }, 150);
  }

}
