import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { Button } from 'react-bootstrap';
import { registryLoadDataByKey, registrySetSelectedRowToShowInForm, registryRemoveSelectedRows } from 'components/new/ui/registry/module/actions-registy';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';

type ButtonRemoveCompanyStructureStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  permissions: string | boolean;
};
type ButtonRemoveCompanyStructureDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  registrySetSelectedRowToShowInForm: HandleThunkActionCreator<typeof registrySetSelectedRowToShowInForm>;
  registryRemoveSelectedRows: HandleThunkActionCreator<typeof registryRemoveSelectedRows>;
};
type ButtonRemoveCompanyStructureOwnProps = {
  registryKey: string;
  rowData: CompanyStructure;
};
type ButtonRemoveCompanyStructureMergedProps = (
  ButtonRemoveCompanyStructureStateProps
  & ButtonRemoveCompanyStructureDispatchProps
  & ButtonRemoveCompanyStructureOwnProps
);

type ButtonRemoveCompanyStructureProps = ButtonRemoveCompanyStructureMergedProps;

const ButtonRemoveCompanyStructure: React.FC<ButtonRemoveCompanyStructureProps> = React.memo(
  (props) => {
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
          await props.registryRemoveSelectedRows(props.registryKey, [props.rowData]);
        } catch (error) {
          handleClickCloseForm();
          return;
        }

        props.registryLoadDataByKey(props.registryKey);
        props.registrySetSelectedRowToShowInForm(props.registryKey, null);
        handleClickCloseForm();
      },
      [props.rowData],
    );

    return (
      <React.Fragment>
        <Button onClick={handleClickOpenForm}>Удалить</Button>
        <ModalYesNo
          show={isOpenModalRemove}
          handleHide={handleClickCloseForm}
          handleSubmit={handleClickRemoveSelectedRows}

          message="Вы уверены, что хотите удалить выбранный элемент?"
        />
      </React.Fragment>
    );
  },
);

export default compose<ButtonRemoveCompanyStructureProps, ButtonRemoveCompanyStructureOwnProps>(
  connect<ButtonRemoveCompanyStructureStateProps, ButtonRemoveCompanyStructureDispatchProps, ButtonRemoveCompanyStructureOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      permissions: getListData(state.registry, registryKey).permissions.delete, //  прокидывается в следующий компонент
    }),
    (dispatch: any) => ({
      registrySetSelectedRowToShowInForm: (...arg) => (
        dispatch(
          registrySetSelectedRowToShowInForm(...arg),
        )
      ),
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
      registryRemoveSelectedRows: (...arg) => (
        dispatch(
          registryRemoveSelectedRows(...arg),
        )
      ),
    }),
  ),
  withRequirePermissionsNew(),
)(ButtonRemoveCompanyStructure);
