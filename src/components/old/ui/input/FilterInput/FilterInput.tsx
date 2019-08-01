import * as React from 'react';
import { isEqual, isEmpty } from 'lodash';
import * as R from 'ramda';

import filterTypeHandler from 'components/old/ui/input/FilterInput/filterTypeHandler';
import Input from 'components/old/ui/input/FilterInput/Input';
import { FILTER_VALUES, FILTER_SELECT_TYPES } from 'components/old/ui/input/FilterInput/constants';
import { createValidDateTime, createValidDate } from 'utils/dates';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';

import { isEqualOr } from 'utils/functions';

interface IPropsFilterInput {
  nativeDatetime: boolean;
  fieldName: string;
  filterValue: string | object;
  filterType?: string;
  inputType: string;
  single?: boolean;
  onChange(value: any): void;
  lang?: string;
  entity?: string;
  modalKey?: string;
}

interface IStateFilterInput {
  type: string;
  value: any[];
  hasFilterValue: boolean;
}

const InputFilter = filterTypeHandler(Input);

const inputTypeIf = (inputType) => R.propEq('inputType', inputType);
const dateTimeFormatter = (formatter) =>  R.pipe(R.prop('inputValue'), R.map(formatter));

const datetimeFilterValueMaker = (value, type) => R.cond([
  [inputTypeIf('datetime'), dateTimeFormatter(createValidDateTime)],
  [inputTypeIf('date'), dateTimeFormatter(createValidDate)],
  [R.T, R.pipe(R.prop('inputValue'), R.identity)],
])({
  inputType: type,
  inputValue: value,
});

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
  }
  handleFilterValueChange = ({ value, filterValue}) => {
    this.setState({ value });

    this.props.onChange(filterValue);
  }
  render() {
    const { entity } = this.props;
    const id = this.props.fieldName;

    const isDatetimeInput = isEqualOr(['date', 'datetime'], this.props.inputType);
    const filterValueMaker = isDatetimeInput && !this.props.nativeDatetime
      ? datetimeFilterValueMaker
      : R.identity;

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
          filterValueMaker={filterValueMaker}
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
        filterValueMaker={filterValueMaker}
        lang={this.props.lang}
      />
    );

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
