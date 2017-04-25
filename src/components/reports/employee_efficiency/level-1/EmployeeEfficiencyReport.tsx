import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import { IPropsEmployeeEfficiencyReport, IStateEmployeeEfficiencyReport } from './@types/EmployeeEfficiencyReport.h';

import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { FluxContext, connectToStores, exportable, HistoryContext } from 'utils/decorators';
import { EmployeeEfficiencyReportHeader } from './EmployeeEfficiencyReportHeader';
import EmployeeEfficiencyReportTable from 'components/reports/efficiency_for_okrug/EfficiencyForOkrugTable';

const title = 'Работа сотрудников по ручной уборке';

@connectToStores(['reports'])
@exportable({ entity: 'efficiency_for_okrug_report' })
@HistoryContext
@FluxContext
class EmployeeEfficiencyReport extends React.Component<IPropsEmployeeEfficiencyReport, IStateEmployeeEfficiencyReport> {
  constructor() {
    super();

    this.state = {
      date_start: getToday9am(),
      date_end: getTomorrow9am(),
    };
  }

  componentWillMount() {
    // this.createEmployeeEfficiencyReport();
  }

  componentWillUnmount() {
    this.context.flux.getActions('reports').clearStateList('brigadeAndEmployeeEfficiencyReport1L');
  }

  onReportSelect = ({ props }) => {
    const query = {
      company_id: props.data.id,
      date_start: createValidDateTime(this.state.date_start),
      date_end: createValidDateTime(this.state.date_end),
    };

    this.context.history.pushState(null, '/employee-efficiency-report/level/2', query);
  }

  getExportPayload(state) {
    return {
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
  }

  handleChange = (field: string, value: any) => {
    this.setState({ [field]: value });
  }

  createEmployeeEfficiencyReport = () => {
    const { flux } = this.context;
    flux.getActions('reports').getBrigadeAndEmployeeEfficiencyReport1L(this.state);
  }

  export = () => {
    this.props.export(this.getExportPayload(this.state));
  }

  render() {
    const { brigadeAndEmployeeEfficiencyReport1L = [] } = this.props;
    const isFirstLevel = Object.keys(this.props.location.query).length > 0;

    const mainTable = (
      <EmployeeEfficiencyReportTable
        title={title}
        data={brigadeAndEmployeeEfficiencyReport1L}
        onRowSelected={this.onReportSelect}
      >
        <Button
          disabled={!brigadeAndEmployeeEfficiencyReport1L.length}
          bsSize="small"
          onClick={this.export}
        ><Glyphicon glyph="download-alt" /></Button>
      </EmployeeEfficiencyReportTable>
    );
    return (
      <div className="ets-page-wrap">
        <EmployeeEfficiencyReportHeader
          onChange={this.handleChange}
          onClick={this.createEmployeeEfficiencyReport}
          readOnly={isFirstLevel}
          {...this.state}
        />
        {!isFirstLevel && mainTable}
        {this.props.children}
      </div>
    );
  }
}

export {
  EmployeeEfficiencyReport,
};
