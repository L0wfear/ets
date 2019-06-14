import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { getNumberValueFromSerch, getStringArrValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import memoizeOne from 'memoize-one';
import { actionResetMunicipalFacility, actionGetAndSetInStoreMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';
import { Norm } from 'redux-main/reducers/modules/norm_registry/@types';
import { uniqBy } from 'lodash';

type SelectFuncTypeStateProps = {
  technicalOperationRegistryList: IStateSomeUniq['technicalOperationRegistryList'];
  municipalFacilityList: IStateSomeUniq['municipalFacilityList'];
};
type SelectFuncTypeDispatchProps = {
  actionGetAndSetInStoreMunicipalFacility: HandleThunkActionCreator<typeof actionGetAndSetInStoreMunicipalFacility>;
  actionResetMunicipalFacility: HandleThunkActionCreator<typeof actionResetMunicipalFacility>;
};
type SelectFuncTypeOwnProps = {
  registryKey: string;
  normList: Norm[];
};

type SelectFuncTypeMergeProps = (
  SelectFuncTypeStateProps
  & SelectFuncTypeDispatchProps
  & SelectFuncTypeOwnProps
);
type SelectFuncTypeProps = (
  SelectFuncTypeMergeProps
  & WithSearchProps
);

type SelectFuncTypeState = {
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
                  value: itemRowData.asuods_id, // <<< asuods_id swap cleaning/norm_registry
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

class SelectFuncType extends React.PureComponent<SelectFuncTypeProps, SelectFuncTypeState> {
  state = {
    options: makeOptions(
      this.props.normList,
      Boolean(getNumberValueFromSerch(this.props.searchState.municipal_facility_id)),
    ),
  };
  static getDerivedStateFromProps(nextProps: SelectFuncTypeProps) {
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

  componentDidUpdate(prevProps: SelectFuncTypeProps, prevState: SelectFuncTypeState) {
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

export default compose<SelectFuncTypeProps, SelectFuncTypeOwnProps>(
  withSearch,
)(SelectFuncType);
