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
import { get } from 'lodash';
import { actionCompleteMissionByIds } from 'redux-main/reducers/modules/missions/mission/actions';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type ButtonCompleteMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCompleteMissionDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionCompleteMissionByIds: HandleThunkActionCreator<typeof actionCompleteMissionByIds>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonCompleteMissionOwnProps = {
  registryKey: string;
};
type ButtonCompleteMissionMergeProps = {};

type ButtonCompleteMissionProps = (
  ButtonCompleteMissionStateProps
  & ButtonCompleteMissionDispatchProps
  & ButtonCompleteMissionOwnProps
  & ButtonCompleteMissionMergeProps
);

const ButtonCompleteMission: React.FC<ButtonCompleteMissionProps> = (props) => {
  const handleClickComplete = React.useCallback(
    async () => {
      const itemToRemove = props.checkedRows;

      if (!Object.values(itemToRemove).length) {
        itemToRemove[props.uniqKey] = props.selectedRow;
      }

      try {
        await props.actionCompleteMissionByIds(Object.values(itemToRemove).map(({ [props.uniqKey]: id }) => id));
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
    disabled = checkedRowsAsArray.some((mission: Mission) => !mission.can_be_closed);
  } else {
    const can_be_closed = get(props.selectedRow, 'can_be_closed', false);
    disabled = !can_be_closed;
  }

  return (
    <>
      <Button id="duty_mission-complete" bsSize="small" onClick={handleClickComplete} disabled={disabled}>
        <Glyphicon glyph="ok" /> Выполнено
      </Button>
    </>
  );
};

export default compose<ButtonCompleteMissionProps, ButtonCompleteMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
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
