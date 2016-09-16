import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import DtFormWrap from './DtFormWrap.jsx';
import DTTable from './DTTable.jsx';

@connectToStores(['geoObjects'])
@exportable({ path: 'geozones', entity: 'dt' })
@staticProps({
  path: 'geozones',
  entity: 'dt',
  listName: 'dtsList',
  tableComponent: DTTable,
  formComponent: DtFormWrap,
  operations: ['READ'],
})
export default class DTDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('dt');
  }
}
