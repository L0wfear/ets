import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  oldReportGetDtCoverageReport,
  oldReportExportDtCoverageReport,
} from 'components/old/coverage_reports/redux-main/modules/old-report/actions-old_report';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import {
  getToday9am,
  getFormattedDateTime,
} from 'components/@next/@utils/dates/dates';
import { saveData } from 'utils/functions';
import { EtsPageWrap } from 'global-styled/global-styled';
import DtCoverageReportTable from 'components/old/coverage_reports/dt_coverage/DtCoverageReportTable';
import DtCoverageReportPrintForm from 'components/old/coverage_reports/dt_coverage/DtCoverageReportPrintForm';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { ReduxState } from 'redux-main/@types/state';

const page = 'dt_coverage_report';

type OwnProps = {
};
type StateProps = {
  dtCoverageReport: any[];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};

type Props = (
  OwnProps
  & StateProps
  & DispatchProps
);

class DtCoverageReport extends React.Component<Props, any> {
  state = {
    date_start: getToday9am(),
    date_end: new Date(),
    isExporting: false,
    showForm: false,
    exportType: null,
  };

  componentDidMount() {
    this.getReport();
  }

  componentWillUnmount() {
    // clearInterval(this.refreshInterval);
  }

  getReport = async () => {
    const result = await this.props.dispatch(
      oldReportGetDtCoverageReport(
        this.state.date_start,
        this.state.date_end,
        { page },
      ),
    );
    const dates = result.meta;

    if (dates.date_start) {
      this.setState({ date_start: dates.date_start, date_end: dates.date_end });
    }
  };

  handleChangeDateStart = (date_start) => this.setState({ date_start });

  handleChangeDateEnd = (date_end) => this.setState({ date_end });

  showForm = (exportType) => {
    this.setState({ showForm: true, exportType });
  };

  export = (date_start, date_end) => {
    this.setState({ isExporting: true });
    this.props.dispatch(
      oldReportExportDtCoverageReport(date_start, date_end, { page }),
    ).then(({ blob }) => {
      if (blob) {
        saveData(
          blob,
          `Отчет по посещению ДТ в период с ${getFormattedDateTime(
            date_start,
          )} по ${getFormattedDateTime(date_end)}.xls`,
        );
      }
      this.setState({ isExporting: false });
    });
  };

  render() {
    const { dtCoverageReport = [] } = this.props;
    const { isExporting, date_start, date_end } = this.state;
    const exportGlyph = isExporting ? 'refresh' : 'download-alt';

    return (
      <EtsPageWrap>
        <DtCoverageReportTable data={dtCoverageReport} selectField="company_id">
          <div className="daily-cleaning-report-period">
            Период формирования:
            <div className="form-group">
              <EtsBootstrap.FormControl
                type="text"
                value={getFormattedDateTime(date_start)}
                readOnly
              />
            </div>
            <span> — </span>
            <div className="form-group">
              <EtsBootstrap.FormControl
                type="text"
                value={getFormattedDateTime(date_end)}
                readOnly
              />
            </div>
          </div>
          <EtsBootstrap.Dropdown
            id="dropdown-print"
            noCaret
            disabled={isExporting}
            toggleElement={<EtsBootstrap.Glyphicon glyph={exportGlyph} />}
            toggleElementSize="small">
            <EtsBootstrap.DropdownMenu pullRight>
              <EtsBootstrap.MenuItem eventKey={2} onSelect={this.showForm}>
                Отчет за заданный период
              </EtsBootstrap.MenuItem>
            </EtsBootstrap.DropdownMenu>
          </EtsBootstrap.Dropdown>
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

export default compose<Props, OwnProps>(
  withPreloader<OwnProps>({
    page,
    typePreloader: 'mainpage',
  }),
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    (state) => ({
      dtCoverageReport: state.old_report.dtCoverageReport,
    }),
  ),
)(DtCoverageReport);
