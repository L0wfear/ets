import * as React from 'react';
import { isEqual } from 'lodash';
import * as R from 'ramda';

import filterTypeHandler from './filterTypeHandler';
import Input from './Input';
import { FILTER_VALUES, FILTER_SELECT_TYPES } from './constants';
import { createValidDateTime, createValidDate } from 'utils/dates';
import EtsSelect from 'components/ui/EtsSelect';


interface IPropsFilterInput {
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
const dateTimeFormatter = formatter =>  R.pipe(R.prop('inputValue'), R.map(R.curry(formatter)));

const datetimeFilterValueMaker = (value, type) => R.cond([
  [inputTypeIf('datetime'), dateTimeFormatter(createValidDateTime)],
  [inputTypeIf('date'), dateTimeFormatter(createValidDate)],
  [R.T, R.pipe(R.prop('inputValue'), R.identity)],
])({
  inputType: type,
  inputValue: value,
});

const getInputFilter = R.cond([
  [
    R.either(inputTypeIf('string'), inputTypeIf('number')),
    ({ value, fieldName, filterType, inputType, handleFilterValueChange }) =>
      <InputFilter
        type={inputType}
        onChange={handleFilterValueChange}
        fieldName={fieldName}
        filterType={filterType}
        value={value}
        interval={isEqual(filterType, FILTER_VALUES.INTERVAL)}
      />,
  ],
  [
    R.either(inputTypeIf('datetime'), inputTypeIf('date')),
    ({ value, fieldName, filterType, inputType, handleFilterValueChange }) =>
      <InputFilter
        type={inputType}
        onChange={handleFilterValueChange}
        fieldName={fieldName}
        filterType={filterType}
        value={value}
        interval={isEqual(filterType, FILTER_VALUES.INTERVAL)}
        filterValueMaker={datetimeFilterValueMaker}
      />,
  ],
]);

class FilterInput extends React.Component<IPropsFilterInput, IStateFilterInput> {
  constructor() {
    super();

    this.state = {
      type: 'eq',
      value: [],
    };
  }
  handleTypeChange = newType => {
    this.setState({ type: newType });
  }
  handleFilterValueChange = ({ value, filterValue}) => {
    this.setState({ value });

    this.props.onChange(filterValue);
  }
  render() {
    if (this.props.single) {
      return (
        <InputFilter
          type={this.props.inputType}
          onChange={this.handleFilterValueChange}
          fieldName={this.props.fieldName}
          filterType={this.props.filterType}
          value={this.state.value}
        />
      );
    }

    const filterField = getInputFilter({
      filterType: this.state.type,
      inputType: this.props.inputType,
      value: this.state.value,
      fieldName: this.props.fieldName,
      handleFilterValueChange: this.handleFilterValueChange,
    });

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
