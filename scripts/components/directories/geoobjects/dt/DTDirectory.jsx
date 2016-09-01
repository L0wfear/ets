import React, { Component } from 'react';
import DTTable from './DTTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import DtFormWrap from './DtFormWrap.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'dt',
  listName: 'dtsList',
  tableComponent: DTTable,
  formComponent: DtFormWrap,
  operations: ['READ']
})
@exportable
export default class DTDirectory extends ElementsList {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('dt');
  }
}
