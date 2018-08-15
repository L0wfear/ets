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

    const { flux } = this.context;
    Promise.all([
      flux.getActions('companyStructure').getCompanyStructure(),
      flux.getActions('companyStructure').getLinearCompanyStructure(),
    ]).catch(({ error_text }) => {
      console.warn(error_text);
    });
  }

  editElement = async (id, e) => {
    e.stopPropagation();
    try {
      await this.context.flux.getActions('companyStructure').getLinearCompanyStructure();
    } catch ({ error_text }) {
      console.warn(error_text);
    };
    const { companyStructureLinearList = [] } = this.props;
    const selectedElement = companyStructureLinearList.find(el => el.id ? el.id === id : el[this.selectField] === id);

    this.setState({ showForm: true, selectedElement });
  }

  deleteElement = async(id, e) => {
    e.stopPropagation();
    try {
      await confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить выбранный элемент?',
      });
    } catch (er) {
      return;
    }

    this.context.flux.getActions('companyStructure').deleteCompanyElement(id)
      .catch(({ error_text }) => {
        console.warn(error_text);
      });
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
