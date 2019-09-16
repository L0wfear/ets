import * as React from 'react';
import memoizeOne from 'memoize-one';
import { uniqBy } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { getNumberValueFromSerch, getStringArrValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

type OwnProps = {
  registryKey: string;
  normList: Norm[];
};

type Props = (
  OwnProps
  & WithSearchProps
);

type State = {
  options: any[];
};

const makeOptions = memoizeOne(
  (normList: Norm[], hasSelectedTo) => (
    hasSelectedTo
      ? (
        uniqBy(
          normList.reduce(
            (newArr, rowData) => {
              rowData.car_func_types.forEach((itemRowData) => {
                newArr.push({
                  value: itemRowData.asuods_id,
                  label: itemRowData.name || itemRowData.short_name,
                  rowData,
                  itemRowData,
                });
              });

              return newArr;
            },
            [],
          ),
          'value',
        )
      )
      : []
  ),
);

class SelectFuncType extends React.PureComponent<Props, State> {
  state = {
    options: makeOptions(
      this.props.normList,
      Boolean(getNumberValueFromSerch(this.props.searchState.municipal_facility_id)),
    ),
  };
  static getDerivedStateFromProps(nextProps: Props) {
    const municipal_facility_id = getNumberValueFromSerch(nextProps.searchState.municipal_facility_id);
    const options = makeOptions(nextProps.normList, Boolean(municipal_facility_id));

    return {
      options,
    };
  }

  componentDidMount() {
    const municipal_facility_id = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);
    const value = getStringArrValueFromSerch(this.props.searchState.route_types);

    if (value && !municipal_facility_id) {
      this.setFuncTypes(null);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      options,
    } = this.state;
    const value = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);

    const triggerOnLoadMunicipalFacility = (
      options !== prevState.options
    );

    if (triggerOnLoadMunicipalFacility) {
      if (value) {
        const hasValueInArray = options.find(
          (optionRowData) => optionRowData.value === value,
        );

        if (hasValueInArray) {
          return;
        }
      }

      if (options.length === 1) {
        this.setFuncTypes(
          options.length === 1
            ? options[0].value
            : null,
        );
      }
    }
  }

  setFuncTypes = (selecteFuncTypes: number) => {
    const newPartialSearch: any = {
      func_type_id: selecteFuncTypes,
    };

    this.props.setDataInSearch(newPartialSearch);
  }

  render() {
    const municipal_facility_id = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);
    const value = getNumberValueFromSerch(this.props.searchState.func_type_id);

    const options = makeOptions(this.props.normList, Boolean(municipal_facility_id));

    return (
      <ExtField
        type="select"
        label="Тип техники"
        value={value}
        options={options}
        clearable={false}
        onChange={this.setFuncTypes}
      />
    );
  }
}

export default withSearch<OwnProps>(SelectFuncType);
