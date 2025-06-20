import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  oldReportGetOdhCoverageReport,
  oldReportExportOdhCoverageReport,
} from 'components/old/coverage_reports/redux-main/modules/old-report/actions-old_report';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import {
  getYesterday9am,
  getFormattedDateTime,
} from 'components/@next/@utils/dates/dates';
import { saveData } from 'utils/functions';

import { EtsPageWrap } from 'global-styled/global-styled';

import OdhCoverageReportTable from 'components/old/coverage_reports/odh_coverage/OdhCoverageReportTable';
import OdhCoverageReportPrintForm from 'components/old/coverage_reports/odh_coverage/OdhCoverageReportPrintForm';
import { ReduxState } from 'redux-main/@types/state';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const page = 'odh_coverage_report';

type OwnProps = {
};
type StateProps = {
  odhCoverageReport: Array<any>;
};
type DispatchProps = {
  dispatch: EtsDispatch;
};

type Props = (
  OwnProps
  & StateProps
  & DispatchProps
);

class OdhCoverageReport extends React.Component<Props, any> {
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

  getReport = async () => {
    const res = await this.props.dispatch(
      oldReportGetOdhCoverageReport(
        this.state.date_start,
        this.state.date_end,
        { page },
      ),
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
    this.props.dispatch(
      oldReportExportOdhCoverageReport(date_start, date_end, { page }),
    ).then(({ blob }) => {
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
              <EtsBootstrap.FormControl
                type="text"
                readOnly
                value={getFormattedDateTime(date_start)}
              />
            </div>
            <span> — </span>
            <div className="form-group">
              <EtsBootstrap.FormControl
                type="text"
                readOnly
                value={getFormattedDateTime(date_end)}
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
              <EtsBootstrap.MenuItem
                eventKey={1}
                onSelect={() => this.export()}>
                Ежедневный отчет
              </EtsBootstrap.MenuItem>
              <EtsBootstrap.MenuItem eventKey={2} onSelect={this.showForm}>
                Отчет за заданный период
              </EtsBootstrap.MenuItem>
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

export default compose<Props, OwnProps>(
  withPreloader<OwnProps>({
    page,
    typePreloader: 'mainpage',
  }),
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    (state) => ({
      odhCoverageReport: state.old_report.odhCoverageReport,
    }),
  ),
)(OdhCoverageReport);
