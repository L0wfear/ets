import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as Collapse from 'react-bootstrap/lib/Collapse';
import * as Button from 'react-bootstrap/lib/Button';

import { isEmpty } from 'utils/functions';
import _ from 'lodash';
import Div from '../../Div';
import FilterRow from './FilterRow';

export default class Filter extends React.Component {
  static get propTypes() {
    return {
      values: PropTypes.object,
      show: PropTypes.bool,
      tableData: PropTypes.array,
      onHide: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
      options: PropTypes.array,
      entity: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      propsFilterValues: props.values,
      filterValues: props.values || {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { values } = nextProps;

    if (prevState.propsFilterValues !== values) {
      return {
        propsFilterValues: values,
        filterValues: values,
      };
    }

    return null;
  }

  // TODO сделано для adv...-select-like
  // из-за с проблем с именем
  // переделать
  getName = (name, type) => {
    switch (type) {
      case 'advanced-select-like': return `${name}__like`;
      default: return name;
    }
  }

  handleFilterValueChange = (key, e) => {
    const { filterValues: { ...filterValues } } = this.state;

    if (!e || isEmpty(e.target ? e.target.value : e)) {
      delete filterValues[key];
    } else {
      const data = e.target ? e.target.value : e;
      const { filter } = this.props.options.find(({ name }) => key.match(`^${name}`));

      filterValues[key] = {
        type: filter.type || 'text',
        value: data,
      };
    }

    this.setState({ filterValues });
  }

  handleFilterMultipleValueChange(key, v) {
    const filterValues = { ...this.state.filterValues };
    const data = !isEmpty(v) ? v : [];
    const { filter } = this.props.options.find(({ name }) => key.match(`^${name}`));

    // для формата под новую таблицу
    filterValues[key] = {
      type: filter.type || '',
      value: data,
    };

    if (data.length === 0) {
      delete filterValues[key];
    }

    this.setState({ filterValues });
  }

  submit= () => {
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

  reset = () => this.props.onSubmit({});

  checkDisabledButton = filterValues => Object.keys(filterValues).length === 0;

  render() {
    const { filterValues } = this.state;
    const { tableData, options: filters } = this.props;
    const filterRows = filters.map((option, i) => {
      const { filter = {}, name, displayName } = option;
      const { type, labelFunction, options, byKey, byLabel } = filter;
      return (
        <FilterRow
          tableData={tableData}
          entity={this.props.entity}
          key={i}
          value={(filterValues[this.getName(byKey || name, type)] || {}).value}
          type={type}
          name={this.getName(byKey || name, type)}
          byLabel={byLabel}
          serverFieldName={filter.serverFieldName}
          labelFunction={labelFunction}
          availableOptions={options}
          displayName={displayName}
          onChange={(...args) => this.handleFilterValueChange(this.getName(byKey || name, type), ...args)}
          onMultiChange={(...args) => this.handleFilterMultipleValueChange(this.getName(byKey || name, type), ...args)}
        />
      );
    });

    return (
      <Collapse in={this.props.show}>
        <Div className="filter-container">
          <Div className="filter-buttons">
            <Button id="apply-filter" onClick={this.submit}>Применить</Button>
            <Button id="reset-filter" onClick={this.reset} disabled={this.checkDisabledButton(filterValues)}>Сброс</Button>
            <span id="filter-close" className="filter-close" onClick={this.props.onHide}><Glyphicon glyph="remove" /></span>
          </Div>
          {filterRows}
        </Div>
      </Collapse>
    );
  }
}
