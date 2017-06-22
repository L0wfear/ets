import * as React from 'react';
import * as R from 'ramda';
import { isEqual } from 'lodash';

import { IPropsExtendedInput } from './Input';

import { isEqualOr } from 'utils/functions';
import { FILTER_VALUES } from './constants';

const filterTypeIf = filterMatch => R.propEq('filterType', filterMatch);

function singleFilterTypeHandler(SourcerFilterInput) {
  return class FilterInputHOC extends React.Component<IPropsExtendedInput, any> {
    componentWillReceiveProps(nextProps: IPropsExtendedInput) {
      if (
        !isEqual(this.props.filterType, nextProps.filterType) ||
        !isEqual(this.props.value, nextProps.value)
      ) {
        this.handleChange(nextProps.value, nextProps.filterType);
      }
    }
    handleChange = (value, defaultFilterType = this.props.filterType) => {
      const filterValueMaker = this.props.filterValueMaker || R.identity;

      const getFilterValue = R.cond([
        [
          filterTypeIf(FILTER_VALUES.EQUAL),
          ({ inputValue, fieldName }) => {
            const val = filterValueMaker(inputValue, this.props.type);

            return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__eq`]: val[0] };
          },
        ],
        [
          filterTypeIf(FILTER_VALUES.NOT_EQUAL),
          ({ inputValue, fieldName }) => {
            const val = filterValueMaker(inputValue, this.props.type);

            return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__neq`]: val[0] };
          },
        ],
        [
          filterTypeIf(FILTER_VALUES.SMALLER),
          ({ inputValue, fieldName }) => {
            const val = filterValueMaker(inputValue, this.props.type);

            return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__lt`]: val[0] };
          },
        ],
        [
          filterTypeIf(FILTER_VALUES.GREATER),
          ({ inputValue, fieldName }) => {
            const val = filterValueMaker(inputValue, this.props.type);

            return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__gt`]: val[0] };
          },
        ],
        [
          filterTypeIf(FILTER_VALUES.LIKE),
          ({ inputValue, fieldName }) => {
            const val = filterValueMaker(inputValue, this.props.type);

            return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__like`]: `%${val[0]}%` };
          },
        ],
        [
          filterTypeIf(FILTER_VALUES.INTERVAL),
          ({ inputValue, fieldName }) => {
            const intervalValue = filterValueMaker(value, this.props.type);

            const isEmpty = intervalValue.length < 2 || intervalValue
              .map(val => isEqualOr(['', null, undefined], val))
              .includes(true);

            return isEmpty ? null : {
              [`${this.props.fieldName}__gte`]: intervalValue[0],
              [`${fieldName}__lte`]: intervalValue[1],
            };
          },
        ],
        [
          R.T,
          ({ inputValue, fieldName }) => {
            const val = filterValueMaker(inputValue, this.props.type);

            return isEqualOr(['', null, undefined], val[0]) ? null : val[0];
          },
        ],
      ]);
      const filterValue = getFilterValue({
        inputValue: value,
        fieldName: this.props.fieldName,
        filterType: defaultFilterType,
      });

      this.props.onChange({
        value,
        filterValue,
      });
    }
    render() {
      return (
        <SourcerFilterInput
          {...this.props}
          onChange={this.handleChange}
        />
      );
    }
  };
}

export default singleFilterTypeHandler;
