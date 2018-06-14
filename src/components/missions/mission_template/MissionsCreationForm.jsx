import React from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/input/DatePicker.jsx';
import EtsSelect from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';

class MissionsCreationForm extends Form {

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('missions').getMissionSources();
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const { missionSourcesList = [] } = this.props;

    const MISSION_SOURCES = missionSourcesList.map(({ id, name }) => ({ value: id, label: name }));
    const ASSIGN_OPTIONS = [
      { value: 'assign_to_active', label: 'Добавить в активный ПЛ' },
      { value: 'assign_to_new_draft', label: 'Создать черновик ПЛ' },
      { value: 'assign_to_available_draft', label: 'Добавить в черновик ПЛ' },
    ];

    console.log('form state is ', state); // eslint-disable-line

    const title = 'Формирование заданий из шаблонов';

    return (
      <Modal {...this.props} id="modal-missions-creation" bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={6}>
              <label>Время выполнения</label>
              <Div>c <Datepicker date={state.date_start} onChange={this.handleChange.bind(this, 'date_start')} /></Div>
            </Col>
            <Col md={6}>
              <label style={{ minHeight: 15 }} />
              <Div>по <Datepicker date={state.date_end} onChange={this.handleChange.bind(this, 'date_end')} /></Div>
            </Col>
          </Row>
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
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="number"
                label="Количество проходов"
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
            <Button onClick={this.handleSubmit}>{'Сформировать'}</Button>
          </Div>
        </Modal.Footer>

      </Modal>
    );
  }
}

MissionsCreationForm.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(MissionsCreationForm, ['objects', 'missions']);
