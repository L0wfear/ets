import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import { IPropsEmployeeEfficiencyReport } from './@types/EmployeeEfficiencyReport.h';
import { IStateEmployeeEfficiencyReport } from './../level-1/@types/EmployeeEfficiencyReport.h';

import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { FluxContext, connectToStores, exportable, HistoryContext } from 'utils/decorators';
import { EmployeeEfficiencyReportTable } from './EmployeeEfficiencyReportTable';

const title = 'Работа сотрудников по ручной уборке';

@connectToStores(['reports'])
@exportable({ entity: 'employee_efficiency_report' })
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
    this.createEmployeeEfficiencyReport();
  }

  getExportPayload(state) {
    return {
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }

  createEmployeeEfficiencyReport() {
    const { flux } = this.context;
    flux.getActions('reports').getEmployeeEfficiencyReport2L(this.state);
  }

  export = () => {
    this.props.export(this.getExportPayload(this.state));
  }

  pushBack = () => {
    this.context.history.pushState(null, 'employee-efficiency-report');
  }

  render() {
    const { employeeEfficiencyReport2L = [] } = this.props;

    return (
      <div>
        <EmployeeEfficiencyReportTable
          data={employeeEfficiencyReport2L}
          title={title}
        >
          <Button
            disabled={!employeeEfficiencyReport2L.length}
            bsSize="small"
            onClick={this.export}
          ><Glyphicon glyph="download-alt" /></Button>
          <Button bsSize="small" onClick={this.pushBack}>Назад</Button>
        </EmployeeEfficiencyReportTable>
      </div>
    );
  }
}

export { EmployeeEfficiencyReport };
