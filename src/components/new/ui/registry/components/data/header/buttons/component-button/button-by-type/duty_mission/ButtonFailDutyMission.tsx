import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registryLoadDataByKey, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DUTY_MISSION_STATUS } from 'redux-main/reducers/modules/missions/mission/constants';
import { get } from 'lodash';
import { actionFailDutyMissionByPartialData } from 'redux-main/reducers/modules/missions/duty_mission/actions';
import { DivNone } from 'global-styled/global-styled';
import DutyMissionFailForm from './form/DutyMissionFailForm';

type ButtonFailDutyMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonFailDutyMissionDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionFailDutyMissionByPartialData: HandleThunkActionCreator<typeof actionFailDutyMissionByPartialData>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonFailDutyMissionOwnProps = {
  registryKey: string;
};
type ButtonFailDutyMissionMergeProps = {};

type ButtonFailDutyMissionProps = (
  ButtonFailDutyMissionStateProps
  & ButtonFailDutyMissionDispatchProps
  & ButtonFailDutyMissionOwnProps
  & ButtonFailDutyMissionMergeProps
);

const ButtonFailDutyMission: React.FC<ButtonFailDutyMissionProps> = (props) => {
  const [missionsFail, setMissionsFail] = React.useState<DutyMission[]>([]);

  const handleClickFail = React.useCallback(
    async () => {
      const itemToRemove = props.checkedRows;

      if (!Object.values(itemToRemove).length) {
        itemToRemove[props.uniqKey] = props.selectedRow;
      }

      setMissionsFail(Object.values(itemToRemove));
    },
    [props.selectedRow, props.checkedRows],
  );

  const handlePopMissionsFail = React.useCallback(
    async () => {
      const missionsFailNew = missionsFail.slice(1);

      if (!missionsFailNew[0]) {
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
      await props.actionFailDutyMissionByPartialData(partialDutyMission);
      handlePopMissionsFail();
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
            <DutyMissionFailForm
              element={missionsFail[0]}
              handleHide={handlePopMissionsFail}
              handleSubmit={handleSubmit}

              page={props.registryKey}
            />
          )
          : (
            <DivNone />
          )
      }
    </>
  );
};

export default compose<ButtonFailDutyMissionProps, ButtonFailDutyMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
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
