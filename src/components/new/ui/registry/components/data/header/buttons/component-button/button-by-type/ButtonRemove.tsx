import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registryRemoveSelectedRows, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';

type ButtonRemoveStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonRemoveDispatchProps = {
  registryRemoveSelectedRows: HandleThunkActionCreator<typeof registryRemoveSelectedRows>;
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
};
type ButtonRemoveOwnProps = {
  registryKey: string;

  format?: 'yesno' | 'default';
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
  const checkedRowsAsArray = Object.values(props.checkedRows);

  return (
    <>
      <EtsBootstrap.Button id="open-update-form" bsSize="small" onClick={handleClickOpenForm} disabled={!props.selectedRow && !Object.values(props.checkedRows).length}>
        <EtsBootstrap.Glyphicon glyph="remove" /> Удалить
      </EtsBootstrap.Button>
      <ModalYesNo
        show={isOpenModalRemove}
        handleHide={handleClickCloseForm}
        handleSubmit={handleClickRemoveSelectedRows}

        message={`Вы уверены, что хотите удалить ${checkedRowsAsArray.length > 1 ? 'выбранные элементы' : 'выбранный элемент'}?`}

        titleOk={props.format === 'yesno' ? 'Да' : null}
        titleCancel={props.format === 'yesno' ? 'Нет' : null}
      />
    </>
  );
};

export default compose<ButtonRemoveProps, ButtonRemoveOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonRemoveStateProps, ButtonRemoveDispatchProps, ButtonRemoveOwnProps, ReduxState>(
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
)(ButtonRemove);
