import React, { Component } from 'react';
import { Button, Glyphicon, Dropdown, MenuItem as BootstrapMenuItem, FormControl } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import { connectToStores, FluxContext, bindable } from 'utils/decorators';
import { getToday859am, getYesterday9am, getDate9am, getNextDay859am, getFormattedDateTime } from 'utils/dates';
import { saveData } from 'utils/functions';
import Preloader from 'components/ui/Preloader.jsx';
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

    const [date_start, date_end] = [getYesterday9am(), new Date()];

    this.state = {
      date_start,
      date_end,
      isLoading: false,
      isExporting: false,
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

  async getReport() {
    const { flux } = this.context;
    const res = await flux.getActions('reports').getOdhCoverageReport(/*this.state.date_start, this.state.date_end*/);
    const dates = res.result.meta;
    if (dates.date_start) this.setState({ date_start: dates.date_start, date_end: new Date() });
  }

  handleDateStartChange(date) {
    const date_start = getDate9am(date);
    const date_end = getNextDay859am(date);

    this.setState({ date_start, date_end });
  }

  showForm(exportType) {
    this.setState({ showForm: true, exportType });
  }

  export(date_start = this.state.date_start, date_end = this.state.date_end) {
    const { flux } = this.context;

    this.setState({ isExporting: true });
    flux.getActions('reports').exportOdhCoverageReport(date_start, date_end, 'xls')
      .then(({ blob }) => {
        saveData(blob, `Отчет по посещению ОДХ в период с ${getFormattedDateTime(date_start)} по ${getFormattedDateTime(date_end)}.xls`);
        this.setState({ isExporting: false });
      });
  }

  render() {
    const { odhCoverageReport = [] } = this.props;
    const { isExporting, date_start, date_end } = this.state;
    const exportGlyph = isExporting ? 'refresh' : 'download-alt';
    const iconClassname = isExporting ? 'glyphicon-spin' : '';

    return (
      <div className="ets-page-wrap">
        {/*<OdhCoverageReportHeader {...this.state} onSubmit={this.getReport} onChange={this.handleDateStartChange} />*/}
        <OdhCoverageReportTable data={odhCoverageReport}>
          <div className="daily-cleaning-report-period">
            Период формирования:
            <div className="form-group">
              <FormControl type="text" readOnly value={getFormattedDateTime(date_start)} />
            </div>
            <span> — </span>
            <div className="form-group">
              <FormControl type="text" readOnly value={getFormattedDateTime(date_end)} />
            </div>
          </div>
          <Dropdown id="dropdown-print" pullRight>
            <Dropdown.Toggle noCaret bsSize="small">
              <Glyphicon disabled={isExporting} className={iconClassname} glyph={exportGlyph} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem bindOnClick={1} onClick={() => this.export()}>Ежедневный отчет</MenuItem>
              <MenuItem bindOnClick={2} onClick={this.showForm}>Отчет за заданный период</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </OdhCoverageReportTable>
        <OdhCoverageReportPrintForm
          showForm={this.state.showForm}
          onFormHide={() => this.setState({ showForm: false })}
          exportType={this.state.exportType}
          onExport={this.export}
        />
      </div>
    );
  }
}
