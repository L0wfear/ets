import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';

import Preloader from 'components/ui/Preloader.jsx';
import { connectToStores, HistoryContext, FluxContext, exportable, bindable } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getDatesByShift, createValidDateTime } from 'utils/dates';
import MissionReportTable from './MissionReportTable.jsx';

const DataPicker = bindable(Datepicker);

const MissionReportsDatepicker = props =>
  <Row>
    <Col md={3} />
    <Col md={6} className="faxogramms-date-range">
      <Div className="inline-block faxogramms-date">
        <DataPicker
          date={props.mission_date_start_from}
          onChange={props.handleChange}
          bindOnChange={'mission_date_start_from'}
          disabled={props.readOnly}
        />
      </Div>
      <Div className="date-divider">—</Div>
      <Div className="inline-block">
        <DataPicker
          date={props.mission_date_end_to}
          onChange={props.handleChange}
          bindOnChange={'mission_date_end_to'}
          disabled={props.readOnly}
        />
      </Div>
    </Col>
    <Col md={3}>
      <Button
        disabled={props.readOnly}
        bsSize="small"
        onClick={props.onClick}
      >Сформировать отчет</Button>
    </Col>
  </Row>;

@connectToStores(['missions'])
@exportable({ entity: 'car_travel_report' })
@autobind
@HistoryContext
@FluxContext
export default class MissionReport extends Component {

  static get propTypes() {
    return {
      params: PropTypes.object,
      selectedReportData: PropTypes.array,
      export: PropTypes.func,
      children: PropTypes.element,
    };
  }
  componentWillMount() {
    const [mission_date_start_from, mission_date_end_to] = getDatesByShift();

    this.state = {
      mission_date_start_from,
      mission_date_end_to,
    };
  }
  componentDidMount() {
    this.getReports();
  }

  onReportSelect({ props }) {
    const index = props.data.index;
    const id = props.data.mission_id;

    if (props.data.report_by_obj) {
      this.context.history.pushState(null, `/mission-reports/${id}/odhs/${index}`);
    } else if (props.data.report_by_dt) {
      this.context.history.pushState(null, `/mission-reports/${id}/dts/${index}`);
    } else if (props.data.report_by_point) {
      this.context.history.pushState(null, `/mission-reports/${id}/points/${index}`);
    }
  }

  getReports = () => {
    const { flux } = this.context;
    flux.getActions('missions').getMissionReports(this.state);
  }

  getCleanState(state) {
    return {
      ...state,
      mission_date_start_from: createValidDateTime(state.mission_date_start_from),
      mission_date_end_to: createValidDateTime(state.mission_date_end_to),
    };
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }


  export = async () => {
    try {
      this.setState({ pageLoading: true });
      await this.props.export(this.getCleanState(this.state));
      this.setState({ pageLoading: false });
    } catch (err) {
      this.setState({ pageLoading: false });
    }
  }

  render() {
    const { selectedReportData = [] } = this.props;
    const isFirstLevel = Object.keys(this.props.params).length === 0;

    return (
      <div className="ets-page-wrap">
        <MissionReportsDatepicker
          handleChange={this.handleChange}
          onClick={this.getReports}
          readOnly={!isFirstLevel}
          {...this.state}
        />
        {isFirstLevel &&
          <MissionReportTable data={selectedReportData} onRowSelected={this.onReportSelect}>
            <Button bsSize="small" onClick={this.export}><Glyphicon glyph="download-alt" /></Button>
          </MissionReportTable>
        }
        {this.props.children}
        {this.state.pageLoading && <Preloader type="mainpage" />}
      </div>
    );
  }
}
