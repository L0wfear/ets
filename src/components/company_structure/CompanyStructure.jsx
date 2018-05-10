import React from 'react';
import { Button as BootstrapButton, Glyphicon } from 'react-bootstrap';

import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

import CompanyStructureFormWrap from './CompanyStructureFormWrap.jsx';
import CompanyStructureTable from './CompanyStructureTable.jsx';

const Button = enhanceWithPermissions(BootstrapButton);

@connectToStores(['objects', 'session'])
@staticProps({
  entity: 'company_structure',
  listName: 'companyStructureLinearList',
})
export default class CompanyStructure extends ElementsList {

  componentDidMount() {
    super.componentDidMount();
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
    await this.refreshState();

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
    this.context.flux.getActions('companyStructure').deleteCompanyElement(id).then(() => this.refreshState());
  }

  render() {
    const { companyStructureList = [] } = this.props;

    return (
      <div className="ets-page-wrap company-structure" ref={node => (this.node = node)}>
        <CompanyStructureTable
          data={companyStructureList}
          onActionEdit={this.editElement}
          onActionDelete={this.deleteElement}
          entity={this.entity}
        >
          <Button bsSize="small" permissions={[`${this.entity}.create`]} onClick={this.createElement}><Glyphicon glyph="plus" /> Добавить подразделение</Button>
        </CompanyStructureTable>
        <CompanyStructureFormWrap
          onFormHide={this.onFormHide}
          element={this.state.selectedElement}
          showForm={this.state.showForm}
          refreshState={this.refreshState}
          {...this.props}
        />
      </div>
    );
  }
}
