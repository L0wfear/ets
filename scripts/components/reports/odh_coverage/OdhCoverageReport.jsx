import React from 'react';
import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import OdhCoverageReportTable from './OdhCoverageReportTable.jsx';

const TWO_MINUTES = 1000 * 60 * 2;

@connectToStores(['reports'])
@staticProps({
  listName: 'odhCoverageReport',
  tableComponent: OdhCoverageReportTable,
  operations: ['LIST'],
})
export default class OdhCoverageReport extends ElementsList {

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('reports').getOdhCoverageReport();
    this.refreshInterval = setInterval(() => {
      flux.getActions('reports').getOdhCoverageReport();
    }, TWO_MINUTES);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }
}
