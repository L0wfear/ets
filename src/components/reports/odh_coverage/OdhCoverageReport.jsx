import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import { connectToStores, FluxContext } from 'utils/decorators';
import { getToday9am, getTomorrow9am, getDate9am, getNextDay859am } from 'utils/dates';
import OdhCoverageReportTable from './OdhCoverageReportTable.jsx';
import OdhCoverageReportPrintForm from './OdhCoverageReportPrintForm.jsx';
import OdhCoverageReportHeader from './OdhCoverageReportHeader.jsx';

const TWO_MINUTES = 1000 * 60 * 2;

// @connectToStores(['reports'])
// @staticProps({
//   listName: 'odhCoverageReport',
//   tableComponent: OdhCoverageReportTable,
//   formComponent: OdhCoverageReportPrintForm,
//   operations: ['LIST'],
// })
// @autobind

@connectToStores(['reports'])
@FluxContext
@autobind
export default class OdhCoverageReport extends Component {

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getToday9am(), getTomorrow9am()];

    this.state = {
      date_start,
      date_end,
    };
  }

  componentDidMount() {
    this.getReport();
    // this.refreshInterval = setInterval(() => {
    //   flux.getActions('reports').getOdhCoverageReport();
    // }, TWO_MINUTES);
  }

  componentWillUnmount() {
    // clearInterval(this.refreshInterval);
  }

  getReport() {
    const { flux } = this.context;
    flux.getActions('reports').getOdhCoverageReport(/*this.state.date_start, this.state.date_end*/);
  }

  handleDateStartChange(date) {
    const date_start = getDate9am(date);
    const date_end = getNextDay859am(date);

    this.setState({ date_start, date_end });
  }


  export() {
    this.setState({ showForm: true });
  }

  render() {
    const { odhCoverageReport = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        {/*<OdhCoverageReportHeader {...this.state} onSubmit={this.getReport} onChange={this.handleDateStartChange} />*/}
        <OdhCoverageReportTable data={odhCoverageReport}>
          <Button bsSize="small" onClick={this.export}><Glyphicon glyph="download-alt" /></Button>
        </OdhCoverageReportTable>
        <OdhCoverageReportPrintForm
          showForm={this.state.showForm}
          onFormHide={() => this.setState({ showForm: false })}
        />
      </div>
    );
  }
}
