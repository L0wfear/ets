import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import * as moment from 'moment';

import Div from 'components/ui/Div';
import ModalBody from 'components/ui/Modal';
import Datepicker from 'components/ui/input/date-picker/DatePicker';
import { getToday9am, getTomorrow9am, createValidDateTime, addTime } from 'utils/dates';

export interface IPropsPrintByDates {
  show: boolean;
  onHide(): void;
  onExport(payload: any);
  title: string;
}

export interface IStatePrintByDates {
  date_from: Date;
  date_to: Date;
}

class PrintByDates extends React.Component<IPropsPrintByDates, any> {
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
      date_to: createValidDateTime(addTime(date_to, 1, 'days')),
    };

    this.handleHide();
    this.props.onExport(exportPayload);
  }
  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }
  render() {
    return (
      <EtsBootstrap.ModalContainer id="modal-print-from" show={this.props.show} onHide={this.props.onHide} bsSize="small" >

        <EtsBootstrap.ModalHeader>
          <EtsBootstrap.ModalTitle>{this.props.title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>

        <ModalBody>
          <span style={{ marginBottom: 10, display: 'block' }}>Выберите период:</span>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12} style={{ marginBottom: 5 }}>
              <Datepicker time={false} date={this.state.date_from} onChange={(v) => this.handleChange('date_from', v)} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <Datepicker time={false} date={this.state.date_to} onChange={(v) => this.handleChange('date_to', v)} />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBody>

        <EtsBootstrap.ModalFooter>
          <Div className="inline-block">
            <EtsBootstrap.Button onClick={this.handleSubmit}>ОК</EtsBootstrap.Button>
            <EtsBootstrap.Button onClick={this.handleHide}>Отмена</EtsBootstrap.Button>
          </Div>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default PrintByDates;
