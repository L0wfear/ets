import React from 'react';

import ClickOutHandler from 'react-onclickout';
import FilterModal from './filter/FilterModal.jsx';
import FilterButton from './filter/FilterButton.jsx';
import Paginator from '../Paginator.jsx';
import Griddle from 'griddle-react';
import Div from '../Div.jsx';
import moment from 'moment';
import _ from 'lodash';

class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filterModalIsOpen: false,
      filterValues: {},
    };
  }

  closeFilter() {
    this.setState({filterModalIsOpen: false});
  }

  toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	saveFilter(filterValues) {
		//console.info(`SETTING FILTER VALUES`, filterValues);
		this.setState({filterValues});
	}

  initializeMetadata(tableMeta = { cols: [] }, renderers = {}) {
  	const metadata = _.reduce(tableMeta.cols, (cur, col, i) => {
  		const metaObject = {
  			columnName: col.name,
  			displayName: col.caption,
  		};

  		if (typeof renderers[col.name] === 'function') {
  			metaObject.customComponent = renderers[col.name];
  		}

      if (typeof col.cssClassName !== 'undefined') {
  			metaObject.cssClassName = col.cssClassName;
  		}

  		cur.push(metaObject);
  		return cur;
  	}, []);

  	return metadata;
  }

  initializeRowMetadata() {

  	const rowMetadata = {
      "bodyCssClassName": function(rowData) {
        if (rowData.isSelected === true) {
          return "selected-row";
        }
        return "standard-row";
      }
  	};

  	return rowMetadata;
  }

  componentDidMount() {
    if (this.props.filterValues) {
      this.setState({filterValues: this.props.filterValues});
    }
  }

  render() {
    const { tableMeta, renderers, onRowSelected, selected, selectField, title = '', initialSort = 'id' } = this.props;
    const tableCols = tableMeta.cols.map( c => c.name );
    const columnMetadata = this.initializeMetadata(tableMeta, renderers);
		const rowMetadata = this.initializeRowMetadata();
    const data = _.cloneDeep(this.props.results);

    const results = _(data).map( (d, i) => {
			if (!selected || typeof onRowSelected === 'undefined') {
        d.isSelected = false;
        return d;
      }
      if (typeof selectField !== 'undefined') {
        d.isSelected = d[selectField] === selected[selectField];
      }
			return d;
		}).filter((obj) => {
  		let isValid = true;

  		_.mapKeys(this.state.filterValues, (value, key) => {

  			if (typeof value.getMonth === 'function') {
  				if (obj[key] !== moment(value).format('YYYY-MM-DD H:mm')) {
  					isValid = false;
  				}
  			} else {
  				if (obj[key] != value) {
  					isValid = false;
  				}
  			}
		  });

			return isValid;
		}).value();

    return (
      <Div className="data-table">
        <div className="some-header">{title}
          <div className="waybills-buttons">
            <ClickOutHandler onClickOut={this.closeFilter.bind(this)}>
              <FilterButton direction={'left'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
              <FilterModal onSubmit={this.saveFilter.bind(this)}
                           show={this.state.filterModalIsOpen}
                           onHide={this.closeFilter.bind(this)}
                           values={this.state.filterValues}
                           direction={'left'}
                           tableMeta={this.props.tableMeta}
                           tableData={this.props.results} />
            </ClickOutHandler>
            {this.props.children}
          </div>
        </div>
        <Griddle results={results}
                 initialSort={initialSort}
								 columnMetadata={columnMetadata}
								 columns={tableCols}
								 resultsPerPage={15}
								 useCustomPagerComponent={true}
								 customPagerComponent={Paginator}
								 onRowClick={onRowSelected}
							   rowMetadata={rowMetadata}
								 noDataMessage={'Нет данных'}/>
      </Div>
    );
  }
}

export default Table;
