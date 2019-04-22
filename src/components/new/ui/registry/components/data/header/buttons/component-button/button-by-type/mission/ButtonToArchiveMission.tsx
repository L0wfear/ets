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
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { get } from 'lodash';
import { actionToArchiveMissionByIds } from 'redux-main/reducers/modules/missions/mission/actions';
import { MISSION_STATUS } from 'constants/dictionary';

type ButtonToArchiveMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonToArchiveMissionDispatchProps = {
  actionToArchiveMissionByIds: HandleThunkActionCreator<typeof actionToArchiveMissionByIds>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonToArchiveMissionOwnProps = {
  registryKey: string;
};
type ButtonToArchiveMissionMergeProps = {};

type ButtonToArchiveMissionProps = (
  ButtonToArchiveMissionStateProps
  & ButtonToArchiveMissionDispatchProps
  & ButtonToArchiveMissionOwnProps
  & ButtonToArchiveMissionMergeProps
);

const ButtonToArchiveMission: React.FC<ButtonToArchiveMissionProps> = (props) => {
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
        await props.actionToArchiveMissionByIds(itemToArchiveAsArray.map(({ [props.uniqKey]: id }) => id));
      } catch (error) {
        console.error(error); // tslint:disable-line
        //
      }

      global.NOTIFICATION_SYSTEM.notify(
        `${
          itemToArchiveAsArray.length > 1
            ? 'Выбранные задания перенесены'
            : 'Выбранное задание перенесено'
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
    disabled = checkedRowsAsArray.some(({ status }: Mission) => status === MISSION_STATUS.assigned || status === MISSION_STATUS.in_progress || status === MISSION_STATUS.expired);
  } else {
    const status = get(props.selectedRow, 'status', null);
    disabled = !status || status === MISSION_STATUS.assigned || status === MISSION_STATUS.in_progress || status === MISSION_STATUS.expired;
  }

  return (
    <>
      <Button id="mission-to-archive" bsSize="small" onClick={handleClickOpenForm} disabled={disabled}>
        В архив
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
            {`Вы уверены, что хотите перенести в архив ${checkedRowsAsArray.length > 1 ? 'выбранные задания' : 'выбранное задание'}?`}
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

export default compose<ButtonToArchiveMissionProps, ButtonToArchiveMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonToArchiveMissionStateProps, ButtonToArchiveMissionDispatchProps, ButtonToArchiveMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
      actionToArchiveMissionByIds: (...arg) => (
        dispatch(
          actionToArchiveMissionByIds(...arg),
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
)(ButtonToArchiveMission);
