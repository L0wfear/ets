import React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import permissions from 'components/company_structure/config-data/permissions';
import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';

import CompanyStructureFormWrap from 'components/company_structure/CompanyStructureFormWrap';
import CompanyStructureTable from 'components/company_structure/CompanyStructureTable';

import {
  EtsPageWrapCompanyStructure,
} from 'components/company_structure/styled/styled';

const ButtonAddStructure = enhanceWithPermissions({
  permission: permissions.create,
})(Button);

@connectToStores(['objects', 'session'])
@staticProps({
  entity: 'company_structure',
  permissions,
  listName: 'companyStructureLinearList',
})
class CompanyStructure extends ElementsList {

  init() {
    this.refreshState();
  }

  refreshState = () => {
    const linear = true;

    const { flux } = this.context;

    const query = [
      flux.getActions('companyStructure').getCompanyStructure(),
      flux.getActions('companyStructure').getCompanyStructure(linear),
    ];

    return Promise.all(query);
  }

  editElement = async (id, e) => {
    e.stopPropagation();
    try {
      await this.refreshState();
    } catch ({ error_text }) {
      console.warn(error_text);
    }

    const { companyStructureLinearList = [] } = this.props;
    const selectedElement = companyStructureLinearList.find(el => el.id ? el.id === id : el[this.selectField] === id);
    this.setState({ showForm: true, selectedElement });
  }

  deleteElement = async (id, e) => {
    e.stopPropagation();
    try {
      await confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить выбранные элементы?',
      });
    } catch (err) {
      // отмена
    }
    this.context.flux.getActions('companyStructure').deleteCompanyElement(id)
      .then(() => this.refreshState())
      .catch(({ error_text }) => {
        console.warn(error_text);
      });
  }

  setNode = (node) => {
    this.node = node;
  }

  render() {
    const { companyStructureList = [] } = this.props;

    return (
      <EtsPageWrapCompanyStructure ref={this.setNode}>
        <CompanyStructureTable
          data={companyStructureList}
          onActionEdit={this.editElement}
          onActionDelete={this.deleteElement}
          entity={this.entity}
        >
          <ButtonAddStructure bsSize="small" onClick={this.createElement} ><Glyphicon glyph="plus" /> Добавить подразделение</ButtonAddStructure>
        </CompanyStructureTable>
        <CompanyStructureFormWrap
          onFormHide={this.onFormHide}
          element={this.state.selectedElement}
          showForm={this.state.showForm}
          refreshState={this.refreshState}
          {...this.props}
        />
      </EtsPageWrapCompanyStructure>
    );
  }
}

export default CompanyStructure;
