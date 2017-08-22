import * as React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import * as moment from 'moment';

import Div from 'components/ui/Div.jsx';
import ModalBody from 'components/ui/Modal';
import Datepicker from 'components/ui/input/DatePicker';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
const DataPicker: any = Datepicker;

export interface IPropsMissionPrintForm {
  show: boolean;
  onHide(): void;
  onExport(payload: any);
}

export interface IStateMissionPrintForm {
  date_from: Date;
  date_to: Date;
}

class MissionPrintForm extends React.Component<IPropsMissionPrintForm, IStateMissionPrintForm> {
  constructor(props) {
    super(props);

    this.state = {
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
    };
  }
  handleHide = () => {
    this.setState({
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
    }, () => this.props.onHide());
  }
  handleSubmit = async () => {
    const { date_from = null, date_to = null } = this.state;

    const dateFromMs = date_from === null ? -Infinity : moment(date_from).unix();
    const dateToMs = date_to === null ? Infinity : moment(date_to).unix();
    const diffMonths = moment.duration(dateToMs - dateFromMs, 'seconds').asMonths();

    if (diffMonths >= 12) {
      global.NOTIFICATION_SYSTEM.notify('Период выгрузки должен быть ограничен 12 месяцами', 'warning');
      return;
    }

    const exportPayload = {
      date_from: createValidDateTime(date_from),
      date_to: createValidDateTime(date_to),
    };

    this.handleHide();
    this.props.onExport(exportPayload);
  }
  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }
  render() {
    return (
      <Modal {...this.props} bsSize="small" >

        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">Печать журнала заданий</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <span style={{ marginBottom: 10, display: 'block' }}>Выберите период:</span>
          <Row>
            <Col md={12} style={{ marginBottom: 5 }}>
              <DataPicker time={false} date={this.state.date_from} onChange={v => this.handleChange('date_from', v)} />
            </Col>
            <Col md={12}>
              <DataPicker time={false} min={this.state.date_from} date={this.state.date_to} onChange={v => this.handleChange('date_to', v)} />
            </Col>
          </Row>
        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            <Button onClick={this.handleSubmit}>ОК</Button>
            <Button onClick={this.handleHide}>Отмена</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }

}

export default MissionPrintForm;
