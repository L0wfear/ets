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
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { registryWaybillKey } from 'components/new/pages/waybill/_config-data/registry-config';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

type ButtonRemoveStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
  userPermissionsSet: InitialStateSession['userData']['permissionsSet'];
};
type ButtonRemoveDispatchProps = {
  registryRemoveSelectedRows: HandleThunkActionCreator<typeof registryRemoveSelectedRows>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ButtonRemoveOwnProps = CommonTypesForButton & {
  onClick?: (selectedRow: any, checkedRows?: Record<string, any>) => Promise<any>;
};
type ButtonRemoveMergeProps = {};

type ButtonRemoveProps = (
  ButtonRemoveStateProps
  & ButtonRemoveDispatchProps
  & ButtonRemoveOwnProps
  & ButtonRemoveMergeProps
);

const ButtonRemove: React.FC<ButtonRemoveProps> = (props) => {
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
        if (props.onClick) {
          await props.onClick(props.selectedRow, props.checkedRows);
        } else {
          await props.registryRemoveSelectedRows(props.registryKey);
        }
      } catch (error) {
        handleClickCloseForm();
        return;
      }

      props.registryLoadDataByKey(props.registryKey);

      handleClickCloseForm();
    },
    [props.onClick, props.selectedRow, props.checkedRows],
  );
  const checkedRowsAsArray = Object.values(props.checkedRows);
  const checkedRowsLength = checkedRowsAsArray.length;

  const data = React.useMemo(
    () => (
      get(props, 'data', {} as ButtonRemoveOwnProps['data'])
    ),
    [props.data],
  );

  const disableBtnByRegistry = React.useMemo(() => {
    return props.registryKey === registryWaybillKey
      && (props.userPermissionsSet.has('waybill.delete_unless_closed') && !Boolean(checkedRowsLength) && props.selectedRow?.delete || checkedRowsAsArray.some((rowElem) => rowElem.delete))
      ? true
      : false;
  }, [ props.selectedRow, props.registryKey, checkedRowsAsArray, props.userPermissionsSet ]);

  return (
    <>
      <EtsBootstrap.Button id={`${props.registryKey}.open-remove-form`} bsSize="small" onClick={handleClickOpenForm} disabled={(!props.selectedRow && !Object.values(props.checkedRows).length) || disableBtnByRegistry}>
        <EtsBootstrap.Glyphicon glyph={data.glyph !== 'none' ? (data.glyph || 'remove') : null} />{data.title || 'Удалить'}

      </EtsBootstrap.Button>
      <ModalYesNo
        show={isOpenModalRemove}
        handleHide={handleClickCloseForm}
        handleSubmit={handleClickRemoveSelectedRows}

        message={
          checkedRowsLength === 1 || checkedRowsLength === 0
            ? data.message_multi || 'Вы уверены, что хотите удалить выбранный элемент?'
            : data.message_single || `Вы уверены, что хотите удалить выбранные элементы (${checkedRowsLength} шт)?`
        }

        titleOk={data.format === 'yesno' ? 'Да' : null}
        titleCancel={data.format === 'yesno' ? 'Нет' : null}
      />
    </>
  );
};

export default compose<ButtonRemoveProps, ButtonRemoveOwnProps>(
  connect<{  permissions: OneRegistryData['list']['permissions']['delete']; }, DispatchProp, { registryKey: string; }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermission(),
  connect<ButtonRemoveStateProps, ButtonRemoveDispatchProps, ButtonRemoveOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
      userPermissionsSet: getSessionState(state).userData.permissionsSet,
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
)(ButtonRemove);
