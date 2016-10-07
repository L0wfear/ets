import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { FluxContext } from 'utils/decorators';
import { Button, Modal } from 'react-bootstrap';
import { saveData } from 'utils/functions';
import Datepicker from 'components/ui/DatePicker.jsx';
import Div from 'components/ui/Div.jsx';

@FluxContext
@autobind
export default class OdhCoverageReportPrintForm extends Component {

  static propTypes = {
    exportType: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.state = {
      date_start: new Date(),
      date_end: new Date(),
    };
  }

  export() {
    const payload = { date: this.state.date };
    const { date_start, date_end } = this.state;
    const { exportType } = this.props;
    const { flux } = this.context;
    flux.getActions('reports').getOdhCoverageReport(date_start, date_end, 'xls')
      .then(({ blob }) => { saveData(blob, 'Отчет "Фактическое выполнение заданий за смену".xls'); });
  }

  render() {
    const { exportType } = this.props;
    return (
      <Modal show={this.props.showForm}>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">Печать отчета за заданный период</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
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
