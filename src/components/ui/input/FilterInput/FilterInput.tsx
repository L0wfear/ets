import * as React from 'react';
import { isEqual, isEmpty } from 'lodash';
import * as R from 'ramda';

import filterTypeHandler from './filterTypeHandler';
import Input from './Input';
import { FILTER_VALUES, FILTER_SELECT_TYPES } from './constants';
import { createValidDateTime, createValidDate } from 'utils/dates';
import { IPropsEtsSelect } from 'components/ui/@types/EtsSelect.h';
import ETSSelect from 'components/ui/EtsSelect';
import { isEqualOr } from 'utils/functions';

const EtsSelect: React.ComponentClass<IPropsEtsSelect> = ETSSelect;

interface IPropsFilterInput {
  nativeDatetime: boolean;
  fieldName: string;
  filterValue: string | object;
  filterType?: string;
  inputType: string;
  single?: boolean;
  onChange(value: any): void;
}

interface IStateFilterInput {
  type: string;
  value: any[];
}

const InputFilter = filterTypeHandler(Input);

const inputTypeIf = inputType => R.propEq('inputType', inputType);
const dateTimeFormatter = formatter =>  R.pipe(R.prop('inputValue'), R.map(formatter));

const datetimeFilterValueMaker = (value, type) => R.cond([
  [inputTypeIf('datetime'), dateTimeFormatter(createValidDateTime)],
  [inputTypeIf('date'), dateTimeFormatter(createValidDate)],
  [R.T, R.pipe(R.prop('inputValue'), R.identity)],
])({
  inputType: type,
  inputValue: value,
});

class FilterInput extends React.Component<IPropsFilterInput, IStateFilterInput> {
  constructor() {
    super();

    this.state = {
      type: 'eq',
      value: [],
    };
  }
  componentWillReceiveProps(nextProps: IPropsFilterInput) {
    if (
      !isEqual(this.props.filterValue, nextProps.filterValue) &&
      isEmpty(nextProps.filterValue)
    ) {
      this.setState({ value: [null] });
    }
  }
  handleTypeChange = newType => {
    this.setState({ type: newType });
  }
  handleFilterValueChange = ({ value, filterValue}) => {
    this.setState({ value });

    this.props.onChange(filterValue);
  }
  render() {
    const isDatetimeInput = isEqualOr(['date', 'datetime'], this.props.inputType);
    const filterValueMaker = isDatetimeInput && !this.props.nativeDatetime
      ? datetimeFilterValueMaker
      : R.identity;

    if (this.props.single) {
      return (
        <InputFilter
          type={this.props.inputType}
          onChange={this.handleFilterValueChange}
          fieldName={this.props.fieldName}
          filterType={this.props.filterType}
          value={this.state.value}
          filterValueMaker={filterValueMaker}
        />
      );
    }

    const filterField = (
      <InputFilter
        type={this.props.inputType}
        onChange={this.handleFilterValueChange}
        fieldName={this.props.fieldName}
        filterType={this.state.type}
        value={this.state.value}
        interval={isEqual(this.state.type, FILTER_VALUES.INTERVAL)}
        filterValueMaker={filterValueMaker}
      />
    );

    return (
      <div className="advanced-string-input">
        <EtsSelect
          options={FILTER_SELECT_TYPES}
          value={this.state.type}
          clearable={false}
          onChange={this.handleTypeChange}
        />
        {filterField}
      </div>
    );
  }
}

export default FilterInput;
