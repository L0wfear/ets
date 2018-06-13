import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { FormControl } from 'react-bootstrap';
import _ from 'lodash';

import FilterInput from 'components/ui/input/FilterInput/FilterInput';
import EtsSelect from 'components/ui/input/EtsSelect';
import IntervalPicker from 'components/ui/input/IntervalPicker';
import Div from 'components/ui/Div.jsx';

@autobind
export default class FilterRow extends React.Component {

  static get propTypes() {
    return {
      value: PropTypes.any,
      type: PropTypes.string,
      labelFunction: PropTypes.func,
      availableOptions: PropTypes.array,
      data: PropTypes.array,
      name: PropTypes.string,
      byLabel: PropTypes.string,
      displayName: PropTypes.string,
      onChange: PropTypes.func,
      onMultiChange: PropTypes.func,
    };
  }

  static get defaultProps() {
    return {
      labelFunction: v => v,
      data: [],
    };
  }

  onChange = (...arg) => this.props.onChange(this.props.name, this.props.type, ...arg)
  onMultiChange = (...arg) => this.props.onMultiChange(this.props.name, this.props.type, ...arg)

  // TODO добавить в FilterInput type и поддержку select
  render() {
    const {
      availableOptions,
      byLabel = '',
      displayName,
      labelFunction,
      name,
      data,
      type,
    } = this.props;
    let { value } = this.props;

    let input = (
      <div className="form-group">
        <FormControl type="text" value={value} onChange={this.onChange} />
      </div>
    );
    if (type) {
      if (type === 'select' || type === 'multiselect' || type === 'multiselect-boolean' || type === 'advanced-select-like') {
        let options = availableOptions || _(data)
                        .uniqBy(name)
                        .map(d => ({
                          value: typeof d[name] === 'boolean' ? +d[name] : d[name],
                          label: labelFunction(d[byLabel || name]),
                        }))
                        .filter(d => !!d.label)
                        .value();
        if (type === 'select' || type === 'advanced-select-like') {
          if (!!value && !_.find(options, o => o.value === value)) {
            value = null;
          }
          if (name === 'operation_id') {
            options = options.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
          }
          input = <EtsSelect options={options} value={value} onChange={this.onChange} />;
        } else if (type === 'multiselect' || type === 'multiselect-boolean') {
          if (value && !!value.length) value = value.filter(v => _.find(options, o => o.value === v));
          input = (
            <Div className="filter-multiselect-container">
              <EtsSelect options={options} multi delimiter={'$'} value={value} onChange={this.onMultiChange} />
            </Div>
          );
        }
      }
      if (type === 'advanced-number') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="number" onChange={this.onChange} />;
      }
      if (type === 'advanced-string') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="string" onChange={this.onChange} />;
      }
      if (type === 'advanced-string-like') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="string" onChange={this.onChange} single filterType="like" />;
      }
      if (type === 'advanced-date') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="date" onChange={this.onChange} />;
      }
      if (type === 'advanced-datetime') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="datetime" onChange={this.onChange} />;
      }
      if (type === 'date') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="date" onChange={this.onChange} single />;
      }
      if (type === 'datetime') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="datetime" onChange={this.onChange} single />;
      }
      if (type === 'date_interval') {
        input = <IntervalPicker interval={value} onChange={this.onChange} />;
      }
    }

    return (
      <Div className="filter-row">
        <label htmlFor="input">{displayName}</label>
        {input}
      </Div>
    );
  }
}
