import * as React from 'react';
import * as PropTypes from 'prop-types';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/input/date-picker/DatePicker';
import EtsSelect from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';
import { addTime, diffDates } from 'utils/dates.js';

class MissionsCreationForm extends Form {

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('missions').getMissionSources();
  }

  handleChangeDateStart = (date_start) => {
    const { formState: { date_end }, countBumpDateEnd } = this.props;
    this.handleChange('date_start', date_start);
    if (this.props.needMoveDateEnd && date_start && date_end && diffDates(date_end, date_start, 'hours') > countBumpDateEnd) {
      this.handleChange('date_end', addTime(date_start, countBumpDateEnd, 'hours'));
    }
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const { missionSourcesList = [] } = this.props;

    const MISSION_SOURCES = missionSourcesList.reduce((newArr, { id, name, auto }) => {
      if (!auto || state.mission_source_id === id) {
        newArr.push({ value: id, label: name });
      }
      return newArr;
    }, []);

    const ASSIGN_OPTIONS = [
      { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
      { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
      { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
    ];

    console.log('form state is ', state); // eslint-disable-line

    const title = 'Формирование заданий из шаблонов';

    return (
      <Modal show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Div style={{ marginBottom: 20 }} >
            <Row>
              <Col md={6}>
                <label>Время выполнения</label>
                <Div>c <Datepicker date={state.date_start} onChange={this.handleChangeDateStart} /></Div>
              </Col>
              <Col md={6}>
                <label style={{ minHeight: 15 }} />
                <Div>по <Datepicker date={state.date_end} onChange={this.handleChange.bind(this, 'date_end')} /></Div>
              </Col>
            </Row>
          </Div>
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Источник получения задания"
                error={errors.mission_source_id}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
              <span className="help-block-mission-source">{'Задания на основе централизованных заданий необходимо создавать во вкладке "НСИ"-"Реестр централизованных заданий".'}</span>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="number"
                label="Количество циклов"
                error={errors.passes_count}
                value={state.passes_count}
                onChange={this.handleChange.bind(this, 'passes_count')}
                min={0}
              />
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block assignToWaybillCheck" style={{ width: '300px', textAlign: 'left !important', height: '22px', marginRight: '20px' }}>
            <EtsSelect
              type="select"
              options={ASSIGN_OPTIONS}
              value={state.assign_to_waybill}
              clearable={false}
              onChange={this.handleChange.bind(this, 'assign_to_waybill')}
            />
          </Div>
          <Div className="inline-block" hidden={state.status === 'closed'}>
            <Button disabled={!this.props.canSave} onClick={this.handleSubmit}>{'Сформировать'}</Button>
          </Div>
        </Modal.Footer>

      </Modal>
    );
  }
}

MissionsCreationForm.contextTypes = {
  flux: PropTypes.object,
};

export default connectToStores(MissionsCreationForm, ['objects', 'missions']);
