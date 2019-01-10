import React from 'react';
import { get } from 'lodash';

import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import permissions from 'components/company_structure/config-data/permissions';
import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';

import CompanyStructureFormWrap from 'components/company_structure/CompanyStructureForm/CompanyStructureFormWrap';
import CompanyStructureTable from 'components/company_structure/CompanyStructureTable';
import { connect } from 'react-redux';
import { getCompanyStructureState } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

const ButtonAddStructure = enhanceWithPermissions({
  permission: permissions.create,
})(Button);

const loadingPageName = 'company-structure';

@connectToStores(['session'])
@staticProps({
  entity: 'company_structure',
  permissions,
  tableComponent: CompanyStructureTable,
  formComponent: CompanyStructureFormWrap,
  listName: 'companyStructureLinearList',
})
class CompanyStructureList extends ElementsList {
  init() {
    this.refreshState();
  }

  componentWillUnmount() {
    this.props.resetSetCompanyStructureAll();
  }

  refreshState = () => (
    Promise.all([
      this.props.getAndSetInStoreCompanyStructure(),
      this.props.getAndSetInStoreCompanyStructureLinear(),
    ])
  )

  editElement = (companyStructure, e) => {
    e.stopPropagation();

    if (companyStructure) {
      this.setState({ showForm: true, selectedElement: companyStructure });
    }
  }

  deleteElement = async (companyStructure, e) => {
    e.stopPropagation();
    try {
      await confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить выбранные элементы?',
      });
    } catch (err) {
      // отмена
      return;
    }
    try {
      this.props.deleteCompanyElement(
        get(
          companyStructure,
          this.selectField,
        ),
      );

      this.refreshState();
    } catch (error) {
      const error_text = get(error, 'error_text', 'ошибка');
      console.warn(error_text); // eslint-disable-line
    }
  }

  onFormHide = (isSubmited) => {
    const changeState = {
      showForm: false,
    };

    if (isSubmited) {
      this.refreshState();
      changeState.selectedElement = null;
    }

    this.setState(changeState);
  }

  getSelectedProps() {
    return null;
  }

  getAdditionalProps() {
    const { companyStructureList = [] } = this.props;

    return {
      data: companyStructureList,
      onActionEdit: this.editElement,
      onActionDelete: this.deleteElement,
      loadingPageName,
    };
  }

  getAdditionalFormProps() {
    return {
      loadingPageName,
    };
  }

  getButtons() {
    return [
      <ButtonAddStructure id="create" key="create" bsSize="small" onClick={this.createElement}>
        <Glyphicon glyph="plus" />
        Добавить подразделение
      </ButtonAddStructure>,
    ];
  }
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    state => ({
      companyStructureList: getCompanyStructureState(state).companyStructureList,
      companyStructureLinearList: getCompanyStructureState(state).companyStructureLinearList,
    }),
    dispatch => ({
      getAndSetInStoreCompanyStructure: () => (
        dispatch(
          companyStructureActions.getAndSetInStoreCompanyStructure(
            {},
            { page: loadingPageName },
          ),
        )
      ),
      getAndSetInStoreCompanyStructureLinear: () => (
        dispatch(
          companyStructureActions.getAndSetInStoreCompanyStructureLinear(
            {},
            { page: loadingPageName },
          ),
        )
      ),
      resetSetCompanyStructureAll: () => (
        dispatch(
          companyStructureActions.resetSetCompanyStructureAll(),
        )
      ),
      deleteCompanyElement: id => (
        dispatch(
          companyStructureActions.removeCompanyStructure(
            id,
            { page: loadingPageName },
          ),
        )
      ),
    }),
  ),
)(CompanyStructureList);
