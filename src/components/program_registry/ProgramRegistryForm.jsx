import React from 'react';
import { Modal, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { get } from 'lodash';

import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Field, { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['repair', 'objects'])
export default class ProgramRegistryForm extends Form {
  componentDidMount() {
    const { flux } = this.context;
    const { fromCreating } = this.props;
    if (!fromCreating) {
      flux.getActions('repair').getRepairListByType('stateProgram', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
    }
    flux.getActions('repair').getRepairListByType('contractor', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
    flux.getActions('objects').getOrganizations();
  }

  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  render() {
    const [
      state,
      errors,
    ] = [
      this.props.formState,
      this.props.formErrors,
    ];

    const {
      isPermitted = false,
      RepairOptions: {
        stateProgramOptions = [],
        contractorOptions = [],
      },
      organizations = [],
      activeVersionId,
      versionOptions = [],
    } = this.props;
    const IS_CREATING = !state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} bsSize="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: '0px 15px' }}>
          <Row>
            <Col md={5} xsOffset={7}>
              <Field
                type="select"
                label="Версия"
                options={versionOptions}
                value={activeVersionId}
                onChange={this.props.changeVersion}
                disabled={!isPermitted}
                clearable={false}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="select"
                label="Гос. программа"
                error={errors.state_program_id}
                options={stateProgramOptions}
                value={state.state_program_id}
                onChange={this.handleChange}
                boundKeys={['state_program_id']}
                disabled={!isPermitted}
                clearable={false}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="string"
                label="Тип ремонта"
                value={state.repair_type_name}
                readOnly
              />
            </Col>
            <Col md={6}>
              <ExtField
                type="string"
                label="Заказчик"
                value={get(organizations.find(s => s.company_id === state.company_id), 'company_name', '')}
                readOnly
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col md={6}>
              <ExtField
                type="string"
                label="Наименование программы"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange}
                boundKeys={['name']}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="date"
                label="Плановые сроки"
                date={state.plan_date_start}
                time={false}
                error={errors.plan_date_start}
                onChange={this.handleChange}
                boundKeys={['plan_date_start']}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="date"
                date={state.plan_date_end}
                time={false}
                error={errors.plan_date_end}
                onChange={this.handleChange}
                boundKeys={['plan_date_end']}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="string"
                label="Статус"
                value={state.status_name}
                readOnly
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="date"
                label="Фактические сроки"
                date={state.fact_date_start}
                time={false}
                error={errors.fact_date_start}
                onChange={this.handleChange}
                boundKeys={['fact_date_start']}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="date"
                date={state.fact_date_end}
                time={false}
                error={errors.fact_date_end}
                onChange={this.handleChange}
                boundKeys={['fact_date_end']}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="string"
                label="Процент выполнения"
                value={state.percent}
                readOnly
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col md={6}>
              <ExtField
                type="select"
                label="Подрядчик"
                error={errors.contractor_id}
                options={contractorOptions}
                value={state.contractor_id}
                onChange={this.handleChange}
                boundKeys={['contractor_id']}
                disabled={!isPermitted}
              />
            </Col>
            <Col md={6}>
              <ExtField
                type="string"
                label="№ контракта"
                value={state.contract_number}
                error={errors.contract_number}
                onChange={this.handleChange}
                boundKeys={['contract_number']}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
          <Row>
            <Col md={10}>
              <ExtField
                type="text"
                label="Примечание"
                value={state.note}
                onChange={this.handleChange}
                error={errors.note}
                boundKeys={['note']}
                textAreaStyle={{ resize: 'none' }}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          { false &&
            <Button onClick={this.props.handleExportVersion}><Glyphicon glyph="download-alt" /></Button>
          }
          { false &&
            <Button onClick={this.props.loadFile}><Glyphicon glyph="file" /></Button>
          }
          { false &&
            <Button disabled={true || !this.props.canSave} onClick={this.props.makeVersion}>Создать версию</Button>
          }
          <Button disabled={!this.props.canSave} onClick={this.props.sendToApply}>Отправить на согласование</Button>
          <Button disabled={!this.props.canSave} bsStyle="primary" onClick={this.props.onSubmit}>Сохранить</Button>
          <Button disabled={!this.props.canSave} onClick={this.props.onSubmitAndContinue}>Сохранить и продолжить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
