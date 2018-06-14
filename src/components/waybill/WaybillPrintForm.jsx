import * as React from 'react';
import * as PropTypes from 'prop-types';
import Div from 'components/ui/Div.jsx';
import { get } from 'lodash';

import { Modal, Button, Row, Col } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/Field.jsx';
import { getToday9am, getTomorrow9am, makeDate } from 'utils/dates';
import { saveData } from 'utils/functions';

const FORMATION_PERIOD_OPTIONS = [
  { value: 'date', label: 'Дневной' },
  { value: 'month', label: 'Месячный' }
];

const getInitialState = () => ({
  month: new Date().getMonth() + 1,
  year: new Date().getYear() + 1900,
  date_from: getToday9am(),
  date_to: getTomorrow9am(),
  DISABLE_SUBMIT: false,
  formationPeriod: 'month',
  date: new Date(),
  with_filter: false,
});

class WaybillPrintForm extends React.Component {

  static get propTypes() {
    return {
      show: PropTypes.any,
      onHide: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.state = getInitialState();
  }

  handleSubmit = async () => {
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

  toggleWithFilter = (e) => {
    this.setState({ with_filter: !this.state.with_filter });
    e.stopPropagation();
  }
  handleChange = (field, e) => {
    console.log(field, get(e, ['target', 'value'], e))
    this.setState({ [field]: get(e, ['target', 'value'], e) });
  }
  handleChangeFormationPeriod = formationPeriod => this.setState({ formationPeriod });
  handleChangeDate = date => this.setState({ date });

  hide = () => {
    this.setState(getInitialState());
    this.props.hide();
  }
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
      <Modal id="modal-waybill-print" show={!!this.props.show} onHide={this.props.onHide} backdrop="static">

        <Modal.Header>
          <Modal.Title>Печать отчета по выработке ТС</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Div hidden={this.props.show !== 1}>
            <span style={{ marginBottom: 15, display: 'block' }}>Выберите период:</span>
            <ExtField
              type={'select'}
              label={'Период формирования'}
              options={FORMATION_PERIOD_OPTIONS}
              value={this.state.formationPeriod}
              clearable={false}
              disabled={this.state.DISABLE_SUBMIT}
              onChange={this.handleChangeFormationPeriod}
            />
            <Div hidden={this.state.formationPeriod !== 'month'}>
              <ExtField
                type="select"
                label="Месяц"
                options={MONTHS}
                sortingFunction={(a, b) => a.value - b.value}
                value={this.state.month}
                clearable={false}
                onChange={this.handleChange}
                boundKeys={['month']}
                error={errors.month}
                disabled={this.state.DISABLE_SUBMIT}
              />
              <ExtField
                type="select"
                label="Год"
                options={YEARS}
                value={this.state.year}
                clearable={false}
                onChange={this.handleChange}
                boundKeys={['year']}
                error={errors.year}
                disabled={this.state.DISABLE_SUBMIT}
              />
            </Div>
            <Div hidden={this.state.formationPeriod !== 'date'}>
              <ExtField
                type="date"
                time={false}
                label="Дата"
                value={this.state.date}
                onChange={this.handleChangeDate}
                disabled={this.state.DISABLE_SUBMIT}
              />
            </Div>
          </Div>
          <Div hidden={this.props.show === 1}>
            <Row className={'waybill-print-form'}>
              <Col md={6}>
                <ExtField
                  type={'date'}
                  time
                  label={'Время с'}
                  date={this.state.date_from}
                  onChange={this.handleChange}
                  boundKeys={['date_from']}
                />
              </Col>
              <Col md={6}>
                <ExtField
                  type={'date'}
                  time
                  label={'Время по'}
                  date={this.state.date_to}
                  onChange={this.handleChange}
                  boundKeys={['date_to']}
                />
              </Col>
            </Row>
            <Row className={'checkbox-print-with-filter'}>
              <Col md={12} onClick={this.toggleWithFilter}>
                <input type={'checkbox'} onChange={this.toggleWithFilter} checked={this.state.with_filter} /><span>{'С применением фильтрации'}</span>
              </Col>
            </Row>
            <Div hidden={!DISABLE_SUBMIT}>
              <label style={{ color: 'red', fontWeight: 'normal', fontSize: 12, marginTop: 10 }}>Даты должны быть указаны</label>
            </Div>
          </Div>
        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            <Button disabled={DISABLE_SUBMIT || this.state.DISABLE_SUBMIT} onClick={this.handleSubmit}>{'OK'}</Button>
            <Button onClick={this.props.onHide}>Отмена</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }

}

WaybillPrintForm.contextTypes = {
  flux: PropTypes.object,
};

export default WaybillPrintForm;
