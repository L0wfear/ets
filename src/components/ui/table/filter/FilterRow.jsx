import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Input } from 'react-bootstrap';
import _ from 'lodash';

import FilterInput from 'components/ui/input/FilterInput/FilterInput';
import EtsSelect from 'components/ui/input/EtsSelect';
import Div from '../../Div.jsx';
import IntervalPicker from 'components/ui/input/IntervalPicker';

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
    const { name, displayName, type, labelFunction,
      availableOptions, onChange, onMultiChange, tableData } = this.props;
    let { value } = this.props;
    let input = <Input type="text" value={value} onChange={onChange} />;

    if (type) {
      if (type === 'select' || type === 'multiselect' || type === 'advanced-select-like') {
        let options = availableOptions || _(tableData)
                        .uniqBy(name)
                        .map(d => ({
                          value: typeof d[name] === 'boolean' ? +d[name] : d[name],
                          label: labelFunction(d[name]),
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
          if (type === 'advanced-select-like') {
            input = <EtsSelect options={options} value={value} onChange={onChange} fieldName={name} selectType="like" />;
          } else {
            input = <EtsSelect options={options} value={value} onChange={onChange} />;
          }
        } else if (type === 'multiselect') {
          if (value && !!value.length) value = value.filter(v => _.find(options, o => o.value+'' === v));
          input = (
            <Div className="filter-multiselect-container">
              <EtsSelect options={options} multi delimiter={'$'} value={value} onChange={onMultiChange} />
            </Div>
          );
        }
      }
      if (type === 'advanced-number') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="number" onChange={onChange} />;
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
        // input = <Datepicker className="filter-datepicker" date={value} onChange={v => (console.log(v), onChange(moment(v).format('YYYY-MM-DD')))} time={false} />;
      }
      if (type === 'datetime') {
        input = <FilterInput filterValue={value} fieldName={name} inputType="datetime" onChange={onChange} single />;
        // input = <Datepicker className="filter-datepicker" date={value} onChange={onChange} time />;
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
