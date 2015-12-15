import React, { Component } from 'react';
import _ from 'lodash';


let HeaderCell = (props) => {
	return <th className="ets-table-header-cell">{props.children}</th>
};

export default class Table extends Component {

	constructor(props){
		super(props)
		this.state = {
			currentPage: 1,
			selectedRow: null
		}
	}

  componentWillReceiveProps(nextProps) {
  //	this.setPage(1);
  }

  renderHeader() {
  	return <tr className="ets-table-header">{this.props.columnCaptions.map((o) => <HeaderCell>{o}</HeaderCell>)}</tr>
  }

  getPage() {

    let start = this.props.pageSize * (this.state.currentPage - 1)
    let end = start + this.props.pageSize;

    return {
      currentPage: this.state.currentPage,
      data: this.props.data.slice(start, end),
      numPages: this.getNumPages(),
      handleClick: this.setPage.bind(this)
    }
  }

  getNumPages() {
    let num = Math.floor(this.props.data.length / this.props.pageSize);
    if (this.props.data.length % this.props.pageSize > 0) {
      num++;
    }
    return num;
  }

  setPage(num) {
  	console.log( 'setpage')
    this.setState({
      currentPage: num
    })
  }

  onRowClick(id) {
  	if (this.props.onRowSelected !== undefined ){
	  	this.setState({
	  		selectedRow: id
	  	})
	  	this.props.onRowSelected(id)
  	}
  }

  render() {

    let page = this.getPage();

    let rows = [];
    page.data.forEach((o, i) => rows.push(<Row 
    	renderers={this.props.cellRenderers} 
    	key={i} 
    	cells={o} 
      tableCols={this.props.tableCols}
    	selected={this.state.selectedRow === o.id} 
    	handleClick={this.onRowClick.bind(this)}/>));

    return (<div className="ets-table">
			{/*<p className="ets-table-caption">{this.props.title}</p>*/}
			<table>
				<tbody>
			 {this.renderHeader()}	
				{rows}
				</tbody>
			</table>
			<div className="ets-table-pagination">
				{<Pager {...this.getPage()}/>}
			</div>
	 	</div>)
  //...
  }
}

let Cell = (props) => <td className="ets-table-cell"> {props.children} </td>

let Row = (props) => {
	let cells = [];
	let renderers = !!props.renderers ? props.renderers : {};

  if (props.tableCols !== undefined ) {
    _.each(props.tableCols, (col) => {
      let v = props.cells[col];
      if (renderers[col] === undefined) {
        cells.push(<td>{v}</td>)
      } else {
        console.log('rendered status')
        cells.push(<td>{renderers[col](v)}</td>)
      }
    })
  } else {
  	_.each(props.cells, (v, k) => {
  		if (k !== 'id') {
  			if (renderers[k] === undefined) {
  				cells.push(<td>{v}</td>)
  			} else {
  				console.log('rendered status')
  				cells.push(<td>{renderers[k](v)}</td>)
  			}
  		}
  	})
  }
	

	let cn = "ets-table-row" + (props.selected ? ' selected' : '');

	return <tr className={cn} onClick={props.handleClick.bind(this, props.cells.id)}>{cells}</tr>
}

let PageLink = (props) => <span className="table-page-link" onClick={props.handleClick.bind(this,props.pageNum)}>
											{props.children}
										</span>;

let Pager = (props) => {

  let links = [];

  if (props.currentPage > 1) {
    if (props.currentPage > 2) {
      links.push(<PageLink handleClick={props.handleClick} pageNum={1}>-</PageLink>)
      links.push(' ')
    }
    links.push(<PageLink handleClick={props.handleClick} pageNum={props.currentPage - 1}>‹</PageLink>)
    links.push(' ')
  }

  links.push(<span className="table-current-page">Страница {props.currentPage} из {props.numPages}</span>)

  if (props.currentPage < props.numPages) {
    links.push(' ')
    links.push(<PageLink handleClick={props.handleClick} pageNum={props.currentPage + 1}>›</PageLink>)
    if (props.currentPage < props.numPages - 1) {
      links.push(' ')
      links.push(<PageLink handleClick={props.handleClick} pageNum={props.numPages}>»</PageLink>)
    }
  }

  return <div className="pagination">
			  	 {links}
			   </div>
}
