import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { FluxContext } from 'utils/decorators';
import { Button, Modal } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import { saveData } from 'utils/functions';
import { getToday9am, getTomorrow9am, getDate9am, getYesterday9am, getToday859am, getFormattedDateTime } from 'utils/dates';
import Datepicker from 'components/ui/input/DatePicker';
import Div from 'components/ui/Div.jsx';

@FluxContext
@autobind
export default class OdhCoverageReportPrintForm extends Component {

  static propTypes = {
    exportType: PropTypes.number,
    onFormHide: PropTypes.func,
  }

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getYesterday9am(), getToday859am()];

    this.state = {
      date_start,
      date_end,
    };
  }

  export() {
    const payload = { date: this.state.date };
    const { date_start, date_end } = this.state;
    const { exportType } = this.props;
    // const { flux } = this.context;
    //
    // flux.getActions('reports').exportOdhCoverageReport(date_start, date_end, 'xls')
    //   .then(({ blob }) => { saveData(blob, `Отчет по посещению ОДХ в период с ${getFormattedDateTime(date_start)} по ${getFormattedDateTime(date_end)}.xls`); });
    this.props.onFormHide();
    this.props.onExport(date_start, date_end);
  }

  render() {
    const { exportType } = this.props;
    return (
      <Modal show={this.props.showForm}>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">Печать отчета за заданный период</Modal.Title>
        </Modal.Header>
        <ModalBody>
          {
            exportType === 1 ?
            <div style={{ textAlign: 'center' }}>
              <Datepicker className="inline-block" time={false} date={this.state.date_start} onChange={date => this.setState({ date_start: date })} />
            </div>
            :
            <div style={{ textAlign: 'center' }}>
              <Datepicker className="inline-block" date={this.state.date_start} onChange={date => this.setState({ date_start: date })} />
              <Datepicker className="inline-block" style={{ marginLeft: 40 }} date={this.state.date_end} onChange={date => this.setState({ date_end: date })} />
            </div>
          }
        </ModalBody>
        <Modal.Footer>
          <Div className="inline-block">
            <Button onClick={this.export}>ОК</Button>
            <Button onClick={this.props.onFormHide}>Отмена</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}
