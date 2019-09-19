import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';

import { registryLoadDataByKey, registryRemoveSelectedRows } from 'components/new/ui/registry/module/actions-registy';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import ModalYesNo from 'components/new/ui/modal/yes_no_form/ModalYesNo';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ButtonRemoveCompanyStructureStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  permissions: OneRegistryData['list']['permissions']['delete'];
};
type ButtonRemoveCompanyStructureDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
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
      async (e) => {
        e.stopPropagation();
        try {
          await props.registryRemoveSelectedRows(props.registryKey, [props.rowData]);
        } catch (error) {
          handleClickCloseForm();
          return;
        }

        props.registryLoadDataByKey(props.registryKey);
        handleClickCloseForm();
      },
      [props.rowData],
    );

    return (
      <React.Fragment>
        <EtsBootstrap.Button onClick={handleClickOpenForm}>Удалить</EtsBootstrap.Button>
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
  withRequirePermission(),
)(ButtonRemoveCompanyStructure);
