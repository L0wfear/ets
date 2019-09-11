import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { registrySetSelectedRowToShowInForm, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import carActualPermissions from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/permissions';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonChangeDriverTechnicalOperationRelationsStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonChangeDriverTechnicalOperationRelationsDispatchProps = {
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
};
type ButtonChangeDriverTechnicalOperationRelationsOwnProps = CommonTypesForButton & {};
type ButtonChangeDriverTechnicalOperationRelationsMergeProps = {};

type ButtonChangeDriverTechnicalOperationRelationsProps = (
  ButtonChangeDriverTechnicalOperationRelationsStateProps
  & ButtonChangeDriverTechnicalOperationRelationsDispatchProps
  & ButtonChangeDriverTechnicalOperationRelationsOwnProps
  & ButtonChangeDriverTechnicalOperationRelationsMergeProps
) & WithSearchProps;

const ButtonChangeDriverTechnicalOperationRelations: React.FC<ButtonChangeDriverTechnicalOperationRelationsProps> = (props) => {
  const technical_operation_id = props.searchState.technical_operation_id || null;
  const municipal_facility_id = props.searchState.municipal_facility_id || null;
  const route_types = props.searchState.route_types || null;
  const func_type_id = props.searchState.func_type_id || null;

  const hasAllData = (
    technical_operation_id
    && municipal_facility_id
    && route_types
    && func_type_id
  );

  const handleClick = React.useCallback(
    () => {
      props.setParams({
        technical_operation_relations_type_form: 'change_driver',
        car_actual_asuods_id: get(props.selectedRow, 'car_id', null),
      }),
      props.registrySetSelectedRowToShowInForm(props.registryKey);
    },
    [props.registryKey, props.setParams, props.match.params, props.selectedRow],
  );

  React.useEffect(
    () => {
      if (hasAllData) {
        props.actionUnselectSelectedRowToShow(props.registryKey, true);
      }
    },
    [hasAllData, technical_operation_id, func_type_id, municipal_facility_id. route_types],
  );

  React.useEffect(
    () => {
      if (!hasAllData) {
        props.actionUnselectSelectedRowToShow(props.registryKey, true);
      }
    },
    [hasAllData],
  );

  return (
    <EtsBootstrap.Button id={`${props.registryKey}.open-update_car-form`} bsSize="small" onClick={handleClick} disabled={!props.selectedRow}>
      Изменить водителей
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonChangeDriverTechnicalOperationRelationsProps, ButtonChangeDriverTechnicalOperationRelationsOwnProps>(
  withRequirePermission({
    permissions: carActualPermissions.update,
  }),
  connect<ButtonChangeDriverTechnicalOperationRelationsStateProps, ButtonChangeDriverTechnicalOperationRelationsDispatchProps, ButtonChangeDriverTechnicalOperationRelationsOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
    (dispatch: any) => ({
      registrySetSelectedRowToShowInForm: (...arg) => (
        dispatch(
          registrySetSelectedRowToShowInForm(...arg),
        )
      ),
      actionUnselectSelectedRowToShow: (...arg) => (
        dispatch(
          actionUnselectSelectedRowToShow(...arg),
        )
      ),
    }),
  ),
  withSearch,
)(ButtonChangeDriverTechnicalOperationRelations);
