import React from 'react';
import {
  Modal,
  Row,
  Col,
  Button,
  Glyphicon,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';

import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Field, { ExtField } from 'components/ui/Field.jsx';

import Form from 'components/compositions/Form.jsx';


@connectToStores(['repair', 'objects'])
export default class ProgramRegistryForm extends Form {
  state = {
    areFilesLoading: false,
    fileIsShow: false,
  }
  componentDidMount() {
    const { flux } = this.context;
    const { fromCreating } = this.props;
    if (!fromCreating) {
      flux.getActions('repair').getRepairListByType('stateProgram', { status: 'active' }, { makeOptions: true, selectListMapper: defaultSelectListMapper });
    }
    flux.getActions('repair').getRepairListByType('contractor', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
  }
  getButton = (onClick, text, show = false, canSave = true) => (
    show && <Button disabled={!canSave} onClick={onClick}>{text}</Button>
  )

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
      isPermittedByStatus = false,
      RepairOptions: {
        stateProgramOptions = [],
        contractorOptions = [],
      },
      activeVersionId,
      versionOptions = [],
      permissionForButton,
    } = this.props;

    const title = 'Создание программы ремонта';

    const buttonInFooterOne = [
      this.getButton(this.props.handleExportVersion, <Glyphicon glyph="download-alt" />, permissionForButton.exportPDF),
      this.getButton(this.props.loadFile, <Glyphicon glyph="file" />, permissionForButton.downloadFile),
      this.getButton(this.props.makeVersion, 'Создать версию', permissionForButton.createVersion, this.props.canSave && state.status === 'accepted'),
      this.getButton(this.props.sendToApply, 'Отправить на согласование', permissionForButton.sendToApply, this.props.canSave && (state.status === 'draft' || state.status === 'rejected')),
      this.getButton(this.props.onSubmit, 'Сохранить', permissionForButton.onSubmit, this.props.canSave && (state.status === 'draft' || state.status === 'rejected')),
      this.getButton(this.props.onSubmitAndContinue, 'Сохранить и продолжить', permissionForButton.onSubmitAndContinue, this.props.canSave && (state.status === 'draft' || state.status === 'rejected')),
    ];
    const buttonInFooterTwo = [
      this.getButton(this.props.applyVersion, 'Согласовать', permissionForButton.applyVersion, this.props.canSave && state.status === 'sent_to_review'),
      this.getButton(this.props.canselVersion, 'Отклонить', permissionForButton.canselVersion, this.props.canSave),
      this.getButton(this.props.closeVersion, 'Закрыть программу (завершить)', permissionForButton.closeVersion, this.props.canSave && state.status === 'accepted'),
    ];

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
                label="Версии"
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
                disabled={!isPermitted || !isPermittedByStatus}
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
                value={state.company_name}
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
                disabled={!isPermitted || !isPermittedByStatus}
              />
            </Col>
            <Col md={3}>
              <ExtField
                type="date"
                label="Плановые сроки:"
                date={state.plan_date_start}
                time={false}
                error={errors.plan_date_start}
                onChange={this.handleChange}
                boundKeys={['plan_date_start']}
                disabled={!isPermitted || !isPermittedByStatus}
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
                disabled={!isPermitted || !isPermittedByStatus}
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
                label="Фактические сроки:"
                date={state.fact_date_start}
                time={false}
                error={errors.fact_date_start}
                onChange={this.handleChange}
                boundKeys={['fact_date_start']}
                disabled={!isPermitted || !isPermittedByStatus}
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
                disabled={!isPermitted || !isPermittedByStatus}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="string"
                label="Процент выполнения"
                value={`${state.percent} %`}
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
                disabled={!isPermitted || !isPermittedByStatus}
              />
            </Col>
            <Col md={6}>
              <ExtField
                type="string"
                label="№ договора"
                value={state.contract_number}
                error={errors.contract_number}
                onChange={this.handleChange}
                boundKeys={['contract_number']}
                disabled={!isPermitted || !isPermittedByStatus}
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
                disabled={!isPermitted || !isPermittedByStatus}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Row>
            <Col md={12}>
              {
                buttonInFooterOne
              }
            </Col>
          </Row>
          <Row style={{ marginTop: 5 }}>
            <Col md={12}>
              {
                buttonInFooterTwo
              }
            </Col>
        </Row>
        </Modal.Footer>
      </Modal>
    );
  }
}
