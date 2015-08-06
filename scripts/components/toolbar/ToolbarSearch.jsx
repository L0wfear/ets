import React, { Component } from 'react';
import Filter from './Filter.jsx';
import ToolbarControl from './ToolbarControl.js';

export default class ToolbarSearch extends Component {
  render(){
    let text = this.refs.search_text ? React.findDOMNode(this.refs.search_text).firstChild.value : '';

    return (
      <ToolbarControl controlType="search" top="0px" btnClass={text.length ? 'have-filter' : ''} onToggle={this.onToggle.bind(this)}>
        <Filter ref="search_text" className="bnso-filter" title="гос. номер или номер БНСО" name="bnso_gos"/>
      </ToolbarControl>
    )
  }

  onToggle(){
      let inputDOM = React.findDOMNode(this.refs.search_text).firstChild;
      setTimeout( function(){
        inputDOM.focus()
      }, 150);
  }

}
