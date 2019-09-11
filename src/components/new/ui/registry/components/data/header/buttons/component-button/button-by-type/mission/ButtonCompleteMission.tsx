import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { registryLoadDataByKey, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import { actionCompleteMissionByIds } from 'redux-main/reducers/modules/missions/mission/actions';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import ChangeStatusRequesFormLazy from 'components/new/pages/edc_request/form/changeStatusRequesForm';
import { get } from 'lodash';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
// import { promiseSetTestDataToDatabase } from 'redux-main/reducers/modules/edc_request/edc_request_promise';

export type ButtonCompleteMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCompleteMissionDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionCompleteMissionByIds: HandleThunkActionCreator<typeof actionCompleteMissionByIds>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonCompleteMissionOwnProps = CommonTypesForButton & {};
type ButtonCompleteMissionMergeProps = {};

type ButtonCompleteMissionProps = (
  ButtonCompleteMissionStateProps
  & ButtonCompleteMissionDispatchProps
  & ButtonCompleteMissionOwnProps
  & ButtonCompleteMissionMergeProps
);

const ButtonCompleteMission: React.FC<ButtonCompleteMissionProps> = (props) => {
  const [edcRequestIds, setEdcRequestIds] = React.useState(null);

  const checkedRowsAsArray = React.useMemo(
    () => {
      const checkedRowsAsArrayTemp = Object.values(props.checkedRows);
      if (!checkedRowsAsArrayTemp.length && props.selectedRow) {
        checkedRowsAsArrayTemp.push(props.selectedRow);
      }

      return checkedRowsAsArrayTemp;
    },
    [props.selectedRow, props.checkedRows],
  );

  const requestFormHide = React.useCallback(
    () => {
      setEdcRequestIds(null);

      props.actionUnselectSelectedRowToShow(props.registryKey, true);
      props.registryLoadDataByKey(props.registryKey);
    },
    [],
  );

  const handleClickComplete = React.useCallback(
    async () => {
      // promiseSetTestDataToDatabase();
      try {
        const response = await props.actionCompleteMissionByIds(
          checkedRowsAsArray.map(({ [props.uniqKey]: id }) => id),
          { page: props.registryKey },
        );
        const successEdcRequestIds = response.filter(
          (value) => value,
        ).filter(
          ({ close_request }) => close_request,
        ).map(
          ({ request_id, request_number }) => ({ request_id, request_number }),
        );

        if (successEdcRequestIds.length) {
          setEdcRequestIds(successEdcRequestIds);
          return;
        }
      } catch (error) {
        console.error(error); // tslint:disable-line
        //
      }
      props.actionUnselectSelectedRowToShow(props.registryKey, true);
      props.registryLoadDataByKey(props.registryKey);
    },
    [checkedRowsAsArray],
  );

  let disabled = false;
  if (checkedRowsAsArray.length) {
    disabled = checkedRowsAsArray.some((mission: Mission) => !mission.can_be_closed);
  } else {
    const can_be_closed = get(props.selectedRow, 'can_be_closed', false);
    disabled = !can_be_closed;
  }

  return (
    <>
      <EtsBootstrap.Button id="mission-complete" bsSize="small" onClick={handleClickComplete} disabled={disabled}>
        <EtsBootstrap.Glyphicon glyph="ok" /> Выполнено
      </EtsBootstrap.Button>
      {
        Boolean(edcRequestIds) && (
          <ChangeStatusRequesFormLazy
            onHide={requestFormHide}
            array={edcRequestIds}
          />
        )
      }
    </>
  );
};

export default compose<ButtonCompleteMissionProps, ButtonCompleteMissionOwnProps>(
  connect<{  permissions: OneRegistryData['list']['permissions']['delete'] }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermission(),
  connect<ButtonCompleteMissionStateProps, ButtonCompleteMissionDispatchProps, ButtonCompleteMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
      actionCompleteMissionByIds: (...arg) => (
        dispatch(
          actionCompleteMissionByIds(...arg),
        )
      ),
      actionUnselectSelectedRowToShow: (...arg) => (
        dispatch(
          actionUnselectSelectedRowToShow(...arg),
        )
      ),
    }),
  ),
)(ButtonCompleteMission);
