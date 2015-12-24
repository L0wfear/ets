import React, { Component } from 'react';
import _ from 'lodash';
import Div from '../Div.jsx';


let HeaderCell = ({renderer, children, value}) => {
	if (typeof renderer === 'function') {
		return <th className="ets-table-header-cell">{renderer(value)}</th>;
	}
	return <th className="ets-table-header-cell">{children}</th>;
};

export default class Table extends Component {

	static defaultProps = {
		headerRenderers: {},
	}

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
  	return (
			<tr className="ets-table-header">
				{this.props.columnCaptions.map((o, i) => {
					const renderer = this.props.headerRenderers[this.props.tableCols[i]];
					return <HeaderCell key={i} renderer={renderer} value={o}>{o}</HeaderCell>;
				})}
			</tr>
		);
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
		const { usePagination = true } = this.props;
    const rows = page.data.map((o, i) =>
			<Row renderers={this.props.cellRenderers}
		    	 key={i}
		    	 cells={o}
					 index={i}
		       tableCols={this.props.tableCols}
		    	 selected={o.ID ? this.state.selectedRow === o.ID : this.state.selectedRow === i}
		    	 handleClick={this.onRowClick.bind(this)}/>
		);

    return (
			<div className="ets-table">
				{/*<p className="ets-table-caption">{this.props.title}</p>*/}
				<table>
					<tbody>
				 		{this.renderHeader()}
						{rows}
					</tbody>
				</table>
				<Div className="ets-table-pagination" hidden={!usePagination}>
					{<Pager {...this.getPage()}/>}
				</Div>
	 		</div>
		);
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
        cells.push(<td key={cells.length}>{v}</td>)
      } else {
        //console.log('rendered status')
        cells.push(<td key={cells.length}>{renderers[col](v, props.cells, props.index)}</td>)
      }
    })
  } else {
  	_.each(props.cells, (v, k) => {
  		if (k !== 'id') {
  			if (renderers[k] === undefined) {
  				cells.push(<td key={cells.length}>{v}</td>)
  			} else {
  				//console.log('rendered status')
  				cells.push(<td key={cells.length}>{renderers[k](v)}</td>)
  			}
  		}
  	})
  }


	let cn = "ets-table-row" + (props.selected ? ' selected' : '');

	return <tr className={cn} onClick={props.handleClick.bind(this, props.cells.ID || props.index)}>{cells}</tr>
}

let PageLink = (props) => <span className="table-page-link" onClick={props.handleClick.bind(this,props.pageNum)}>
											{props.children}
										</span>;

let Pager = (props) => {

  let links = [];

  if (props.currentPage > 1) {
    if (props.currentPage > 2) {
      links.push(<PageLink key={links.length} handleClick={props.handleClick} pageNum={1}>-</PageLink>)
      links.push(' ')
    }
    links.push(<PageLink key={links.length} handleClick={props.handleClick} pageNum={props.currentPage - 1}>‹</PageLink>)
    links.push(' ')
  }

  links.push(<span key={links.length} className="table-current-page">Страница {props.currentPage} из {props.numPages}</span>)

  if (props.currentPage < props.numPages) {
    links.push(' ')
    links.push(<PageLink key={links.length} handleClick={props.handleClick} pageNum={props.currentPage + 1}>›</PageLink>)
    if (props.currentPage < props.numPages - 1) {
      links.push(' ')
      links.push(<PageLink key={links.length} handleClick={props.handleClick} pageNum={props.numPages}>»</PageLink>)
    }
  }

  return <div className="pagination">
			  	 {links}
			   </div>
}
