import * as React from 'react';
import * as PropTypes from 'prop-types';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/new/field/ExtField';
import Div from 'components/ui/Div';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import Form from 'components/compositions/Form';
import { addTime, diffDates } from 'utils/dates';

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
      <Modal id="modal-missions-creation" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={12}>
              <label>Время выполнения</label>
            </Col>
            <Col md={6}>
              <ExtField
                type="date"
                label="c"
                error={errors.date_start}
                value={state.date_start}
                onChange={this.handleChangeDateStart}
              />
            </Col>
            <Col md={6}>
              <ExtField
                type="date"
                label="по"
                error={errors.date_end}
                value={state.date_end}
                onChange={this.handleChange}
                boundKeys={['date_end']}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Источник получения задания"
                error={errors.mission_source_id}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange}
                boundKeys={['mission_source_id']}
                clearable={false}
              />
              <span className="help-block-mission-source">Задания на основе централизованных заданий необходимо создавать во вкладке "НСИ"-"Реестр централизованных заданий".</span>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ExtField
                type="number"
                label="Количество циклов"
                error={errors.passes_count}
                value={state.passes_count}
                onChange={this.handleChange}
                boundKeys={['passes_count']}
              />
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block">
            <Div className="inline-block assignToWaybillCheck"  >
              <ReactSelect
                type="select"
                options={ASSIGN_OPTIONS}
                value={state.assign_to_waybill}
                clearable={false}
                onChange={this.handleChange.bind(this, 'assign_to_waybill')}
              />
            </Div>
            <Div hidden={state.status === 'closed'}>
              <Button disabled={!this.props.canSave} onClick={this.handleSubmit}>Сформировать</Button>
            </Div>
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
