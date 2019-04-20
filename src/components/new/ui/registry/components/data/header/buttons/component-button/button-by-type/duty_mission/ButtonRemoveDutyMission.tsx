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
import { registryRemoveSelectedRows, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import EtsModal from 'components/new/ui/modal/Modal';
import { Modal } from 'react-bootstrap';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DUTY_MISSION_STATUS } from 'redux-main/reducers/modules/missions/mission/constants';
import { get } from 'lodash';

type ButtonRemoveDutyMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonRemoveDutyMissionDispatchProps = {
  registryRemoveSelectedRows: HandleThunkActionCreator<typeof registryRemoveSelectedRows>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ButtonRemoveDutyMissionOwnProps = {
  registryKey: string;
};
type ButtonRemoveDutyMissionMergeProps = {};

type ButtonRemoveDutyMissionProps = (
  ButtonRemoveDutyMissionStateProps
  & ButtonRemoveDutyMissionDispatchProps
  & ButtonRemoveDutyMissionOwnProps
  & ButtonRemoveDutyMissionMergeProps
);

const ButtonRemoveDutyMission: React.FC<ButtonRemoveDutyMissionProps> = (props) => {
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
  const handleClickRemoveSelectedRows = React.useCallback(
    async () => {
      const itemToRemove = props.checkedRows;

      if (!Object.values(itemToRemove).length) {
        itemToRemove[props.uniqKey] = props.selectedRow;
      }

      try {
        await props.registryRemoveSelectedRows(props.registryKey);
      } catch (error) {
        console.error(error); // tslint:disable-line
        //
      }

      props.registryLoadDataByKey(props.registryKey);

      handleClickCloseForm();
    },
    [props.selectedRow, props.checkedRows],
  );

  let disabled = false;

  const checkedRowsAsArray = Object.values(props.checkedRows);
  if (checkedRowsAsArray.length) {
    disabled = checkedRowsAsArray.some((dutyMission: DutyMission) => dutyMission.status !== DUTY_MISSION_STATUS.not_assigned);
  } else {
    const status = get(props.selectedRow, 'status', null);
    disabled = !status || status !== DUTY_MISSION_STATUS.not_assigned;
  }

  return (
    <>
      <Button id="remove-element" bsSize="small" onClick={handleClickOpenForm} disabled={disabled}>
        <Glyphicon glyph="remove" /> Удалить
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
            {`Вы уверены, что хотите удалить ${checkedRowsAsArray.length > 1 ? 'выбранные элементы' : 'выбранный элемент'}?`}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button onClick={handleClickRemoveSelectedRows}>Ок</Button>
            <Button onClick={handleClickCloseForm}>Отмена</Button>
          </div>
        </Modal.Footer>
      </EtsModal>
    </>
  );
};

export default compose<ButtonRemoveDutyMissionProps, ButtonRemoveDutyMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonRemoveDutyMissionStateProps, ButtonRemoveDutyMissionDispatchProps, ButtonRemoveDutyMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
      registryRemoveSelectedRows: (...arg) => (
        dispatch(
          registryRemoveSelectedRows(...arg),
        )
      ),
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
    }),
  ),
)(ButtonRemoveDutyMission);
