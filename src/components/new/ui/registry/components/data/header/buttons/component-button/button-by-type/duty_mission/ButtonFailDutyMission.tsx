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
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { get } from 'lodash';
import { actionFailDutyMissionByPartialData } from 'redux-main/reducers/modules/missions/duty_mission/actions';
import { DivNone } from 'global-styled/global-styled';
import DutyMissionFailForm from './form/DutyMissionFailForm';
import ChangeStatusRequesFormLazy from 'components/new/pages/edc_request/form/changeStatusRequesForm';
import { DUTY_MISSION_STATUS } from 'redux-main/reducers/modules/missions/duty_mission/constants';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonFailDutyMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonFailDutyMissionDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionFailDutyMissionByPartialData: HandleThunkActionCreator<typeof actionFailDutyMissionByPartialData>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
};
type ButtonFailDutyMissionOwnProps = CommonTypesForButton & {};
type ButtonFailDutyMissionMergeProps = {};

type ButtonFailDutyMissionProps = (
  ButtonFailDutyMissionStateProps
  & ButtonFailDutyMissionDispatchProps
  & ButtonFailDutyMissionOwnProps
  & ButtonFailDutyMissionMergeProps
);

const ButtonFailDutyMission: React.FC<ButtonFailDutyMissionProps> = (props) => {
  const [missionsFail, setMissionsFail] = React.useState<Array<DutyMission>>([]);
  const [edcRequestIds, setEdcRequestIds] = React.useState(null);
  const requestFormHide = React.useCallback(
    () => {
      setEdcRequestIds(null);

      props.actionUnselectSelectedRowToShow(props.registryKey, true);
      props.registryLoadDataByKey(props.registryKey);
    },
    [],
  );

  const handleClickFail = React.useCallback(
    async () => {
      const itemToRemove = props.checkedRows;

      if (!Object.values(itemToRemove).length) {
        itemToRemove[props.selectedRow[props.uniqKey]] = props.selectedRow;
      }

      setMissionsFail(Object.values(itemToRemove));
    },
    [props.selectedRow, props.checkedRows],
  );

  const handlePopMissionsFail = React.useCallback(
    () => {
      const missionsFailNew = missionsFail.slice(1);
      if (!missionsFailNew.length) {
        props.actionUnselectSelectedRowToShow(props.registryKey, true);
        props.registryLoadDataByKey(props.registryKey);
      }
      setMissionsFail(
        missionsFailNew,
      );
    },
    [missionsFail],
  );

  const handleSubmit = React.useCallback(
    async (partialDutyMission) => {
      try {
        const response = await props.actionFailDutyMissionByPartialData(partialDutyMission, { page: props.registryKey });
        const { request_id, request_number, close_request } = response;

        const successEdcRequestIds = close_request
          ? [{request_id, request_number}]
          : null;

        if (successEdcRequestIds) {
          setEdcRequestIds(successEdcRequestIds);
          // return;
        }
        handlePopMissionsFail();
      } catch (error) {
        console.error(error);// tslint:disable-line
      }
    },
    [handlePopMissionsFail],
  );

  let disabled = false;

  const checkedRowsAsArray = Object.values(props.checkedRows);
  if (checkedRowsAsArray.length) {
    disabled = checkedRowsAsArray.some((dutyMission: DutyMission) => dutyMission.status !== DUTY_MISSION_STATUS.assigned);
  } else {
    const status = get(props.selectedRow, 'status', null);
    disabled = !status || status !== DUTY_MISSION_STATUS.assigned;
  }
  return (
    <>
      <EtsBootstrap.Button id="duty_mission-reject" bsSize="small" onClick={handleClickFail} disabled={disabled}>
        <EtsBootstrap.Glyphicon glyph="ban-circle" /> Отметка о невыполнении
      </EtsBootstrap.Button>
      {
        missionsFail[0]
          ? (
            <>
              <DutyMissionFailForm
                element={{...missionsFail[0]}}
                handleHide={handlePopMissionsFail}
                handleSubmit={handleSubmit}

                page={props.registryKey}
              />
            </>
          )
          : (
            <DivNone />
          )
      }
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

export default compose<ButtonFailDutyMissionProps, ButtonFailDutyMissionOwnProps>(
  connect<{  permissions: OneRegistryData['list']['permissions']['delete']; }, DispatchProp, { registryKey: string; }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermission(),
  connect<ButtonFailDutyMissionStateProps, ButtonFailDutyMissionDispatchProps, ButtonFailDutyMissionOwnProps, ReduxState>(
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
      actionFailDutyMissionByPartialData: (...arg) => (
        dispatch(
          actionFailDutyMissionByPartialData(...arg),
        )
      ),
      actionUnselectSelectedRowToShow: (...arg) => (
        dispatch(
          actionUnselectSelectedRowToShow(...arg),
        )
      ),
    }),
  ),
)(ButtonFailDutyMission);
