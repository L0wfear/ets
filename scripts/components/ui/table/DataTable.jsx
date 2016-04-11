import React from 'react';


import ClickOutHandler from 'react-onclickout';
import Filter from './filter/Filter.jsx';
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
      globalCheckboxState: false,
      isHierarchical: props.isHierarchical,
      initialSort: 'id',
      initialSortAscending: true
    };
  }

  closeFilter() {
    if (this.state.filterModalIsOpen === true) {
      this.setState({filterModalIsOpen: false});
    }
  }

  toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	saveFilter(filterValues) {
    if (typeof this.props.onAllRowsChecked === 'function') {
      this.props.onAllRowsChecked(_.reduce(this.props.results, (cur, val) => {cur[val.id] = val; return cur;}, {}), false);
    }
    console.info('setting filter values', filterValues);
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

  initializeMetadata(tableMetaCols = [], renderers = {}) {

  	const metadata = _.reduce(tableMetaCols, (cur, col, i) => {

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

  getTypeByKey(key) {
    let col = _.find(this.props.tableMeta.cols, col => col.name === key);
    let colFilterType = col.filter && col.filter.type ? col.filter.type : '';
    return colFilterType;
  }

  shouldBeRendered(obj) {
    // Здесь проводится проверка на то, фильтруется ли объект
    // если в результате isValid === false, то объект не рендерится в таблице
    // проверка берется по this.state.filterValues
    let isValid = true;
    _.mapKeys(this.state.filterValues, (value, key) => {

      if (/(timestamp|date|birthday)/.test(key) && !_.isArray(value)) {
        if (moment(obj[key]).format(global.APP_DATE_FORMAT) !== moment(value).format(global.APP_DATE_FORMAT)) {
          isValid = false;
        }
      } else if (key.indexOf('date') > -1 && _.isArray(value) && this.getTypeByKey(key) !== 'date_interval') {
        if (value.indexOf(moment(obj[key]).format(global.APP_DATE_FORMAT)) === -1) {
          isValid = false;
        }
      } else if (key.indexOf('date') > -1 && _.isArray(value) && this.getTypeByKey(key) === 'date_interval') {
          let intervalPickerDate1 = moment(value[0]).toDate().getTime() || 0;
          let intervalPickerDate2 = moment(value[1]).toDate().getTime() || Infinity;
          let valueDate = moment(obj[key]).toDate().getTime();
          if (!(intervalPickerDate1 < valueDate && valueDate < intervalPickerDate2)) {
            isValid = false;
          }
      } else if (_.isArray(value)) {
        if (_.isArray(obj[key])) {
          if (!_.find(obj[key], el => value.indexOf(el.id.toString()) > -1)) {
            isValid = false;
          }
        } else if (value.indexOf(obj[key].toString()) === -1) {
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
    el.isChecked = this.props.checked && this.props.checked[el.id] && this.shouldBeRendered(el);
    if (!selected || typeof onRowSelected === 'undefined') {
      el.isSelected = false;
      return el;
    }
    if (typeof selectField !== 'undefined') {
      el.isSelected = el[selectField] === selected[selectField];
    }
    return el;
  }

  processTableData(data, selected, selectField, onRowSelected) {
    return _(data)
           .map(this.processSelected.bind(this, selected, selectField, onRowSelected))
           .filter(this.shouldBeRendered.bind(this))
           .value();
  }

  componentWillMount() {
    // Здесь производится инициализация начальной сортировки для того,
    // чтобы гриддл мог корректно отобразить хедер при первом рендеринге
    // важно устанавливать сортировку именно в willMount!
    let { initialSort = 'id', initialSortAscending = true } = this.props;

    this.setState({initialSort, initialSortAscending});
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

    let { initialSort, initialSortAscending } = this.state;


    if (props.initialSort && props.initialSort !== this.state.initialSort) {
      initialSort = props.initialSort;
    }

    if (props.initialSortAscending && props.initialSortAscending !== this.state.initialSortAscending) {
      initialSortAscending = props.initialSortAscending;
    }

    this.setState({initialSort, initialSortAscending});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.state.isHierarchical) return true;

    return !_.isEqual(nextProps.results, this.props.results);
  }

  handleChangeSort(sortingColumnName, ascendingSort) {
    this.setState({
      initialSort: sortingColumnName,
      initialSortAscending: ascendingSort,
    })
  }

  handleKeyPress(data, keyCode) {
    let direction = 0;
    if (keyCode === 13 && this.props.selected !== null) {
    }
    if (keyCode === 40) {
      direction = +1;
 		}
 		if (keyCode === 38) {
      direction = -1;
 		}
    let selected = _.find(data, el => el[this.props.selectField] === this.props.selected[this.props.selectField]);
    let newSelected = _.find(data, el => el.rowNumber === selected.rowNumber + direction);

    this.props.onRowSelected({
      props: {
        data: newSelected,
        fromKey: true,
      }
    });
  }

  render() {
    const { tableMeta, renderers, onRowSelected, selected, selectField, checked = {}, title = '', multiSelection = false, noFilter, enumerated = true } = this.props;
    const { initialSort, initialSortAscending } = this.state;

    let tableMetaCols = _.cloneDeep(tableMeta.cols);
    let tableCols = tableMetaCols.filter(c => c.display !== false).map(c => c.name);
    let data = _.cloneDeep(this.props.results);

    if (multiSelection) {
      tableCols = ['isChecked', ...tableCols];
    }

    let results = this.processTableData(data, selected, selectField, onRowSelected);

    if (enumerated === true && !this.state.isHierarchical) {
      tableCols = ['rowNumber', ...tableCols];
      tableMetaCols = [{
        name: 'rowNumber',
        caption: '№',
        cssClassName: 'width60',
        filter: false
      }, ...tableMetaCols];
    }

    const columnMetadata = this.initializeMetadata(tableMetaCols, renderers);
		const rowMetadata = this.initializeRowMetadata();

    return (
      <Div className="data-table">
        <Div className="some-header" hidden={noFilter}>{title}
          <div className="waybills-buttons">
            <ClickOutHandler onClickOut={this.closeFilter.bind(this)}>
              <Filter direction={'left'}
                      show={this.state.filterModalIsOpen}
                      onSubmit={this.saveFilter.bind(this)}
                      onClick={this.toggleFilter.bind(this)}
                      onHide={this.closeFilter.bind(this)}
                      active={_.keys(this.state.filterValues).length}
                      values={this.state.filterValues}
                      options={tableMetaCols.filter(el => el.filter !== false)}
                      tableData={this.props.results}
                      disabled={this.props.isHierarchical}
                      active={_.keys(this.state.filterValues).length}
                      className="filter-wrap"/>
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
                 externalChangeSort={this.handleChangeSort.bind(this)}
								 customPagerComponent={this.props.serverPagination ? <Div/> : Paginator}
								 onRowClick={onRowSelected}
							   rowMetadata={rowMetadata}
                 onKeyPress={this.handleKeyPress.bind(this)}
								 noDataMessage={noFilter ? '' : 'Нет данных'}/>
      </Div>
    );
  }
}

export default Table;
