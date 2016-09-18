import React from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import CompanyStructureFormWrap from './CompanyStructureFormWrap.jsx';
import CompanyStructureTable from './CompanyStructureTable.jsx';

@autobind
class CompanyStructure extends ElementsList {

  constructor(props) {
    super(props);

    this.mainListName = 'companyStructureLinearList';
  }

  async getLinearCompanyStructure() {
    const companyStructureLinearList = await this.context.flux.getActions('companyStructure').getLinearCompanyStructure();
    this.setState({ companyStructureLinearList });
  }

  componentDidMount() {
    super.componentDidMount();

    const { flux } = this.context;
    flux.getActions('companyStructure').getCompanyStructure();
    this.getLinearCompanyStructure();
  }

  componentWillReceiveProps(props) {
    if (!_.isEqual(props.companyStructureList, this.props.companyStructureList)) {
      // TODO переделать
      setTimeout(() => this.getLinearCompanyStructure(), 100);
    }
  }

  editElement(id, e) {
    e.stopPropagation();
    const selectedElement = _.find(this.state.companyStructureLinearList, el => el.id ? el.id === id : el[this.selectField] === id);
    this.setState({ showForm: true, selectedElement });
  }

  deleteElement(id, e) {
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

export default connectToStores(CompanyStructure, ['objects']);
