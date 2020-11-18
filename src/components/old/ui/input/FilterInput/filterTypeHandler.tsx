import * as React from 'react';
import { isEqual } from 'lodash';

import { IPropsExtendedInput } from 'components/old/ui/input/FilterInput/Input';

import { isEqualOr } from 'utils/functions';
import { FILTER_VALUES } from 'components/old/ui/input/FilterInput/constants';

function singleFilterTypeHandler(SourcerFilterInput) {
  return class FilterInputHOC extends React.Component<IPropsExtendedInput, any> {
    componentDidUpdate(prevProps: IPropsExtendedInput) {
      if (
        !isEqual(prevProps.filterType, this.props.filterType)
        || !isEqual(prevProps.value, this.props.value)
      ) {
        this.handleChange(this.props.value, this.props.filterType);
      }
    }
    handleChange = (value, defaultFilterType = this.props.filterType) => {
      const filterValueMaker = this.props.filterValueMaker || ((valueToFormat) => valueToFormat);
      let getFilterValue = ({ inputValue, fieldName }) => {
        const val = filterValueMaker(inputValue, this.props.type);

        return isEqualOr(['', null, undefined], val[0]) ? null : val[0];
      };

      if (defaultFilterType === FILTER_VALUES.EQUAL) {
        getFilterValue = ({ inputValue, fieldName }) => {
          const val = filterValueMaker(inputValue, this.props.type);
    
          return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__eq`]: val[0] };
        };
      }

      if (defaultFilterType === FILTER_VALUES.NOT_EQUAL) {
        getFilterValue = ({ inputValue, fieldName }) => {
          const val = filterValueMaker(inputValue, this.props.type);

          return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__neq`]: val[0] };
        };
      }

      if (defaultFilterType === FILTER_VALUES.SMALLER) {
        getFilterValue = ({ inputValue, fieldName }) => {
          const val = filterValueMaker(inputValue, this.props.type);

          return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__lt`]: val[0] };
        };
      }

      if (defaultFilterType === FILTER_VALUES.GREATER) {
        getFilterValue = ({ inputValue, fieldName }) => {
          const val = filterValueMaker(inputValue, this.props.type);

          return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__gt`]: val[0] };
        };
      }

      if (defaultFilterType === FILTER_VALUES.LIKE) {
        getFilterValue = ({ inputValue, fieldName }) => {
          const val = filterValueMaker(inputValue, this.props.type);

          return isEqualOr(['', null, undefined], val[0]) ? null : { [`${fieldName}__like`]: `%${val[0]}%` };
        };
      }

      if (defaultFilterType === FILTER_VALUES.INTERVAL) {
        getFilterValue = ({ inputValue, fieldName }) => {
          const intervalValue = filterValueMaker(value, this.props.type);

          const isEmpty = !intervalValue.length || intervalValue
            .map((val) => isEqualOr([undefined, null, ''], val))
            .includes(false);

          return !isEmpty ? null : {
            [`${this.props.fieldName}__gte`]: intervalValue[0],
            [`${fieldName}__lte`]: intervalValue[1],
          };
        };
      }

      const filterValue = getFilterValue({
        inputValue: value,
        fieldName: this.props.fieldName,
      });

      if (this.props.type === 'date' || this.props.type === 'datetime') {
        this.props.onChange({
          value,
          filterValue: [filterValue],
        });
      } else {
        this.props.onChange({
          value,
          filterValue,
        });
      }
    };
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
