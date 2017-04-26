import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';
import { connectToStores, FluxContext, HistoryContext, exportable } from 'utils/decorators';
import FuelReportTable from './FuelReportTable.jsx';
import FuelReportHeader from './FuelReportHeader.jsx';
import schema from './FuelReportSchema';

@connectToStores(['reports'])
@exportable({ entity: 'fuel_consumption_report' })
@FluxContext
@HistoryContext
export default class FuelReport extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
      fuel_type: null,
      level: 'okrug',
    };
  }

  componentWillUnmount() {
    this.context.flux.getActions('reports').clearStateList('fuelReportL1');
  }

  onReportSelect = ({ props }) => {
    const query = {
      organization_id: props.data.organization_id,
      fuel_type: this.state.fuel_type,
      date_from: createValidDate(this.state.date_from),
      date_to: createValidDate(this.state.date_to),
      level: 'organization',
    };

    this.context.history.pushState(null, '/fuel-consumption-report/level/2', query);
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }

  createReport = () => {
    const { flux } = this.context;
    flux.getActions('reports').getFuelReport(this.state, 1);
  }

  printReport = () => {
    const payload = {
      ...this.state,
      date_from: createValidDate(this.state.date_from),
      date_to: createValidDate(this.state.date_to),
    };
    this.props.export(payload);
  }

  render() {
    const { fuelReportL1 = [] } = this.props;
    fuelReportL1.forEach((el) => {
      Object.keys(el).forEach((k) => {
        const field = schema.find(p => (p.key === k) && p.float);
        if (field && !isNaN(el[k]) && el[k] != null && el[k] !== '') el[k] = parseFloat(el[k]).toFixed(field.float);
      });
    });
    const isFirstLevel = Object.keys(this.props.location.query).length === 0;

    const mainTable = (
      <FuelReportTable
        data={fuelReportL1}
        onRowSelected={this.onReportSelect}
      >
        <Button
          bsSize="small"
          onClick={this.printReport}
        ><Glyphicon glyph="download-alt" /></Button>
      </FuelReportTable>
    );
    return (
      <div className="ets-page-wrap">
        <FuelReportHeader
          handleChange={this.handleChange}
          onClick={this.createReport}
          readOnly={!isFirstLevel}
          {...this.state}
        />
        {isFirstLevel && mainTable}
        {this.props.children}
      </div>
    );
  }
}
