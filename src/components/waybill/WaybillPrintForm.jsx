import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Div from 'components/ui/Div.jsx';
import { Modal, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/input/DatePicker';
import { getToday9am, getTomorrow9am, makeDate } from 'utils/dates';
import { saveData } from 'utils/functions';

const FORMATION_PERIOD_OPTIONS = [
  { value: 'date', label: 'Дневной' },
  { value: 'month', label: 'Месячный' }
];

class WaybillPrintForm extends Component {

  static get propTypes() {
    return {
      show: PropTypes.any,
      hide: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      month: new Date().getMonth() + 1,
      year: new Date().getYear() + 1900,
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
      DISABLE_SUBMIT: false,
      formationPeriod: 'month',
      date: new Date(),
    };
  }

  @autobind
  async handleSubmit() {
    global.NOTIFICATION_SYSTEM.notifyWithObject({
      title: 'Загрузка печатной формы',
      level: 'info',
      position: 'tr',
      dismissible: false,
      autoDismiss: 0,
      uid: 'waybilPrintForm',
      children: (
        <div>
          <p>Формирование печатной формы</p>
        </div>
      ),
    });
    if (this.props.show === 1) {
      const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
      this.setState({ DISABLE_SUBMIT: true });
      await this.props.printData(
        this.context.flux.getActions('waybills').getWaybillJournalReport,
        this.state,
      ).then(({ blob }) => {
        switch (this.state.formationPeriod) {
          case 'month': return saveData(blob, `Отчет по журналу ПЛ за ${MONTHS[this.state.month - 1]} ${this.state.year}.xls`);
          case 'date': return saveData(blob, `Отчет по журналу ПЛ за ${makeDate(this.state.date)}.xls`);
          default: return false;
        }
      });
    } else {
      this.setState({ DISABLE_SUBMIT: true });
      await this.props.printData(
        this.context.flux.getActions('waybills').getWaybillsReport,
        this.state,
      ).then(({ blob }) => { saveData(blob, `Отчет по выработке ТС за ${makeDate(this.state.date_from)} - ${makeDate(this.state.date_to)}.xls`); });
    }

    global.NOTIFICATION_SYSTEM.removeNotification('waybilPrintForm');

    this.setState({
      month: new Date().getMonth() + 1,
      year: new Date().getYear() + 1900,
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
      DISABLE_SUBMIT: false,
    }, () => this.props.hide());
  }

  @autobind
  handleChange(field, value) {
    this.setState({ [field]: value });
  }
  handleChangeFormationPeriod = formationPeriod => this.setState({ formationPeriod });
  handleChangeDate = date => this.setState({ date });

  render() {
    const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map((m, i) => ({ label: m, value: i + 1 }));
    const YEARS = Array.from({ length: 11 }, (y, i) => ({ label: `${i + 2016}`, value: i + 2016 }));

    const errors = {
      month: !this.state.month ? 'Поле "Месяц" обязательно для заполнения' : '',
      year: !this.state.year ? 'Поле "Год" обязательно для заполнения' : '',
      date_from: !this.state.date_from ? 'Поле обязательно для заполнения' : '',
      date_to: !this.state.date_to ? 'Поле обязательно для заполнения' : '',
    };
    const DISABLE_SUBMIT = (this.props.show === 1 ? !!(errors.month || errors.year) : !!(errors.date_to || errors.date_from));

    return (
      <Modal {...this.props} show={!!this.props.show} bsSize="small">

        <Modal.Header>
          <Modal.Title id="contained-modal-title-lg">Печать журнала ПЛ</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <span style={{ marginBottom: 15, display: 'block' }}>Выберите период:</span>
          {this.props.show === 1 ?
            <div>
              <Field
                type={'select'}
                label={'Период формирования'}
                options={FORMATION_PERIOD_OPTIONS}
                value={this.state.formationPeriod}
                clearable={false}
                disabled={this.state.DISABLE_SUBMIT}
                onChange={this.handleChangeFormationPeriod}
              />
              <br />
              <Div hidden={this.state.formationPeriod !== 'month'}>
                <Field
                  type="select"
                  label="Месяц"
                  options={MONTHS}
                  sortingFunction={(a, b) => a.value - b.value}
                  value={this.state.month}
                  clearable={false}
                  onChange={v => this.handleChange('month', v)}
                  error={errors.month}
                  disabled={this.state.DISABLE_SUBMIT}
                />
                <Field
                  type="select"
                  label="Год"
                  options={YEARS}
                  value={this.state.year}
                  clearable={false}
                  onChange={v => this.handleChange('year', v)}
                  error={errors.year}
                  disabled={this.state.DISABLE_SUBMIT}
                />
              </Div>
              <Div hidden={this.state.formationPeriod !== 'date'}>
                <Field
                  type="date"
                  time={false}
                  label="Дата"
                  value={this.state.date}
                  onChange={this.handleChangeDate}
                  disabled={this.state.DISABLE_SUBMIT}
                />
              </Div>
            </div>
            :
            <div>
              <Div className="inline-block reports-date">
                <Datepicker time={false} date={this.state.date_from} onChange={v => this.handleChange('date_from', v)} />
              </Div>
              <Div className="inline-block reports-date">
                <Datepicker time={false} min={this.state.date_from} date={this.state.date_to} onChange={v => this.handleChange('date_to', v)} />
              </Div>
              {DISABLE_SUBMIT ? <label style={{ color: 'red', fontWeight: 'normal', fontSize: 12, marginTop: 10 }}>Даты должны быть указаны</label> : ''}
            </div>
          }
        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            <Button disabled={DISABLE_SUBMIT || this.state.DISABLE_SUBMIT} onClick={this.handleSubmit}>{'OK'}</Button>
            <Button onClick={this.props.hide}>Отмена</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }

}

WaybillPrintForm.contextTypes = {
  flux: React.PropTypes.object,
};

export default WaybillPrintForm;
