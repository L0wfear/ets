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
      globalCheckboxState: ""
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

  handleRowCheck(id) {
    const updateData = {};
    if (this.state.checkedRows[id] === "checked") {
      updateData[id] = {$set: ""};
      this.setState({
        checkedRows: update(this.state.checkedRows, updateData)
      });
      if (this.state.globalCheckboxState) {
        this.setState({
          globalCheckboxState: ""
        });
      }
    } else {
      updateData[id] = {$set: "checked"};
      this.setState({
        checkedRows: update(this.state.checkedRows, updateData)
      });
      if (_.filter(_.values(this.state.checkedRows), (item) => item !== "checked").length === 0) {
        if (this.state.globalCheckboxState) {
          this.setState({
            globalCheckboxState: "checked"
          });
        }
      }
    }
  }

  globalCheckHandler(event) {
    if (_.filter(_.values(this.state.checkedRows), (item) => item !== "checked").length > 0 && this.state.globalCheckboxState === "") {
      this.setState({
        checkedRows: _.mapValues(this.state.checkedRows, function (item) { return "checked"; })
      });
    } else {
      this.setState({
        checkedRows: _.mapValues(this.state.checkedRows, function (item) { return ""; })
      })
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
      columnName: 'id',
      displayName: <div>{(() => {
        if (this.state.globalCheckboxState === "checked") {
          return <input type="checkbox" checked="checked" onChange={this.globalCheckHandler.bind(this)}></input>;
        } else {
          return <input type="checkbox" onChange={this.globalCheckHandler.bind(this)}></input>
        }
      }
      )()}</div>,
      sortable: false,
      customComponent: (value) => {
        const id = value.data;
        return <div>{(() => {
            if (this.state.checkedRows[id] === "checked") {
              return <input type="checkbox" checked="checked" onChange={this.handleRowCheck.bind(this, id)}></input>;
            } else {
              return <input type="checkbox" onChange={this.handleRowCheck.bind(this, id)}></input>;
            }
          })()}</div>
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

  processTableData(data, selected, selectField) {
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
  }

  componentWillReceiveProps(nextProps) {
    if (_.values(this.state.checkedRows).length === 0 && nextProps.results.length !== 0) {
      this.setState({
        checkedRows: this.processTableData(nextProps.results, nextProps.selected, nextProps.selectField).map((item) => item.isChecked)
      });
    }
  }

  render() {
    const { tableMeta, renderers, onRowSelected, selected, selectField, title = '', initialSort = 'id', multipleSelection = false } = this.props;
    const tableCols = multipleSelection ? ['id',...tableMeta.cols.map( c => c.name )] : tableMeta.cols.map( c => c.name );
    const columnMetadata = this.initializeMetadata(tableMeta, renderers);
		const rowMetadata = this.initializeRowMetadata();
    const data = _.cloneDeep(this.props.results);

    const results = this.processTableData(data);

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
