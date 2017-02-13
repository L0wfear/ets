import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';
import { connectToStores, FluxContext, HistoryContext, staticProps, exportable } from 'utils/decorators';
import FuelReportTable from './FuelReportTable.jsx';
import FuelReportHeader from './FuelReportHeader.jsx';
import schema from './FuelReportSchema';

@connectToStores(['reports'])
@exportable({ entity: 'fuel_consumption_report' })
@FluxContext
@HistoryContext
@staticProps({
  entity: 'fuel_consumption_report',
})
export default class FuelReport extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
      fuel_type: null,
    };
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  createReport() {
    const { flux } = this.context;
    flux.getActions('reports').getFuelReport(this.state);
  }

  printReport() {
    const payload = _.cloneDeep(this.state);
    payload.date_from = createValidDate(payload.date_from);
    payload.date_to = createValidDate(payload.date_to);
    this.props.export(payload);
  }


  render() {
    const { fuelReport = [] } = this.props;
    fuelReport.forEach((el) => {
      Object.keys(el).forEach((k) => {
        const field = schema.find(p => (p.key === k) && p.float);
        if (field && !isNaN(el[k])) el[k] = parseFloat(el[k]).toFixed(field.float);
      });
    });

    return (
      <div className="ets-page-wrap">
        <FuelReportHeader handleChange={this.handleChange.bind(this)} onClick={this.createReport.bind(this)} {...this.state} />
        <FuelReportTable data={fuelReport}>
          <Button bsSize="small" onClick={this.printReport.bind(this)}><Glyphicon glyph="download-alt" /></Button>
        </FuelReportTable>
      </div>
    );
  }
}
