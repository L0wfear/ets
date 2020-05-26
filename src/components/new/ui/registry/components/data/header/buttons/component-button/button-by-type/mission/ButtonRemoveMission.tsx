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
import { get } from 'lodash';
import { MISSION_STATUS } from 'redux-main/reducers/modules/missions/mission/constants';
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonRemoveMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonRemoveMissionDispatchProps = {
  registryRemoveSelectedRows: HandleThunkActionCreator<typeof registryRemoveSelectedRows>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ButtonRemoveMissionOwnProps = CommonTypesForButton & {};
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
  const checkedRowsLength = checkedRowsAsArray.length;
  if (checkedRowsLength) {
    disabled = checkedRowsAsArray.some((mission: Mission) => mission.status !== MISSION_STATUS.not_assigned);
  } else {
    const status = get(props.selectedRow, 'status', null);
    disabled = !status || status !== MISSION_STATUS.not_assigned;
  }

  return (
    <>
      <EtsBootstrap.Button id="remove-element" bsSize="small" onClick={handleClickOpenForm} disabled={disabled}>
        <EtsBootstrap.Glyphicon glyph="remove" /> Удалить
      </EtsBootstrap.Button>
      {checkedRowsLength && (
        <ModalYesNo
          show={isOpenModalRemove}
          handleHide={handleClickCloseForm}
          handleSubmit={handleClickRemoveSelectedRows}

          message={
            checkedRowsLength === 1
              ? 'Вы уверены, что хотите удалить выбранный элемент?'
              : `Вы уверены, что хотите удалить выбранные элементы (${checkedRowsLength} шт)?`
          }
        />
      )}
    </>
  );
};

export default compose<ButtonRemoveMissionProps, ButtonRemoveMissionOwnProps>(
  connect<any, DispatchProp, { registryKey: string; }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermission(),
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
