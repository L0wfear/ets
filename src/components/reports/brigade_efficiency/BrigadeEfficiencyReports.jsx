import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { FluxContext, connectToStores, exportable, staticProps } from 'utils/decorators';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import BrigadeEfficiencyReportHeader from './BrigadeEfficiencyReportHeader.jsx';
import BrigadeEfficiencyReportsTable from './BrigadeEfficiencyReportsTable.jsx';

@connectToStores(['reports'])
@exportable({ entity: 'brigade_efficiency_report' })
@FluxContext
@staticProps({
  entity: 'brigade_efficiency_report',
})
@autobind
export default class BrigadeEfficiencyReports extends Component {

  static get propTypes() {
    return {
      brigadeEfficiencyReportsList: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getToday9am(), getTomorrow9am()];

    this.state = {
      date_start,
      date_end,
      object_type: 'odh',
      // company_id: null,
    };
  }

  componentWillMount() {
    this.createBrigadeEfficiencyReportETS(this.state);
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

  createBrigadeEfficiencyReportETS() {
    const { flux } = this.context;
    flux.getActions('reports').getBrigadeEfficiencyReports(this.state);
  }

  render() {
    const { brigadeEfficiencyReportsList = [] } = this.props;
    let currentCombination;
    _.each(brigadeEfficiencyReportsList, (el) => {
      if (!currentCombination || currentCombination !== `${el.company_name}${el.func_type}`) {
        currentCombination = `${el.company_name}${el.func_type}`;
      } else {
        el.hidden = true;
      }
    });

    return (
      <div className="ets-page-wrap">
        <BrigadeEfficiencyReportHeader
          handleChange={this.handleChange}
          onClick={this.createBrigadeEfficiencyReportETS}
          {...this.state}
        />
        <BrigadeEfficiencyReportsTable
          data={brigadeEfficiencyReportsList}
        >
          <Button disabled={!brigadeEfficiencyReportsList.length} bsSize="small" onClick={() => this.props.export(this.getCleanState(this.state))}><Glyphicon glyph="download-alt" /></Button>
        </BrigadeEfficiencyReportsTable>
      </div>
    );
  }
}
