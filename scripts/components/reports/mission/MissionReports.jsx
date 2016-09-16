import React, { Component } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getDatesByShift } from 'utils/dates';
import { getReportNotReadyNotification } from 'utils/notifications';
import { FluxContext, HistoryContext, exportable, staticProps, connectToStores } from 'utils/decorators';
import MissionReportsTable from './MissionReportsTable.jsx';

const MissionReportsDatepicker = (props) => {
  return (
    <Row>
      <Col md={3} />
      <Col md={6} className="faxogramms-date-range">
        <Div className="inline-block faxogramms-date">
          <Datepicker date={props.mission_date_start_from} onChange={props.handleChange.bind(null, 'mission_date_start_from')} />
        </Div>
        <Div className="date-divider">—</Div>
        <Div className="inline-block">
          <Datepicker date={props.mission_date_end_to} onChange={props.handleChange.bind(null, 'mission_date_end_to')} />
        </Div>
      </Col>
      <Col md={3}>
        <Button bsSize="small" onClick={props.onClick.bind(this)}>Сформировать отчет</Button>
      </Col>
    </Row>
  );
};

@connectToStores(['missions'])
@exportable({ entity: 'car_odh_travel_report' })
@FluxContext
@HistoryContext
@staticProps({
  entity: 'car_odh_travel_report',
})
export default class MissionReports extends Component {

  constructor(props) {
    super(props);

    const [mission_date_start_from, mission_date_end_to] = getDatesByShift();

    this.state = {
      mission_date_start_from,
      mission_date_end_to,
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('missions').getMissionReports();
  }

  onReportSelect({ props }) {
    const id = props.data.id;
    if (props.data.status !== 'success') {
      global.NOTIFICATION_SYSTEM.addNotification(getReportNotReadyNotification(this.context.flux));
    } else {
      this.context.history.pushState(null, `/mission-report/${id}`);
    }
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  createMissionReport() {
    const { flux } = this.context;
    flux.getActions('missions').createMissionReport(this.state.mission_date_start_from, this.state.mission_date_end_to);
  }

  render() {
    const { missionReportsList } = this.props;

    return (
      <div className="ets-page-wrap">
        <MissionReportsDatepicker handleChange={this.handleChange.bind(this)} onClick={this.createMissionReport.bind(this)} {...this.state} />
        <MissionReportsTable data={missionReportsList} onRowSelected={this.onReportSelect.bind(this)} />
      </div>
    );
  }
}
