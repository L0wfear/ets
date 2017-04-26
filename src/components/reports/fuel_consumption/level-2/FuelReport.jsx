import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { createValidDate } from 'utils/dates';
import { connectToStores, FluxContext, HistoryContext, exportable } from 'utils/decorators';
import FuelReportTable from './FuelReportTable.jsx';
import schema from './../level-1/FuelReportSchema';

@connectToStores(['reports'])
@exportable({ entity: 'fuel_consumption_report' })
@FluxContext
@HistoryContext
export default class FuelReport extends Component {
  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('reports').getFuelReport(this.props.location.query, 2);
  }

  pushBack = () => {
    this.context.history.pushState(null, 'fuel-consumption-report');
  }

  printReport = () => {
    this.props.export(this.props.location.query);
  }

  render() {
    const { fuelReportL2 = [] } = this.props;
    fuelReportL2.forEach((el) => {
      Object.keys(el).forEach((k) => {
        const field = schema.find(p => (p.key === k) && p.float);
        if (field && !isNaN(el[k]) && el[k] != null && el[k] !== '') el[k] = parseFloat(el[k]).toFixed(field.float);
      });
    });

    const mainTable = (
      <FuelReportTable data={fuelReportL2}>
        <Button
          bsSize="small"
          onClick={this.printReport}
        ><Glyphicon glyph="download-alt" /></Button>
        <Button bsSize="small" onClick={this.pushBack}>Назад</Button>
      </FuelReportTable>
    );
    return (
      <div>
        {mainTable}
      </div>
    );
  }
}
