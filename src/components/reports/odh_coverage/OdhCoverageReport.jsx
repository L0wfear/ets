import React from 'react';
import { autobind } from 'core-decorators';
import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import OdhCoverageReportTable from './OdhCoverageReportTable.jsx';
import OdhCoverageReportPrintForm from './OdhCoverageReportPrintForm.jsx';

const TWO_MINUTES = 1000 * 60 * 2;

@connectToStores(['reports'])
@staticProps({
  listName: 'odhCoverageReport',
  tableComponent: OdhCoverageReportTable,
  formComponent: OdhCoverageReportPrintForm,
  operations: ['LIST'],
})
@autobind
export default class OdhCoverageReport extends ElementsList {

  constructor(props) {
    super(props);
    this.exportable = true;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('reports').getOdhCoverageReport();
    this.refreshInterval = setInterval(() => {
      flux.getActions('reports').getOdhCoverageReport();
    }, TWO_MINUTES);
  }

  export() {
    this.setState({ showForm: true });
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }
}
