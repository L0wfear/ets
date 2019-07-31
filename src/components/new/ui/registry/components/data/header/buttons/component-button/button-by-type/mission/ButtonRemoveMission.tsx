import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registryRemoveSelectedRows, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { get } from 'lodash';
import { MISSION_STATUS } from 'constants/dictionary';
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';

type ButtonRemoveMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonRemoveMissionDispatchProps = {
  registryRemoveSelectedRows: HandleThunkActionCreator<typeof registryRemoveSelectedRows>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ButtonRemoveMissionOwnProps = {
  registryKey: string;
};
type ButtonRemoveMissionMergeProps = {};

type ButtonRemoveMissionProps = (
  ButtonRemoveMissionStateProps
  & ButtonRemoveMissionDispatchProps
  & ButtonRemoveMissionOwnProps
  & ButtonRemoveMissionMergeProps
);

const ButtonRemoveMission: React.FC<ButtonRemoveMissionProps> = (props) => {
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
        handleClickCloseForm();
        return;
      }

      props.registryLoadDataByKey(props.registryKey);

      handleClickCloseForm();
    },
    [props.selectedRow, props.checkedRows],
  );

  let disabled = false;

  const checkedRowsAsArray = Object.values(props.checkedRows);
  if (checkedRowsAsArray.length) {
    disabled = checkedRowsAsArray.some((dutyMission: DutyMission) => dutyMission.status !== MISSION_STATUS.not_assigned);
  } else {
    const status = get(props.selectedRow, 'status', null);
    disabled = !status || status !== MISSION_STATUS.not_assigned;
  }

  return (
    <>
      <EtsBootstrap.Button id="remove-element" bsSize="small" onClick={handleClickOpenForm} disabled={disabled}>
        <EtsBootstrap.Glyphicon glyph="remove" /> Удалить
      </EtsBootstrap.Button>
      <ModalYesNo
        show={isOpenModalRemove}
        handleHide={handleClickCloseForm}
        handleSubmit={handleClickRemoveSelectedRows}

        message={`Вы уверены, что хотите удалить ${checkedRowsAsArray.length > 1 ? 'выбранные элементы' : 'выбранный элемент'}?`}
      />
    </>
  );
};

export default compose<ButtonRemoveMissionProps, ButtonRemoveMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonRemoveMissionStateProps, ButtonRemoveMissionDispatchProps, ButtonRemoveMissionOwnProps, ReduxState>(
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
)(ButtonRemoveMission);
