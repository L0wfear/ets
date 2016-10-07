import React, { Component } from 'react';
import { Button, Glyphicon, Dropdown, MenuItem as BootstrapMenuItem } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import { connectToStores, FluxContext, bindable } from 'utils/decorators';
import { getToday9am, getTomorrow9am, getDate9am, getNextDay859am } from 'utils/dates';
import OdhCoverageReportTable from './OdhCoverageReportTable.jsx';
import OdhCoverageReportPrintForm from './OdhCoverageReportPrintForm.jsx';
import OdhCoverageReportHeader from './OdhCoverageReportHeader.jsx';

const TWO_MINUTES = 1000 * 60 * 2;

const MenuItem = bindable(BootstrapMenuItem);

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


  export(exportType) {
    this.setState({ showForm: true, exportType });
  }

  render() {
    const { odhCoverageReport = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        {/*<OdhCoverageReportHeader {...this.state} onSubmit={this.getReport} onChange={this.handleDateStartChange} />*/}
        <OdhCoverageReportTable data={odhCoverageReport}>
          <Dropdown id="dropdown-print" pullRight>
            <Dropdown.Toggle noCaret bsSize="small">
              <Glyphicon glyph="download-alt" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/*<MenuItem bindOnClick={1} onClick={this.export}>Ежедневный отчет</MenuItem>*/}
              <MenuItem bindOnClick={2} onClick={this.export}>Отчет за заданный период</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </OdhCoverageReportTable>
        <OdhCoverageReportPrintForm
          showForm={this.state.showForm}
          onFormHide={() => this.setState({ showForm: false })}
          exportType={this.state.exportType}
        />
      </div>
    );
  }
}
