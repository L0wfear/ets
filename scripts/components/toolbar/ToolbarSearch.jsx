import React, { Component } from 'react';
import Filter from './Filter.jsx';

export default class ToolbarSearch extends Component {

  constructor(props){
    super(props);
    this.state = { visible : false }
  }

  render(){
    let c = this.state.visible ? 'toolbar-search toggled' : 'toolbar-search';
    return (
      <div className={c}>
        <button className="app-toolbar-btn search" onClick={this.toggle.bind(this)}></button>
        <div className="app-toolbar-fill" style={{display: this.state.visible ? 'block' : 'none', position:'relative',left:42, top:-42 }}>
          <Filter className="bnso-filter" title="гос. номер или номер БНСО" name="bnso_gos"/>
        </div>
      </div>
    )
  }

  toggle(){
    this.setState({visible: !this.state.visible});
  }

}
