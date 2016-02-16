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
		this.setState({filterValues});
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
    const clonedData = this.cloneObject(this.state.checkedRows);
    if (this.state.checkedRows[id]) {
      clonedData[id] = false;
      this.props.onRowChecked(id, false);

      this.setState({
        checkedRows: clonedData,
        globalCheckboxState: false
      });
    } else {
      clonedData[id] = true;
      this.props.onRowChecked(id, true);

      if (Object.keys(clonedData).map((key) => clonedData[key]).filter((value) => !value).length === 0) {
        this.setState({
          checkedRows: clonedData,
          globalCheckboxState: true
        }, () => {
          this.forceUpdate();
        });
      } else {
        this.setState({
          checkedRows: clonedData,
          globalCheckboxState: false
        }, () => {
          this.forceUpdate();
        });
      }
    }
  }

  globalCheckHandler(event) {
    const clonedData = this.cloneObject(this.state.checkedRows);
    if (_.filter(_.values(this.state.checkedRows), (item) => !item).length > 0 && !this.state.globalCheckboxState) {
      for (let key of Object.keys(clonedData)) {
        if (this.shouldBeRendered(_.find(this.props.results, (result) => result.id.toString() === key.toString()))) {
          clonedData[key] = true;
        }
      }
      this.props.onAllRowsChecked(this.props.results.filter((item) => this.shouldBeRendered(item)), true);
      this.setState({
        checkedRows: clonedData,
        globalCheckboxState: true
      });
    } else {
      for (let key of Object.keys(clonedData)) {
        if (this.shouldBeRendered(_.find(this.props.results, (result) => result.id.toString() === key.toString()))) {
          clonedData[key] = false;
        }
      }
      this.props.onAllRowsChecked(this.props.results.filter((item) => this.shouldBeRendered(item)), false);
      this.setState({
        checkedRows: clonedData,
        globalCheckboxState: false
      });
    }
    event.stopPropagation();
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
  	}, this.props.multiSelection ? [{
      columnName: 'isChecked',
      displayName: <input type="checkbox" checked={this.state.globalCheckboxState} onChange={this.globalCheckHandler.bind(this)}></input>,
      sortable: false,
      cssClassName: 'width60 text-center',
      customComponent: (value) => {
        const id = value.rowData.id;
        return <div><input type="checkbox" checked={this.state.checkedRows[id]} onChange={this.handleRowCheck.bind(this, id)}></input></div>
      }
    }] : []);

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

  processTableData(data, selected, selectField, onRowSelected) {
    return _(data).map( (d, i) => {
      if (!selected || typeof onRowSelected === 'undefined') {
        d.isSelected = false;
        return d;
      }
      if (typeof selectField !== 'undefined') {
        d.isSelected = d[selectField] === selected[selectField];
      }
      d.isChecked = this.state.checkedRows[d.id];
      return d;
    }).filter(this.shouldBeRendered.bind(this)).value();
  }

  componentWillReceiveProps(nextProps) {
    nextProps.results.forEach((d) => {
      if (!this.shouldBeRendered(d)) {
        this.state.checkedRows[d.id] = undefined;
      } else {
        this.state.checkedRows[d.id] = this.state.checkedRows[d.id] === undefined ? false : this.state.checkedRows[d.id];
      }
    });
  }

  componentDidMount() {
    if (this.props.filterValues) {
      this.setState({filterValues: this.props.filterValues});
    }
  }

  render() {
    const { tableMeta, renderers, onRowSelected, selected, selectField, title = '', initialSort = 'id', initialSortAscending = true, multiSelection = false, noFilter } = this.props;
    const tableCols = multiSelection ? ['isChecked',...tableMeta.cols.map( c => c.name )] : tableMeta.cols.map( c => c.name );
    const columnMetadata = this.initializeMetadata(tableMeta, renderers);
		const rowMetadata = this.initializeRowMetadata();
    const data = _.cloneDeep(this.props.results);

    const results = this.processTableData(data, selected, selectField, onRowSelected);

    return (
      <Div className="data-table">
        <Div className="some-header" hidden={noFilter}>{title}
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
