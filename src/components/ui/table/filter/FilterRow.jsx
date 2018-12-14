import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import _ from 'lodash';

import FilterInput from 'components/ui/input/FilterInput/FilterInput';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';
import IntervalPicker from 'components/ui/input/IntervalPicker';
import Div from 'components/ui/Div';
import { ColFilter } from 'components/ui/tableNew/filter/styled';

class FilterRow extends React.Component {
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
      entity: PropTypes.string,
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
      entity,
    } = this.props;
    let { value } = this.props;

    const idValue = name ? `${entity ? `${entity}-` : ''}${name}-value` : undefined;
    const idLabel = name ? `${entity ? `${entity}-` : ''}${name}-label` : undefined;

    let input = (
      <div className="form-group">
        <FormControl id={idValue} type="text" value={value || ''} onChange={onChange} />
      </div>
    );

    if (type) {
      if (type === 'select' || type === 'multiselect' || type === 'advanced-select-like') {
        let options = availableOptions || _(tableData)
                        .uniqBy(name)
                        .map((d) => ({
                          value: typeof d[name] === 'boolean' ? +d[name] : d[name],
                          label: labelFunction(d[byLabel || name]),
                        }))
                        .filter((d) => d.label !== null)
                        .value();
        if (type === 'select' || type === 'advanced-select-like') {
          if (!!value && !_.find(options, o => o.value === value)) {
            value = null;
          }
          if (name === 'operation_id') {
            options = options.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
          }
          input = <ReactSelect modalKey={entity} id={name} options={options} value={value} onChange={onChange} />;
        } else if (type === 'multiselect') {
          if (value && !!value.length) value = value.filter((v) => _.find(options, o => o.value === v));

          input = (
            <Div className="filter-multiselect-container">
              <ReactSelect modalKey={entity} id={name} options={options} multi delimiter={'$'} value={value} onChange={onMultiChange} />
            </Div>
          );
        }
      }
      if (type === 'advanced-number') {
        input = <FilterInput entity={entity} filterValue={value} fieldName={name} inputType="number" onChange={onChange} lang="en" />;
      }
      if (type === 'advanced-string') {
        input = <FilterInput entity={entity} filterValue={value} fieldName={name} inputType="string" onChange={onChange} />;
      }
      if (type === 'advanced-string-like') {
        input = <FilterInput entity={entity} filterValue={value} fieldName={name} inputType="string" onChange={onChange} single filterType="like" />;
      }
      if (type === 'advanced-date') {
        input = <FilterInput entity={entity} filterValue={value} fieldName={name} inputType="date" onChange={onChange} />;
      }
      if (type === 'advanced-datetime') {
        input = <FilterInput entity={entity} filterValue={value} fieldName={name} inputType="datetime" onChange={onChange} />;
      }
      if (type === 'date') {
        input = <FilterInput entity={entity} filterValue={value} fieldName={name} inputType="date" onChange={onChange} single />;
      }
      if (type === 'datetime') {
        input = <FilterInput entity={entity} filterValue={value} fieldName={name} inputType="datetime" onChange={onChange} single />;
      }
      if (type === 'date_interval') {
        input = <IntervalPicker entity={entity} interval={value} onChange={onChange} />;
      }
    }

    return (
      <ColFilter md={3} sm={6}>
        <label id={idLabel} htmlFor="input">{displayName}</label>
        {input}
      </ColFilter>
    );
  }
}

export default FilterRow;
