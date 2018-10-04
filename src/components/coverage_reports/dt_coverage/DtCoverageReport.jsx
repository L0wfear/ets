import React, { Component } from 'react';
import { Glyphicon, Dropdown, MenuItem as BootstrapMenuItem, FormControl } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import { connectToStores, FluxContext, bindable } from 'utils/decorators';
import { getToday9am, getFormattedDateTime } from 'utils/dates';
import { saveData } from 'utils/functions';

import {
  EtsPageWrap,
} from 'global-styled/global-styled';

import DtCoverageReportTable from './DtCoverageReportTable.jsx';
import DtCoverageReportPrintForm from './DtCoverageReportPrintForm.jsx';

// const TWO_MINUTES = 1000 * 60 * 2;

const MenuItem = bindable(BootstrapMenuItem);

// @connectToStores(['reports'])
// @staticProps({
//   listName: 'odhCoverageReport',
//   tableComponent: DtCoverageReportTable,
//   formComponent: DtCoverageReportPrintForm,
//   operations: ['LIST'],
// })
// @autobind

@connectToStores(['reports'])
@FluxContext
@autobind
export default class DtCoverageReport extends Component {

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getToday9am(), new Date()];

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
    //   flux.getActions('reports').getDtCoverageReport();
    // }, TWO_MINUTES);
  }

  componentWillUnmount() {
    // clearInterval(this.refreshInterval);
  }

  getReport = async () => {
    const { flux } = this.context;
    const { location: { query } } = this.props;

    const res = await flux.getActions('reports').getDtCoverageReport(this.state.date_start, this.state.date_end, query);
    const dates = res.result.meta;

    if (dates.date_start) this.setState({ date_start: dates.date_start, date_end: dates.date_end });
  }

  // handleDateStartChange(date) {
  //   const date_start = getDate0am(date);
  //   const date_end = new Date();
  //
  //   this.setState({ date_start, date_end });
  // }

  handleChangeDateStart = date_start => this.setState({ date_start });
  handleChangeDateEnd = date_end => this.setState({ date_end });

  showForm(exportType) {
    this.setState({ showForm: true, exportType });
  }

  export(date_start, date_end) {
    const { flux } = this.context;

    this.setState({ isExporting: true });
    flux.getActions('reports').exportDtCoverageReport(date_start, date_end, 'xls')
      .then(({ blob }) => {
        saveData(blob, `Отчет по посещению ДТ в период с ${getFormattedDateTime(date_start)} по ${getFormattedDateTime(date_end)}.xls`);
        this.setState({ isExporting: false });
      });
  }

  render() {
    const { dtCoverageReport = [] } = this.props;
    const { isExporting, date_start, date_end } = this.state;
    const exportGlyph = isExporting ? 'refresh' : 'download-alt';
    const iconClassname = isExporting ? 'glyphicon-spin' : '';

    return (
      <EtsPageWrap>
        <DtCoverageReportTable data={dtCoverageReport}>
          <div className="daily-cleaning-report-period">
            Период формирования:
            <div className="form-group">
              <FormControl type="text" value={getFormattedDateTime(date_start)} readOnly />
            </div>
            <span> — </span>
            <div className="form-group">
              <FormControl type="text" value={getFormattedDateTime(date_end)} readOnly />
            </div>
          </div>
          <Dropdown id="dropdown-print" pullRight>
            <Dropdown.Toggle noCaret bsSize="small">
              <Glyphicon disabled={isExporting} className={iconClassname} glyph={exportGlyph} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* <MenuItem bindOnClick={1} onClick={this.export}>Ежедневный отчет</MenuItem>*/}
              <MenuItem bindOnClick={2} onClick={this.showForm}>Отчет за заданный период</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </DtCoverageReportTable>
        <DtCoverageReportPrintForm
          showForm={this.state.showForm}
          onFormHide={() => this.setState({ showForm: false })}
          exportType={this.state.exportType}
          onExport={this.export}
        />
      </EtsPageWrap>
    );
  }
}
