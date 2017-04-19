import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { autobind } from 'core-decorators';

import { getYesterday9am, getToday859am, createValidDateTime } from 'utils/dates';
import { FluxContext, connectToStores, exportable, HistoryContext } from 'utils/decorators';

import BrigadeEfficiencyReportHeader from './BrigadeEfficiencyReportHeader.jsx';
import BrigadeEfficiencyReportTable from './BrigadeEfficiencyReportTable.jsx';

@connectToStores(['reports'])
@exportable({ entity: 'efficiency_for_okrug_report' })
@FluxContext
@HistoryContext
@autobind
export default class BrigadeEfficiencyReport extends Component {

  static get propTypes() {
    return {
      brigadeAndEmployeeEfficiencyReport1L: PropTypes.array,
      export: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getYesterday9am(), getToday859am()];

    this.state = {
      date_start,
      date_end,
      object_type: 'odh',
    };
  }

  componentWillMount() {
    // this.createBrigadeEfficiencyReport(this.state);
  }

  onReportSelect({ props }) {
    const query = {
      company_id: props.data.company_id,
      date_start: createValidDateTime(this.state.date_start),
      date_end: createValidDateTime(this.state.date_end),
      object_type: this.state.object_type,
    };
    // this.context.history.pushState(null, '/brigade-efficiency-report-l2/', query);
  }

  getCleanState(state) {
    return {
      ...state,
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
  }

  handleChange(field, value) {
    console.log(field, value, this);
    this.setState({ [field]: value });
  }

  createBrigadeEfficiencyReport() {
    const { flux } = this.context;
    flux.getActions('reports').getBrigadeAndEmployeeEfficiencyReport1L(this.state);
  }

  export() {
    this.props.export(this.getCleanState(this.state));
  }

  render() {
    const { brigadeAndEmployeeEfficiencyReport1L = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <BrigadeEfficiencyReportHeader
          handleChange={this.handleChange}
          onClick={this.createBrigadeEfficiencyReport}
          {...this.state}
        />
        <BrigadeEfficiencyReportTable
          data={brigadeAndEmployeeEfficiencyReport1L}
          onRowSelected={this.onReportSelect}
        >
          <Button
            disabled={!brigadeAndEmployeeEfficiencyReport1L.length}
            bsSize="small"
            onClick={this.export}
          >
            <Glyphicon glyph="download-alt" />
          </Button>
        </BrigadeEfficiencyReportTable>
      </div>
    );
  }
}
