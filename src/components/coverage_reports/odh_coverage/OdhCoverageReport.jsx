import * as React from 'react';
import * as PropTypes from 'prop-types';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import * as FormControl from 'react-bootstrap/lib/FormControl';

import {
  oldReportGetOdhCoverageReport,
  oldReportExportOdhCoverageReport,
} from 'components/coverage_reports/redux-main/modules/old-report/actions-old_report';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { bindable } from 'utils/decorators';
import { getYesterday9am, getFormattedDateTime } from 'utils/dates';
import { saveData } from 'utils/functions';

import { EtsPageWrap } from 'global-styled/global-styled';

import OdhCoverageReportTable from 'components/coverage_reports/odh_coverage/OdhCoverageReportTable';
import OdhCoverageReportPrintForm from 'components/coverage_reports/odh_coverage/OdhCoverageReportPrintForm';

const BindableMenuItem = bindable(EtsBootstrap.MenuItem);

const page = 'odh_coverage_report';

class OdhCoverageReport extends React.Component {
  static propTypes = {
    odhCoverageReport: PropTypes.array.isRequired,
    oldReportGetOdhCoverageReport: PropTypes.func.isRequired,
    oldReportExportOdhCoverageReport: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      date_start: getYesterday9am(),
      date_end: new Date(),
      isExporting: false,
    };
  }

  componentDidMount() {
    this.getReport();
  }

  componentWillUnmount() {}

  getReport = async () => {
    const res = await this.props.oldReportGetOdhCoverageReport(
      this.state.date_start,
      this.state.date_end,
    );
    const dates = res.meta;

    if (dates.date_start) {
      this.setState({ date_start: dates.date_start, date_end: dates.date_end });
    }
  };

  handleChangeDateStart = (date_start) => this.setState({ date_start });

  handleChangeDateEnd = (date_end) => this.setState({ date_end });

  showForm = (exportType) => {
    this.setState({ showForm: true, exportType });
  };

  export = (
    date_start = this.state.date_start,
    date_end = this.state.date_end,
  ) => {
    this.setState({ isExporting: true });
    this.props
      .oldReportExportOdhCoverageReport(date_start, date_end)
      .then(({ blob }) => {
        if (blob) {
          saveData(
            blob,
            `Отчет по посещению ОДХ в период с ${getFormattedDateTime(
              date_start,
            )} по ${getFormattedDateTime(date_end)}.xls`,
          );
        }
        this.setState({ isExporting: false });
      });
  };

  render() {
    const { odhCoverageReport } = this.props;
    const { isExporting, date_start, date_end } = this.state;
    const exportGlyph = isExporting ? 'refresh' : 'download-alt';

    return (
      <EtsPageWrap>
        <OdhCoverageReportTable
          data={odhCoverageReport}
          selectField="company_id">
          <div className="daily-cleaning-report-period">
            Период формирования:
            <div className="form-group">
              <FormControl
                type="text"
                readOnly
                value={getFormattedDateTime(date_start)}
              />
            </div>
            <span> — </span>
            <div className="form-group">
              <FormControl
                type="text"
                readOnly
                value={getFormattedDateTime(date_end)}
              />
            </div>
          </div>
          <EtsBootstrap.Dropdown id="dropdown-print" pullRight>
            <EtsBootstrap.DropdownToggle noCaret bsSize="small">
              <EtsBootstrap.Glyphicon
                disabled={isExporting}
                glyph={exportGlyph}
              />
            </EtsBootstrap.DropdownToggle>
            <EtsBootstrap.DropdownMenu>
              <BindableMenuItem bindOnClick={1} onClick={() => this.export()}>
                Ежедневный отчет
              </BindableMenuItem>
              <BindableMenuItem bindOnClick={2} onClick={this.showForm}>
                Отчет за заданный период
              </BindableMenuItem>
            </EtsBootstrap.DropdownMenu>
          </EtsBootstrap.Dropdown>
        </OdhCoverageReportTable>
        <OdhCoverageReportPrintForm
          showForm={this.state.showForm}
          onFormHide={() => this.setState({ showForm: false })}
          exportType={this.state.exportType}
          onExport={this.export}
        />
      </EtsPageWrap>
    );
  }
}

export default compose(
  withPreloader({
    page,
    typePreloader: 'mainpage',
  }),
  connect(
    (state) => ({
      odhCoverageReport: state.old_report.odhCoverageReport,
    }),
    (dispatch) => ({
      oldReportGetOdhCoverageReport: (date_start, date_end) =>
        dispatch(oldReportGetOdhCoverageReport(date_start, date_end, { page })),
      oldReportExportOdhCoverageReport: (date_start, date_end) =>
        dispatch(
          oldReportExportOdhCoverageReport(date_start, date_end, { page }),
        ),
    }),
  ),
)(OdhCoverageReport);
