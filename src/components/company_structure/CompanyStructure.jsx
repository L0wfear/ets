import React from 'react';

import { connectToStores, staticProps } from 'utils/decorators';
import { Button, Glyphicon } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import CompanyStructureFormWrap from './CompanyStructureFormWrap.jsx';
import CompanyStructureTable from './CompanyStructureTable.jsx';

@connectToStores(['objects', 'session'])
@staticProps({
  listName: 'companyStructureLinearList',
})
export default class CompanyStructure extends ElementsList {

  componentDidMount() {
    super.componentDidMount();
    const linear = true;

    const { flux } = this.context;
    flux.getActions('companyStructure').getCompanyStructure();
    flux.getActions('companyStructure').getCompanyStructure(linear);
  }

  editElement = (id, e) => {
    e.stopPropagation();

    const { companyStructureLinearList = [] } = this.props;
    const selectedElement = companyStructureLinearList.find(el => el.id ? el.id === id : el[this.selectField] === id);

    this.setState({ showForm: true, selectedElement });
  }

  deleteElement = (id, e) => {
    e.stopPropagation();

    if (confirm('Вы уверены, что хотите удалить выбранный элемент?')) {
      this.context.flux.getActions('companyStructure').deleteCompanyElement(id);
    }
  }

  render() {
    const { companyStructureList = [] } = this.props;

    return (
      <div className="ets-page-wrap company-structure" ref={node => (this.node = node)}>
        <CompanyStructureTable
          data={companyStructureList}
          onActionEdit={this.editElement}
          onActionDelete={this.deleteElement}
        >
          <Button bsSize="small" onClick={this.createElement}><Glyphicon glyph="plus" /> Добавить подразделение</Button>
        </CompanyStructureTable>
        <CompanyStructureFormWrap
          onFormHide={this.onFormHide}
          element={this.state.selectedElement}
          showForm={this.state.showForm}
          {...this.props}
        />
      </div>
    );
  }
}
