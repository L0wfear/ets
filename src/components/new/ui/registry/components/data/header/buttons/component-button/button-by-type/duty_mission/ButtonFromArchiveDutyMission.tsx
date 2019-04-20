import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registryLoadDataByKey, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import EtsModal from 'components/new/ui/modal/Modal';
import { Modal } from 'react-bootstrap';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DUTY_MISSION_STATUS } from 'redux-main/reducers/modules/missions/mission/constants';
import { get } from 'lodash';
import { actionFromArchiveDutyMissionByIds } from 'redux-main/reducers/modules/missions/duty_mission/actions';

type ButtonFromArchiveDutyMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonFromArchiveDutyMissionDispatchProps = {
  actionFromArchiveDutyMissionByIds: HandleThunkActionCreator<typeof actionFromArchiveDutyMissionByIds>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonFromArchiveDutyMissionOwnProps = {
  registryKey: string;
};
type ButtonFromArchiveDutyMissionMergeProps = {};

type ButtonFromArchiveDutyMissionProps = (
  ButtonFromArchiveDutyMissionStateProps
  & ButtonFromArchiveDutyMissionDispatchProps
  & ButtonFromArchiveDutyMissionOwnProps
  & ButtonFromArchiveDutyMissionMergeProps
);

const ButtonFromArchiveDutyMission: React.FC<ButtonFromArchiveDutyMissionProps> = (props) => {
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
        await props.actionFromArchiveDutyMissionByIds(itemToArchiveAsArray.map(({ [props.uniqKey]: id }) => id));
      } catch (error) {
        console.error(error); // tslint:disable-line
        //
      }

      global.NOTIFICATION_SYSTEM.notify(
        `${
          itemToArchiveAsArray.length > 1
            ? 'Выбранные наряд-задания перенесены'
            : 'Выбранное наряд-задание перенесено'
        } из архива`,
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
      <Button id="duty_mission-from-archive" bsSize="small" onClick={handleClickOpenForm} disabled={disabled}>
        Перенести из архива
      </Button>
      <EtsModal
        show={isOpenModalRemove}
        bsSize="small"
        id="delete-form"
        onHide={handleClickCloseForm}
      >
        <Modal.Header>Внимание!</Modal.Header>
        <Modal.Body>
          <span>
            {`Вы уверены, что хотите перенести из архива ${checkedRowsAsArray.length > 1 ? 'выбранные наряд-задания' : 'выбранное наряд-задание'}?`}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button onClick={handleClickToArchive}>Ок</Button>
            <Button onClick={handleClickCloseForm}>Отмена</Button>
          </div>
        </Modal.Footer>
      </EtsModal>
    </>
  );
};

export default compose<ButtonFromArchiveDutyMissionProps, ButtonFromArchiveDutyMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonFromArchiveDutyMissionStateProps, ButtonFromArchiveDutyMissionDispatchProps, ButtonFromArchiveDutyMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
      actionFromArchiveDutyMissionByIds: (...arg) => (
        dispatch(
          actionFromArchiveDutyMissionByIds(...arg),
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
)(ButtonFromArchiveDutyMission);
