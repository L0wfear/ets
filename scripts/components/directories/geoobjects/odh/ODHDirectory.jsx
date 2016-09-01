import React, { Component } from 'react';
import ODHTable from './ODHTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import OdhFormWrap from './OdhFormWrap.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'odh',
  listName: 'odhsList',
  tableComponent: ODHTable,
  formComponent: OdhFormWrap,
  operations: ['READ']
})
@exportable
export default class ODHDirectory extends ElementsList {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('odh');
  }
}
