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
      children: PropTypes.node,
      export: PropTypes.func,
      location: React.PropTypes.shape({
        query: React.PropTypes.shape({}),
      }),
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

  componentWillUnmount() {
    this.context.flux.getActions('reports').clearStateList('brigadeAndEmployeeEfficiencyReport1L');
  }

  onReportSelect({ props }) {
    const query = {
      company_id: props.data.id,
      date_start: createValidDateTime(this.state.date_start),
      date_end: createValidDateTime(this.state.date_end),
      object_type: this.state.object_type,
    };

    this.context.history.pushState(null, '/level/2', query);
  }

  getCleanState(state) {
    return {
      ...state,
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
  }


  handleChange(field, value) {
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
    const isFirstLevel = Object.keys(this.props.location.query).length > 0;

    const mainTable = (
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
    );

    return (
      <div className="ets-page-wrap">
        <BrigadeEfficiencyReportHeader
          handleChange={this.handleChange}
          onClick={this.createBrigadeEfficiencyReport}
          readOnly={isFirstLevel}
          {...this.state}
        />
        {!isFirstLevel && mainTable}
        {this.props.children}
      </div>
    );
  }
}
