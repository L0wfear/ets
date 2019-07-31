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
import { actionFromArchiveDutyMissionByIds } from 'redux-main/reducers/modules/missions/duty_mission/actions';
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';

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

  const checkedRowsAsArray = Object.values(props.checkedRows);
  const disabled = !(
    checkedRowsAsArray.length
    || props.selectedRow
  );

  return (
    <>
      <EtsBootstrap.Button id="duty_mission-from-archive" bsSize="small" onClick={handleClickOpenForm} disabled={disabled}>
        Перенести из архива
      </EtsBootstrap.Button>
      <ModalYesNo
        show={isOpenModalRemove}
        handleHide={handleClickCloseForm}
        handleSubmit={handleClickToArchive}

        message={`Вы уверены, что хотите перенести из архива ${checkedRowsAsArray.length > 1 ? 'выбранные наряд-задания' : 'выбранное наряд-задание'}?`}
      />
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
