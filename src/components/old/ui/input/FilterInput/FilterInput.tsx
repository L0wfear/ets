import * as React from 'react';
import { isEqual, isEmpty } from 'lodash';

import filterTypeHandler from 'components/old/ui/input/FilterInput/filterTypeHandler';
import Input from 'components/old/ui/input/FilterInput/Input';
import { FILTER_VALUES, FILTER_SELECT_TYPES } from 'components/old/ui/input/FilterInput/constants';
import { createValidDateTime, createValidDate } from 'components/@next/@utils/dates/dates';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';
import { isArray } from 'lodash-es';

type IPropsFilterInput = {
  fieldName: string;
  filterValue: string | object;
  filterType?: string;
  inputType: string;
  single?: boolean;
  onChange(value: any): void;
  lang?: string;
  entity?: string;
  modalKey?: string;
};

type IStateFilterInput = {
  type: string;
  value: Array<any>;
  hasFilterValue: boolean;
};

const InputFilter = filterTypeHandler(Input);

const datetimeFilterValueMaker = (value, type) => {
  if (value) {
    if (type === 'datetime' || type === 'advanced-datetime') {
      return isArray(value)
        ? value.map((el) => createValidDateTime(el))
        : createValidDateTime(value);
    }
    if (type === 'date' || type === 'advanced-date') {
      return isArray(value)
        ? value.map((el) => createValidDate(el))
        : createValidDate(value);
    }
  }

  return value;
};

const DateTypeSet = new Set(['date', 'datetime', 'advanced-date', 'advanced-datetime']);

class FilterInput extends React.Component<IPropsFilterInput, IStateFilterInput> {
  constructor(props) {
    super(props);

    this.state = {
      type: 'eq',
      value: [],
      hasFilterValue: !isEmpty(this.props.filterValue),
    };
  }

  static getDerivedStateFromProps(nextProps: IPropsFilterInput, prevState: IStateFilterInput) {
    const hasFilterValue = !isEmpty(nextProps.filterValue);

    if (
      prevState.hasFilterValue
      && !hasFilterValue
    ) {
      return {
        value: [null],
        hasFilterValue: false,
      };
    }

    return {
      hasFilterValue,
    };
  }

  handleTypeChange = (newType) => {
    this.setState({ type: newType });
  };
  handleFilterValueChange = ({ value, filterValue}) => {
    this.setState({ value });

    this.props.onChange(filterValue);
  };
  filterValueMaker = (inputValue, inputType) => {
    if (DateTypeSet.has(this.props.inputType)) {
      return datetimeFilterValueMaker(inputValue, inputType);
    }

    return inputValue;
  };
  render() {
    const { entity } = this.props;
    const id = this.props.fieldName;

    if (this.props.single) {
      return (
        <InputFilter
          modalKey={entity}
          id={id}
          type={this.props.inputType}
          onChange={this.handleFilterValueChange}
          fieldName={this.props.fieldName}
          filterType={this.props.filterType}
          value={this.state.value}
          filterValueMaker={this.filterValueMaker}
        />
      );
    }

    const filterField = (
      <InputFilter
        modalKey={entity}
        id={id}
        type={this.props.inputType}
        onChange={this.handleFilterValueChange}
        fieldName={this.props.fieldName}
        filterType={this.state.type}
        value={this.state.value}
        interval={isEqual(this.state.type, FILTER_VALUES.INTERVAL)}
        filterValueMaker={this.filterValueMaker}
        lang={this.props.lang}
      />
    );

    // Если надо будет править верстку, смотри сюда components/new/ui/registry/components/data/filters/filters-lines/advanced-date/AdvancedDateFilter.tsx

    return (
      <div className="advanced-string-input">
        <ReactSelect
          modalKey={entity}
          id={id}
          options={FILTER_SELECT_TYPES}
          value={this.state.type}
          clearable={false}
          onChange={this.handleTypeChange}
          className="width115"
        />
        {filterField}
      </div>
    );
  }
}

export default FilterInput;
