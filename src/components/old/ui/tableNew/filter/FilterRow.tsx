import * as React from 'react';
import * as PropTypes from 'prop-types';
import _ from 'lodash';

import FilterInput from 'components/old/ui/input/FilterInput/FilterInput';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';
import IntervalPicker from 'components/old/ui/input/IntervalPicker';
import Div from 'components/old/ui/Div';
import { ColFilter } from 'components/old/ui/tableNew/filter/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = {
  [k: string]: any;
};

export default class FilterRow extends React.Component<Props, {}> {
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
      labelFunction: (v) => v,
      data: [],
    };
  }

  onChange = (...arg) => this.props.onChange(this.props, ...arg);

  onMultiChange = (...arg) => {
    this.props.onMultiChange(this.props, ...arg);
  };

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
      entity,
    } = this.props;
    let { value } = this.props;
    const idLabel = name
      ? `${entity ? `${entity}-` : ''}${name}-label`
      : undefined;

    let input = (
      <div className="form-group">
        <EtsBootstrap.FormControl
          type="text"
          value={value || ''}
          onChange={this.onChange}
        />
      </div>
    );
    if (type) {
      if (
        type === 'select'
        || type === 'multiselect'
        || type === 'multiselect-boolean'
        || type === 'advanced-select-like'
      ) {
        let options
          = availableOptions
          || _(data)
            .uniqBy(name)
            .map((d) => ({
              value: typeof d[name] === 'boolean' ? +d[name] : d[name],
              label: labelFunction(d[byLabel || name]),
            }))
            .filter((d) => !!d.label)
            .value();
        if (type === 'select' || type === 'advanced-select-like') {
          if (!!value && !_.find(options, (o) => o.value === value)) {
            value = null;
          }
          if (name === 'operation_id') {
            options = options.sort((a, b) =>
              a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
            );
          }
          input = (
            <ReactSelect
              options={options}
              value={value}
              onChange={this.onChange}
            />
          );
        } else if (type === 'multiselect' || type === 'multiselect-boolean') {
          if (value && !!value.length) {
            value = value.filter((v) => _.find(options, (o) => o.value === v));
          }
          input = (
            <Div className="filter-multiselect-container">
              <ReactSelect
                options={options}
                multi
                delimiter={'$'}
                value={value}
                onChange={this.onMultiChange}
              />
            </Div>
          );
        }
      }
      if (type === 'advanced-number') {
        input = (
          <FilterInput
            filterValue={value}
            fieldName={name}
            inputType="number"
            onChange={this.onChange}
          />
        );
      }
      if (type === 'advanced-string') {
        input = (
          <FilterInput
            filterValue={value}
            fieldName={name}
            inputType="string"
            onChange={this.onChange}
          />
        );
      }
      if (type === 'advanced-string-like') {
        input = (
          <FilterInput
            filterValue={value}
            fieldName={name}
            inputType="string"
            onChange={this.onChange}
            single
            filterType="like"
          />
        );
      }
      if (type === 'advanced-date') {
        input = (
          <FilterInput
            filterValue={value}
            fieldName={name}
            inputType="date"
            onChange={this.onChange}
          />
        );
      }
      if (type === 'advanced-datetime') {
        input = (
          <FilterInput
            filterValue={value}
            fieldName={name}
            inputType="datetime"
            onChange={this.onChange}
          />
        );
      }
      if (type === 'date') {
        input = (
          <FilterInput
            filterValue={value}
            fieldName={name}
            inputType="date"
            onChange={this.onChange}
            single
          />
        );
      }
      if (type === 'datetime') {
        input = (
          <FilterInput
            filterValue={value}
            fieldName={name}
            inputType="datetime"
            onChange={this.onChange}
            single
          />
        );
      }
      if (type === 'date_interval') {
        input = <IntervalPicker interval={value} onChange={this.onChange} />;
      }
    }

    return (
      <ColFilter lg={3} md={4} sm={6}>
        <label id={idLabel} htmlFor="input">
          {displayName}
        </label>
        {input}
      </ColFilter>
    );
  }
}
