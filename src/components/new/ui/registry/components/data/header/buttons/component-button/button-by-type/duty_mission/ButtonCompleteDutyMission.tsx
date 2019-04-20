import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
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
import { actionCompleteDutyMissionByIds } from 'redux-main/reducers/modules/missions/duty_mission/actions';

type ButtonCompleteDutyMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCompleteDutyMissionDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionCompleteDutyMissionByIds: HandleThunkActionCreator<typeof actionCompleteDutyMissionByIds>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonCompleteDutyMissionOwnProps = {
  registryKey: string;
};
type ButtonCompleteDutyMissionMergeProps = {};

type ButtonCompleteDutyMissionProps = (
  ButtonCompleteDutyMissionStateProps
  & ButtonCompleteDutyMissionDispatchProps
  & ButtonCompleteDutyMissionOwnProps
  & ButtonCompleteDutyMissionMergeProps
);

const ButtonCompleteDutyMission: React.FC<ButtonCompleteDutyMissionProps> = (props) => {
  const handleClickComplete = React.useCallback(
    async () => {
      const itemToRemove = props.checkedRows;

      if (!Object.values(itemToRemove).length) {
        itemToRemove[props.uniqKey] = props.selectedRow;
      }

      try {
        await props.actionCompleteDutyMissionByIds(Object.values(itemToRemove).map(({ [props.uniqKey]: id }) => id));
      } catch (error) {
        console.error(error); // tslint:disable-line
        //
      }

      props.actionUnselectSelectedRowToShow(props.registryKey, true);
      props.registryLoadDataByKey(props.registryKey);
    },
    [props.selectedRow, props.checkedRows],
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
      <Button id="duty_mission-complete" bsSize="small" onClick={handleClickComplete} disabled={disabled}>
        <Glyphicon glyph="ok" /> Отметка о выполнении
      </Button>
    </>
  );
};

export default compose<ButtonCompleteDutyMissionProps, ButtonCompleteDutyMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonCompleteDutyMissionStateProps, ButtonCompleteDutyMissionDispatchProps, ButtonCompleteDutyMissionOwnProps, ReduxState>(
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
      actionCompleteDutyMissionByIds: (...arg) => (
        dispatch(
          actionCompleteDutyMissionByIds(...arg),
        )
      ),
      actionUnselectSelectedRowToShow: (...arg) => (
        dispatch(
          actionUnselectSelectedRowToShow(...arg),
        )
      ),
    }),
  ),
)(ButtonCompleteDutyMission);
