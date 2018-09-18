import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { FormControl } from 'react-bootstrap';
import _ from 'lodash';

import FilterInput from 'components/ui/input/FilterInput/FilterInput';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';
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
      tableData: PropTypes.array,
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
      tableData: [],
    };
  }

  // TODO добавить в FilterInput type и поддержку select
  render() {
    const {
      availableOptions,
      byLabel = '',
      displayName,
      labelFunction,
      name,
      onChange,
      onMultiChange,
      tableData,
      type,
    } = this.props;
    let { value } = this.props;

    let input = (
      <div className="form-group">
        <FormControl type="text" value={value || ''} onChange={onChange} />
      </div>
    );
    if (type) {
      if (type === 'select' || type === 'multiselect' || type === 'advanced-select-like') {
        let options = availableOptions || _(tableData)
                        .uniqBy(name)
                        .map(d => ({
                          value: typeof d[name] === 'boolean' ? +d[name] : d[name],
                          label: labelFunction(d[byLabel || name]),
                        }))
                        .filter(d => d.label !== null)
                        .value();
        if (type === 'select' || type === 'advanced-select-like') {
          if (!!value && !_.find(options, o => o.value === value)) {
            value = null;
          }
          if (name === 'operation_id') {
            options = options.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
          }
          input = <ReactSelect options={options} value={value} onChange={onChange} />;
        } else if (type === 'multiselect') {
          if (value && !!value.length) value = value.filter(v => _.find(options, o => o.value === v));
          input = (
            <Div className="filter-multiselect-container">
              <ReactSelect options={options} multi delimiter={'$'} value={value} onChange={onMultiChange} />
            </Div>
          );
        }
      }
      if (type === 'advanced-number') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="number" onChange={onChange} lang="en" />;
      }
      if (type === 'advanced-string') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="string" onChange={onChange} />;
      }
      if (type === 'advanced-string-like') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="string" onChange={onChange} single filterType="like" />;
      }
      if (type === 'advanced-date') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="date" onChange={onChange} />;
      }
      if (type === 'advanced-datetime') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="datetime" onChange={onChange} />;
      }
      if (type === 'date') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="date" onChange={onChange} single />;
      }
      if (type === 'datetime') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="datetime" onChange={onChange} single />;
      }
      if (type === 'date_interval') {
        input = <IntervalPicker interval={value} onChange={onChange} />;
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
