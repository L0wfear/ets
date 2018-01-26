import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Button, Glyphicon, Collapse } from 'react-bootstrap';
import { isEmpty } from 'utils/functions';
import _ from 'lodash';
import Div from '../../Div.jsx';
import FilterRow from './FilterRow.jsx';

@autobind
export default class Filter extends React.Component {

  static get propTypes() {
    return {
      values: PropTypes.object,
      show: PropTypes.bool,
      tableData: PropTypes.array,
      onHide: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      filterValues: props.values || {},
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ filterValues: props.values });
  }

  // TODO сделано для adv...-select-like
  // из-за с проблем с именем
  // переделать
  getName(name, type) {
    switch (type) {
      case 'advanced-select-like': return `${name}__like`;
      default: return name;
    }
  }

  handleFilterValueChange(key, e) {
    const filterValues = { ...this.state.filterValues };

    if (!e || isEmpty(e.target ? e.target.value : e)) {
      delete filterValues[key];
    } else {
      filterValues[key] = e.target ? e.target.value : e;
    }

    this.setState({ filterValues });
  }

  handleFilterMultipleValueChange(key, v) {
    const filterValues = { ...this.state.filterValues };
    const data = !isEmpty(v) ? v.split('$') : [];

    filterValues[key] = data;
    if (data.length === 0) {
      delete filterValues[key];
    }

    this.setState({ filterValues });
  }

  submit() {
    const filterValues = _.reduce(this.state.filterValues, (cur, v, k) => {
      if (typeof v !== 'undefined') {
        if (typeof v === 'string') {
          if (v.length > 0) {
            cur[k] = v;
          }
        } else {
          cur[k] = v;
        }
      }
      return cur;
    }, {});
    this.props.onSubmit(filterValues);
  }

  reset() {
    this.props.onSubmit({});
  }

  checkDisabledButton(filterValues) {
    return Object.keys(filterValues).length === 0;
  }

  render() {
    const { filterValues } = this.state;
    const { tableData, options } = this.props;
    
    const filterRows = options.map((option, i) => {
      const { filter = {}, name, displayName } = option;
      const { type, labelFunction, options } = filter;
      
      return (
        <FilterRow
          tableData={tableData}
          key={i}
          value={filterValues[this.getName(name, type)]}
          type={type}
          name={this.getName(name, type)}
          serverFieldName={filter.serverFieldName}
          labelFunction={labelFunction}
          availableOptions={options}
          displayName={displayName}
          onChange={(...args) => this.handleFilterValueChange(this.getName(name, type), ...args)}
          onMultiChange={(...args) => this.handleFilterMultipleValueChange(this.getName(name, type), ...args)}
        />
      );
    });

    return (
      <Collapse in={this.props.show}>
        <Div className="filter-container">
          <Div className="filter-buttons">
            <Button onClick={this.submit}>Применить</Button>
            <Button onClick={this.reset} disabled={this.checkDisabledButton(filterValues)}>Сброс</Button>
            <span className="filter-close" onClick={this.props.onHide}><Glyphicon glyph="remove" /></span>
          </Div>
          {filterRows}
        </Div>
      </Collapse>
    );
  }

}
