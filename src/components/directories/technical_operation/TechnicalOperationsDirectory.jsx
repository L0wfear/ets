import React, { Component } from 'react';
import TechnicalOperationFormWrap from './TechnicalOperationFormWrap.jsx';
import TechnicalOperationsTable from './TechnicalOperationsTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['objects'])
@staticProps({
  entity: 'technical_operation',
  listName: 'technicalOperationsList',
  tableComponent: TechnicalOperationsTable,
  formComponent: TechnicalOperationFormWrap,
  operations: ['READ', 'UPDATE'],
})
export default class TechOperationsDirectory extends ElementsList {

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('technicalOperation').getTechnicalOperations(true);
    flux.getActions('objects').getTypes();
  }

}
