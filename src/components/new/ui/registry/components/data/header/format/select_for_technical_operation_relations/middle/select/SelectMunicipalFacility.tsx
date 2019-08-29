import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import memoizeOne from 'memoize-one';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { actionResetMunicipalFacility, actionGetAndSetInStoreMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';

type SelectMunicipalFacilityStateProps = {
  technicalOperationRegistryList: IStateSomeUniq['technicalOperationRegistryList'];
  municipalFacilityList: IStateSomeUniq['municipalFacilityList'];
};
type SelectMunicipalFacilityDispatchProps = {
  actionGetAndSetInStoreMunicipalFacility: HandleThunkActionCreator<typeof actionGetAndSetInStoreMunicipalFacility>;
  actionResetMunicipalFacility: HandleThunkActionCreator<typeof actionResetMunicipalFacility>;
};
type SelectMunicipalFacilityOwnProps = {
  registryKey: string;
};

type SelectMunicipalFacilityMergeProps = (
  SelectMunicipalFacilityStateProps
  & SelectMunicipalFacilityDispatchProps
  & SelectMunicipalFacilityOwnProps
);
type SelectMunicipalFacilityProps = (
  SelectMunicipalFacilityMergeProps
  & WithSearchProps
);

type SelectMunicipalFacilityState = {
  lastNotNullValue: number;
};

const makeOptions = memoizeOne(
  (municipalFacility: MunicipalFacility[], hasSelectedTo) => (
    hasSelectedTo
      ? (
        municipalFacility.map((rowData) => ({
          value: rowData.municipal_facility_id,
          label: rowData.municipal_facility_name,
          rowData,
        }))
      )
      : []
  ),
);

class SelectMunicipalFacility extends React.PureComponent<SelectMunicipalFacilityProps, SelectMunicipalFacilityState> {
  state = {
    lastNotNullValue: getNumberValueFromSerch(this.props.searchState.municipal_facility_id),
  };

  static getDerivedStateFromProps(nextProps: SelectMunicipalFacilityProps) {
    const value = getNumberValueFromSerch(nextProps.searchState.municipal_facility_id);

    if (value) {
      return {
        lastNotNullValue: value,
      };
    }

    return null;
  }

  componentDidMount() {
    const technical_operation_id = getNumberValueFromSerch(this.props.searchState.technical_operation_id);
    const value = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);

    if (value && !technical_operation_id) {
      this.setMunicipalFacilityId(null);
    }
  }

  componentWillUnmount() {
    this.props.actionResetMunicipalFacility();
  }
  componentDidUpdate(prevProps: SelectMunicipalFacilityProps) {
    const {
      technicalOperationRegistryList,
      municipalFacilityList,
    } = this.props;
    const technical_operation_id = getNumberValueFromSerch(this.props.searchState.technical_operation_id);
    const technical_operation_id_prev = getNumberValueFromSerch(prevProps.searchState.technical_operation_id);
    const value = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);

    const triggerOnLoadMunicipalFacility = (
      (
        technical_operation_id !== technical_operation_id_prev
        && technicalOperationRegistryList.length
      )
      || (
        technical_operation_id
        && (
          technicalOperationRegistryList.length
          && !prevProps.technicalOperationRegistryList.length
        )
      )
    );

    if (triggerOnLoadMunicipalFacility) {
      const toData = technicalOperationRegistryList.find(({ id }) => id === technical_operation_id);
      if (toData) {
        this.props.actionGetAndSetInStoreMunicipalFacility(
          {
            start_date: new Date(),
            end_date: new Date(),
            norm_ids: toData.norm_ids.toString(),
          },
          {
            page: this.props.registryKey,
          },
        ).then(
          (municipalFacilityListNew) => {
            if (!value && municipalFacilityListNew.length === 1) {
              this.setMunicipalFacilityId(
                municipalFacilityListNew[0].municipal_facility_id,
              );
            }
          },
        );
      }
    }
    if (municipalFacilityList.length && value) {
      const hasValueInArray = municipalFacilityList.find(
        ({ municipal_facility_id }) => municipal_facility_id === value,
      );

      if (!hasValueInArray) {
        this.setMunicipalFacilityId(null);
      }
    }

    if (value && !technical_operation_id && technical_operation_id !== technical_operation_id_prev) {
      this.setMunicipalFacilityId(null);
    }
  }

  setMunicipalFacilityId = (selectedMunicipalFacilityId: number) => {
    const newPartialSearch: any = {
      municipal_facility_id: selectedMunicipalFacilityId,
      route_types: null,
      func_type_id: null,
    };

    this.props.setDataInSearch(newPartialSearch);
  }

  render() {
    const technical_operation_id = getNumberValueFromSerch(this.props.searchState.technical_operation_id);
    const value = getNumberValueFromSerch(this.props.searchState.municipal_facility_id);

    const options = makeOptions(this.props.municipalFacilityList, Boolean(technical_operation_id));

    return (
      <ExtField
        type="select"
        label="Элемент"
        value={value}
        options={options}
        onChange={this.setMunicipalFacilityId}
        clearable={false}
      />
    );
  }
}

export default compose<SelectMunicipalFacilityProps, SelectMunicipalFacilityOwnProps>(
  withSearch,
  connect<SelectMunicipalFacilityStateProps, SelectMunicipalFacilityDispatchProps, SelectMunicipalFacilityOwnProps, ReduxState>(
    (state) => ({
      technicalOperationRegistryList: getSomeUniqState(state).technicalOperationRegistryList,
      municipalFacilityList: getSomeUniqState(state).municipalFacilityList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreMunicipalFacility: (...arg) => (
        dispatch(
          actionGetAndSetInStoreMunicipalFacility(...arg),
        )
      ),
      actionResetMunicipalFacility: (...arg) => (
        dispatch(
          actionResetMunicipalFacility(...arg),
        )
      ),
    }),
  ),
)(SelectMunicipalFacility);
