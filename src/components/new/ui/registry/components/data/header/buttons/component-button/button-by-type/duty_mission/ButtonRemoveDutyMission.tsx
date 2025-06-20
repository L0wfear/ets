import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { registryRemoveSelectedRows, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { get } from 'lodash';
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';
import { DUTY_MISSION_STATUS } from 'redux-main/reducers/modules/missions/duty_mission/constants';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonRemoveDutyMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonRemoveDutyMissionDispatchProps = {
  registryRemoveSelectedRows: HandleThunkActionCreator<typeof registryRemoveSelectedRows>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ButtonRemoveDutyMissionOwnProps = CommonTypesForButton & {};
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

  const selectedRow = props.selectedRow;
  const checkedRowsAsArray = Object.values(props.checkedRows);
  const checkedRowsLength = checkedRowsAsArray.length;
  if (checkedRowsLength) {
    disabled = checkedRowsAsArray.some((dutyMission: DutyMission) => dutyMission.status !== DUTY_MISSION_STATUS.not_assigned);
  } else {
    const status = get(props.selectedRow, 'status', null);
    disabled = !status || status !== DUTY_MISSION_STATUS.not_assigned;
  }

  return (
    <>
      <EtsBootstrap.Button id="remove-element" bsSize="small" onClick={handleClickOpenForm} disabled={disabled}>
        <EtsBootstrap.Glyphicon glyph="remove" /> Удалить
      </EtsBootstrap.Button>
      {(Boolean(checkedRowsLength) || Boolean(selectedRow))  && (
        <ModalYesNo
          show={isOpenModalRemove}
          handleHide={handleClickCloseForm}
          handleSubmit={handleClickRemoveSelectedRows}

          message={
            checkedRowsLength === 1 || selectedRow
              ? 'Вы уверены, что хотите удалить выбранный элемент?'
              : `Вы уверены, что хотите удалить выбранные элементы (${checkedRowsLength} шт)?`
          }
        />
      )}
    </>
  );
};

export default compose<ButtonRemoveDutyMissionProps, ButtonRemoveDutyMissionOwnProps>(
  connect<{  permissions: OneRegistryData['list']['permissions']['delete']; }, DispatchProp, { registryKey: string; }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermission(),
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
