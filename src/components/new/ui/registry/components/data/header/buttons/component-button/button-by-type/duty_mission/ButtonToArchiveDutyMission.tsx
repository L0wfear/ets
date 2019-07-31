import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
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
import { actionToArchiveDutyMissionByIds } from 'redux-main/reducers/modules/missions/duty_mission/actions';
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';

type ButtonToArchiveDutyMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonToArchiveDutyMissionDispatchProps = {
  actionToArchiveDutyMissionByIds: HandleThunkActionCreator<typeof actionToArchiveDutyMissionByIds>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonToArchiveDutyMissionOwnProps = {
  registryKey: string;
};
type ButtonToArchiveDutyMissionMergeProps = {};

type ButtonToArchiveDutyMissionProps = (
  ButtonToArchiveDutyMissionStateProps
  & ButtonToArchiveDutyMissionDispatchProps
  & ButtonToArchiveDutyMissionOwnProps
  & ButtonToArchiveDutyMissionMergeProps
);

const ButtonToArchiveDutyMission: React.FC<ButtonToArchiveDutyMissionProps> = (props) => {
  const [isOpenModalRemove, setIsOpenModalRemove] = React.useState(false);

  const handleClickOpenForm = React.useCallback(
    () => {
      setIsOpenModalRemove(true);
    },
    [],
  );
  const handleClickCloseForm = React.useCallback(
    () => {
      setIsOpenModalRemove(false);
    },
    [],
  );

  const handleClickToArchive = React.useCallback(
    async () => {
      const itemToArchive = props.checkedRows;

      if (!Object.values(itemToArchive).length) {
        itemToArchive[props.uniqKey] = props.selectedRow;
      }

      const itemToArchiveAsArray = Object.values(itemToArchive);

      try {
        await props.actionToArchiveDutyMissionByIds(itemToArchiveAsArray.map(({ [props.uniqKey]: id }) => id));
      } catch (error) {
        console.error(error); // tslint:disable-line
        //
      }

      global.NOTIFICATION_SYSTEM.notify(
        `${
          itemToArchiveAsArray.length > 1
            ? 'Выбранные наряд-задания перенесены'
            : 'Выбранное наряд-задание перенесено'
        } в архив`,
      );

      props.actionUnselectSelectedRowToShow(props.registryKey, true);
      props.registryLoadDataByKey(props.registryKey);
      handleClickCloseForm();
    },
    [props.selectedRow, props.checkedRows],
  );

  let disabled = false;

  const checkedRowsAsArray = Object.values(props.checkedRows);
  if (checkedRowsAsArray.length) {
    disabled = checkedRowsAsArray.some((dutyMission: DutyMission) => dutyMission.status === DUTY_MISSION_STATUS.assigned);
  } else {
    const status = get(props.selectedRow, 'status', null);
    disabled = !status || status === DUTY_MISSION_STATUS.assigned;
  }

  return (
    <>
      <EtsBootstrap.Button id="duty_mission-to-archive" bsSize="small" onClick={handleClickOpenForm} disabled={disabled}>
        В архив
      </EtsBootstrap.Button>
      <ModalYesNo
        show={isOpenModalRemove}
        handleHide={handleClickCloseForm}
        handleSubmit={handleClickToArchive}

        message={`Вы уверены, что хотите перенести в архив ${checkedRowsAsArray.length > 1 ? 'выбранные наряд-задания' : 'выбранное наряд-задание'}?`}
      />
    </>
  );
};

export default compose<ButtonToArchiveDutyMissionProps, ButtonToArchiveDutyMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonToArchiveDutyMissionStateProps, ButtonToArchiveDutyMissionDispatchProps, ButtonToArchiveDutyMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
      actionToArchiveDutyMissionByIds: (...arg) => (
        dispatch(
          actionToArchiveDutyMissionByIds(...arg),
        )
      ),
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
      actionUnselectSelectedRowToShow: (...arg) => (
        dispatch(
          actionUnselectSelectedRowToShow(...arg),
        )
      ),
    }),
  ),
)(ButtonToArchiveDutyMission);
