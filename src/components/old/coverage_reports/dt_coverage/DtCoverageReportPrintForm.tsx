import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBody from 'components/old/ui/Modal';
import {
  getYesterday9am,
  getToday859am,
} from 'components/@next/@utils/dates/dates';
import DatePicker from 'components/old/ui/input/date-picker/DatePicker';

type Props = {
  onFormHide: any;
  onExport: any;

  exportType: number;

  showForm: boolean
};
type State = any;

export default class DtCoverageReportPrintForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const [date_start, date_end] = [getYesterday9am(), getToday859am()];

    this.state = {
      date_start,
      date_end,
    };
  }

  export = () => {
    const { date_start, date_end } = this.state;
    this.props.onFormHide();
    this.props.onExport(date_start, date_end);
  };

  render() {
    const { exportType } = this.props;
    return (
      <EtsBootstrap.ModalContainer
        id="modal-dt-coverage-report-print"
        show={this.props.showForm}>
        <EtsBootstrap.ModalHeader>
          <EtsBootstrap.ModalTitle>
            Печать отчета за заданный период
          </EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBody>
          {exportType === 1 ? (
            <div style={{ textAlign: 'center' }}>
              <DatePicker
                className="inline-block"
                time={false}
                date={this.state.date_start}
                onChange={(date) => this.setState({ date_start: date })}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <DatePicker
                className="inline-block"
                date={this.state.date_start}
                onChange={(date) => this.setState({ date_start: date })}
              />
              <DatePicker
                className="inline-block"
                style={{ marginLeft: 40 }}
                date={this.state.date_end}
                onChange={(date) => this.setState({ date_end: date })}
              />
            </div>
          )}
        </ModalBody>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={this.export}>ОК</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={this.props.onFormHide}>
            Отмена
          </EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}
