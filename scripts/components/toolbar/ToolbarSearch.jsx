import React, { Component } from 'react';
import Filter from './Filter.jsx';
import ToolbarControl from './ToolbarControl.js';

export default class ToolbarSearch extends Component {

  constructor(flux, props){
    super(flux, props)
  }

  render(){
    return (
      <ToolbarControl controlType="search" top="0px" btnClass={this.btnClassName} onToggle={this.onToggle.bind(this)}>
        <Filter ref="search_text" onFilterChange={this.onFilterChange.bind(this)} className="bnso-filter" title="гос. номер или номер БНСО" name="bnso_gos"/>
      </ToolbarControl>
    )
  }

  onFilterChange(value){
    if ( !!value && value.length > 0 ) {
      this.btnClassName = 'have-filter'
    } else {
      this.btnClassName = ''
    }

    if ( value.length > 0 ){
      let byConnectionStatus = this.props.store.state.byConnectionStatus;
      let count = 0;

      for ( let k in this.props.store.state.byConnectionStatus ){
        count += this.props.store.state.byConnectionStatus[k];
      }

      if (count === 1){
        console.log( 'centering on one point', this.props.store.state);
      }

     // console.log( count )
    }
  }

  onToggle(){
      let inputDOM = React.findDOMNode(this.refs.search_text).firstChild;
      setTimeout( function(){
        inputDOM.focus()
      }, 150);
  }

}
