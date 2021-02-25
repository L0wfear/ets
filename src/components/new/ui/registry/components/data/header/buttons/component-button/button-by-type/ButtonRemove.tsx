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
import { registryKey } from 'components/new/pages/nsi/autobase/pages/tachograph/_config-data/registry-config';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';

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
  disabled: boolean;
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

  const isPermitedWaybillDeleteUnlessClosed = React.useMemo(
    () => props.userPermissionsSet.has( waybillPermissions.delete_unless_closed)
      && (Boolean(checkedRowsLength) || props.selectedRow)
      && (
        props.selectedRow?.status === 'draft'
        || props.selectedRow?.status === 'active'
      )
      && !props.selectedRow?.delete
      && !checkedRowsAsArray.some((rowElem) => rowElem.status === 'closed' || rowElem.delete),
    [
      props.userPermissionsSet,
      checkedRowsLength,
      props.selectedRow,
      checkedRowsAsArray,
    ]
  );

  const isPermitedWaybillDelete = React.useMemo(
    () => props.userPermissionsSet.has(waybillPermissions.delete)
      && (
        (Boolean(checkedRowsLength) || props.selectedRow)
        && !props.selectedRow?.delete
        || checkedRowsAsArray.some((rowElem) => rowElem.delete)
      ),
    [
      props.userPermissionsSet,
      checkedRowsLength,
      props.selectedRow,
      checkedRowsAsArray,
    ]);

  const disableBtnWaybill = React.useMemo(
    () => Boolean(
      !isPermitedWaybillDeleteUnlessClosed
      && !isPermitedWaybillDelete
    ),
    [
      isPermitedWaybillDeleteUnlessClosed,
      isPermitedWaybillDelete,
    ]);

  const disableBtnByRegistry = React.useMemo(
    () => props.registryKey === registryWaybillKey && disableBtnWaybill,
    [
      props.selectedRow,
      props.registryKey,
      checkedRowsAsArray,
      props.userPermissionsSet,
      registryWaybillKey,
      disableBtnWaybill,
    ]);

  const tachographRegistry = React.useMemo(
    () => props.registryKey === registryKey,
    [
      props.registryKey
    ]);

  const buttonOK = React.useMemo(
    () => tachographRegistry ? 'Удалить' : 'Да',
    [
      tachographRegistry
    ]);

  const buttonNo = React.useMemo(
    () => tachographRegistry ? 'Отмена' : 'Нет',
    [
      tachographRegistry
    ]);

  const isDisabledByParams = React.useMemo(() => {
    const checkedRows = Object.values(props.checkedRows);
    if ((props.selectedRow || checkedRows.length) && data.paramsForDisabling) {
      const rows = checkedRows.length ? checkedRows : [props.selectedRow];
      return Object.entries(data.paramsForDisabling).some(([key, value]) => rows.some((el) => el[key] === value));
    }
    return false;
  }, [props.selectedRow, props.checkedRows, data.paramsForDisabling]);

  return (
    <>
      <EtsBootstrap.Button 
        id={`${props.registryKey}.open-remove-form`} 
        bsSize="small" onClick={handleClickOpenForm} 
        disabled={(!props.selectedRow && !Object.values(props.checkedRows).length) || disableBtnByRegistry || props.disabled || isDisabledByParams}>

        <EtsBootstrap.Glyphicon glyph={data.glyph !== 'none' ? (data.glyph || 'remove') : null} />{data.title || 'Удалить'}

      </EtsBootstrap.Button>
      <ModalYesNo
        show={isOpenModalRemove}
        handleHide={handleClickCloseForm}
        handleSubmit={handleClickRemoveSelectedRows}

        message={
          checkedRowsLength === 1 || checkedRowsLength === 0
            ? data.message_single || 'Вы уверены, что хотите удалить выбранный элемент?'
            : data.message_multi || `Вы уверены, что хотите удалить выбранные элементы (${checkedRowsLength} шт)?`
        }

        titleOk={(data.format === 'yesno' || tachographRegistry) ? buttonOK : null}
        titleCancel={(data.format === 'yesno' || tachographRegistry) ? buttonNo : null}
      />
    </>
  );
};

export default compose<ButtonRemoveProps, ButtonRemoveOwnProps>(
  connect<{  permissions: Array<OneRegistryData['list']['permissions']['delete']>; }, DispatchProp, { registryKey: string; }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: [
        getListData(state.registry, registryKey).permissions.delete,
        getListData(state.registry, registryKey).permissions.delete_unless_closed,
      ], //  прокидывается в следующий компонент
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
