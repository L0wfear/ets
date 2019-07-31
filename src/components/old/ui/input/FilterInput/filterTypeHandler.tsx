import * as React from 'react';
import * as R from 'ramda';
import { isEqual } from 'lodash';

import { IPropsExtendedInput } from 'components/old/ui/input/FilterInput/Input';

import { isEqualOr } from 'utils/functions';
import { FILTER_VALUES } from 'components/old/ui/input/FilterInput/constants';

const filterTypeIf = (filterMatch) => R.propEq('filterType', filterMatch);

function singleFilterTypeHandler(SourcerFilterInput) {
  return class FilterInputHOC extends React.Component<IPropsExtendedInput, any> {
    componentDidUpdate(prevProps: IPropsExtendedInput) {
      if (
        !isEqual(prevProps.filterType, this.props.filterType) ||
        !isEqual(prevProps.value, this.props.value)
      ) {
        this.handleChange(this.props.value, this.props.filterType);
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

            const isEmpty = !intervalValue.length || intervalValue
              .map((val) => isEqualOr([undefined], val))
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
