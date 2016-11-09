import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import ODHNormFormWrap from './ODHNormFormWrap.jsx';
import ODHNormTable from './ODHNormTable.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['odh'])
@exportable({ entity: 'comsumable_material' })
@staticProps({
  entity: 'odh_norm',
  listName: 'odhNormList',
  tableComponent: ODHNormTable,
  formComponent: ODHNormFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class ODHNormList extends ElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('odh').deleteODHNorm;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('odh').getODHNorm();
    flux.getActions('odh').getMeasureUnits();
  }

}
