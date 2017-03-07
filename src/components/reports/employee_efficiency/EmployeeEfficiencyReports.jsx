import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { FluxContext, connectToStores, exportable, staticProps } from 'utils/decorators';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import EmployeeEfficiencyReportHeader from './EmployeeEfficiencyReportHeader.jsx';
import EmployeeEfficiencyReportsTable from './EmployeeEfficiencyReportsTable.jsx';

@connectToStores(['reports'])
@exportable({ entity: 'employee_efficiency_report' })
@FluxContext
@staticProps({
  entity: 'employee_efficiency_report',
})
@autobind
export default class EmployeeEfficiencyReports extends Component {

  static get propTypes() {
    return {
      employeeEfficiencyReportsList: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getToday9am(), getTomorrow9am()];

    this.state = {
      date_start,
      date_end,
    };
  }

  getCleanState(state) {
    return {
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  createEmployeeEfficiencyReport() {
    const { flux } = this.context;
    flux.getActions('reports').getEmployeeEfficiencyReports(this.state);
  }

  render() {
    const { employeeEfficiencyReportsList = [] } = this.props;
    // let currentCombination;
    // _.each(employeeEfficiencyReportsList, (el) => {
    //   if (!currentCombination || currentCombination !== `${el.company_name}${el.func_type}`) {
    //     currentCombination = `${el.company_name}${el.func_type}`;
    //   } else {
    //     el.hidden = true;
    //   }
    // });

    return (
      <div className="ets-page-wrap">
        <EmployeeEfficiencyReportHeader
          handleChange={this.handleChange}
          onClick={this.createEmployeeEfficiencyReport}
          {...this.state}
        />
        <EmployeeEfficiencyReportsTable
          data={employeeEfficiencyReportsList}
        >
          <Button disabled={!employeeEfficiencyReportsList.length} bsSize="small" onClick={() => this.props.export(this.getCleanState(this.state))}><Glyphicon glyph="download-alt" /></Button>
        </EmployeeEfficiencyReportsTable>
      </div>
    );
  }
}
