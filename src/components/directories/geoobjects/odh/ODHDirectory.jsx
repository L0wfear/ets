import React, { Component } from 'react';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import ODHTable from './ODHTable.jsx';
import OdhFormWrap from './OdhFormWrap.jsx';
import schema from './ODHSchema';

@connectToStores(['geoObjects'])
@exportable({ path: 'geozones', entity: 'odh' })
@staticProps({
  path: 'geozones',
  entity: 'odh',
  schema,
  listName: 'odhsList',
  tableComponent: ODHTable,
  formComponent: OdhFormWrap,
  operations: ['READ'],
})
export default class ODHDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('odh');
  }
}
