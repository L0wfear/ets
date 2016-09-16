import React, { Component } from 'react';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import FuelReportTable from './FuelReportTable.jsx';
import { getToday9am, getTomorrow9am, createValidDate } from 'utils/dates';
import FuelReportHeader from './FuelReportHeader.jsx';
import { saveData } from 'utils/functions';
import { connectToStores, FluxContext, HistoryContext, staticProps, exportable } from 'utils/decorators';

@connectToStores(['reports'])
@FluxContext
@HistoryContext
@staticProps({
  entity: 'fuel_consumption_report',
})
@exportable
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
    this.export(payload);
  }


  render() {
    let { fuelReport = [] } = this.props;

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
