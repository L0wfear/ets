import React from 'react';

import ClickOutHandler from 'react-onclickout';
import FilterModal from './filter/FilterModal.jsx';
import FilterButton from './filter/FilterButton.jsx';
import Paginator from '../Paginator.jsx';
import Griddle from 'griddle-react';
import Div from '../Div.jsx';
import moment from 'moment';
import _ from 'lodash';
import update from 'react-addons-update';
import cx from 'classnames';

class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filterModalIsOpen: false,
      filterValues: {},
      checkedRows: {},
      globalCheckboxState: false
    };
  }

  closeFilter() {
    this.setState({filterModalIsOpen: false});
  }

  toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	saveFilter(filterValues) {
    if (typeof this.props.onAllRowsChecked === 'function') {
      this.props.onAllRowsChecked(_.reduce(this.props.results, (cur, val) => {cur[val.id] = val; return cur;}, {}), false);
    }
		this.setState({filterValues, globalCheckboxState: false});
	}

  cloneObject(object) {
    const clonedObject = {};
    for (let key of Object.keys(object)) {
      clonedObject[key] = object[key];
    }
    return clonedObject;
  }

  handleRowCheck(id, e) {
    console.log('hadleRowCheck is called');
    e.preventDefault();
    e.stopPropagation();
    let value = ! !!this.props.checked[id];
    let clonedData = _.cloneDeep(this.props.checked);
    clonedData[id] = value;
    if (value === false) delete clonedData[id];
    this.props.onRowChecked(id, value);
    this.setState({
      globalCheckboxState: Object.keys(clonedData).length === _(this.props.results).filter((r) => this.shouldBeRendered(r)).value().length ? true : false,
    });
  }

  globalCheckHandler(event) {
    let checked = _(this.props.results)
                  .filter((r) => this.shouldBeRendered(r))
                  .reduce((cur, val) => {cur[val.id] = val; return cur;}, {});
    this.props.onAllRowsChecked(checked, this.state.globalCheckboxState ? false : true);
    this.setState({globalCheckboxState: !this.state.globalCheckboxState}, () => {
      this.forceUpdate();
    });
    event.stopPropagation();
  }

  initializeMetadata(tableMeta = { cols: [] }, renderers = {}) {

  	const metadata = _.reduce(tableMeta.cols, (cur, col, i) => {

      if (col.display === false) {
        return cur;
      }

  		const metaObject = {
  			columnName: col.name,
  			displayName: col.caption,
  		};

  		if (typeof renderers[col.name] === 'function') {
  			metaObject.customComponent = renderers[col.name];
  		}

      if (typeof col.cssClassName !== 'undefined') {
  			metaObject.cssClassName = col.cssClassName || '';
  		}

  		cur.push(metaObject);
  		return cur;
  	}, this.props.multiSelection ? [{
      columnName: 'isChecked',
      displayName: <input id="checkedColumn" type="checkbox" onChange={this.globalCheckHandler.bind(this)}></input>,
      sortable: false,
      cssClassName: 'width60 text-center',
      customComponent: (props) => {
        const id = props.rowData.id;
        return <div><input type="checkbox" checked={this.props.checked[id]} onChange={this.handleRowCheck.bind(this, id)}></input></div>
      },
    }] : []);

  	return metadata;
  }

  initializeRowMetadata() {

  	const rowMetadata = {
      "bodyCssClassName": (rowData) => rowData.isSelected === true ? "selected-row" : "standard-row",
  	};

  	return rowMetadata;
  }

  shouldBeRendered(obj) {
    let isValid = true;
    _.mapKeys(this.state.filterValues, (value, key) => {
      if (key.indexOf('date') > -1 && !_.isArray(value)) {
        if (moment(obj[key]).format('YYYY-MM-DD') !== value) {
          isValid = false;
        }
      } else if (key.indexOf('date') > -1 && _.isArray(value)) {
        if (value.indexOf(moment(obj[key]).format('YYYY-MM-DD')) === -1) {
          isValid = false;
        }
      } else if (typeof value.getMonth === 'function') {
        if (obj[key] !== moment(value).format('YYYY-MM-DD H:mm')) {
          isValid = false;
        }
      } else if (_.isArray(value)) {
        if (value.indexOf(obj[key].toString()) === -1) {
          isValid = false;
        }
      } else {
        if (obj[key] != value) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  processSelected(selected, selectField, onRowSelected, el, i) {
    if (!selected || typeof onRowSelected === 'undefined') {
      el.isSelected = false;
      return el;
    }
    if (typeof selectField !== 'undefined') {
      el.isSelected = el[selectField] === selected[selectField];
    }
    el.isChecked = this.props.checked && this.props.checked[el.id] && this.shouldBeRendered(el);
    return el;
  }

  processTableData(data, selected, selectField, onRowSelected) {
    return _(data)
           .map(this.processSelected.bind(this, selected, selectField, onRowSelected))
           .filter(this.shouldBeRendered.bind(this))
           .value();
  }

  componentDidMount() {
    if (this.props.filterValues) {
      this.setState({filterValues: this.props.filterValues});
    }
  }

  componentWillReceiveProps(props) {
    if (props.checked) {
      // хак, т.к. гридл не умеет в обновление хедера
      let checked = Object.keys(props.checked).length === _(props.results).filter((r) => this.shouldBeRendered(r)).value().length;
      let el = document.getElementById('checkedColumn');
      if (el) el.checked = checked;
    }
  }

  render() {
    const { tableMeta, renderers, onRowSelected, selected, selectField, checked = {}, title = '', initialSort = 'id', initialSortAscending = true, multiSelection = false, noFilter } = this.props;
    let tableCols = multiSelection ? ['isChecked', ...tableMeta.cols.filter(c => c.display !== false).map( c => c.name )] : tableMeta.cols.filter(c => c.display !== false).map( c => c.name );
    const columnMetadata = this.initializeMetadata(tableMeta, renderers);
		const rowMetadata = this.initializeRowMetadata();
    const data = _.cloneDeep(this.props.results);

    const results = this.processTableData(data, selected, selectField, onRowSelected);

    return (
      <Div className="data-table">
        <Div className="some-header" hidden={noFilter}>{title}
          <div className="waybills-buttons">
            <ClickOutHandler onClickOut={this.closeFilter.bind(this)}>
              <div className="filter-wrap">
                <FilterButton direction={'left'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
                <FilterModal onSubmit={this.saveFilter.bind(this)}
                           show={this.state.filterModalIsOpen}
                           onHide={this.closeFilter.bind(this)}
                           values={this.state.filterValues}
                           direction={'left'}
                           tableMeta={this.props.tableMeta}
                           tableData={this.props.results} />
              </div>
            </ClickOutHandler>
            {this.props.children}
          </div>
        </Div>
        <Griddle results={results}
                 initialSort={initialSort}
                 initialSortAscending={initialSortAscending}
								 columnMetadata={columnMetadata}
								 columns={tableCols}
								 resultsPerPage={15}
								 useCustomPagerComponent={true}
								 customPagerComponent={this.props.serverPagination ? <Div/> : Paginator}
								 onRowClick={onRowSelected}
							   rowMetadata={rowMetadata}
								 noDataMessage={noFilter ? '' : 'Нет данных'}/>
      </Div>
    );
  }
}

export default Table;
