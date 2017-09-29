import React from 'react';
import {
  Modal,
  Row,
  Col,
  Button,
  Glyphicon,
} from 'react-bootstrap';

import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Field, { ExtField } from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

import MakeVersionFrom from './WorkForm/MakeVersionFrom.tsx';

@connectToStores(['repair', 'objects'])
export default class ProgramRegistryForm extends Form {
  state = {
    makeVersionIsVisible: false,
    mainButtonEnable: true,
    addFileModalShow: false,
  }
  componentDidMount() {
    const { flux } = this.context;
    const { fromCreating } = this.props;
    if (!fromCreating) {
      flux.getActions('repair').getRepairListByType('stateProgram', { status: 'active' }, { makeOptions: true, selectListMapper: defaultSelectListMapper });
    }
    flux.getActions('repair').getRepairListByType('contractor', {}, { makeOptions: true, selectListMapper: defaultSelectListMapper });
  }
  getButton = (key, onClick, text, show = false, canSave = true) => (
    show && <Button key={key} disabled={!canSave} onClick={onClick}>{text}</Button>
  )

  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  showMakeVersionForm = () => this.setState({ makeVersionIsVisible: true })
  showAddFileModal = () => this.setState({ addFileModalShow: true });
  hideAddFileModal = () => this.setState({ addFileModalShow: false });
  
  hideMakeVersionForm = () => {
    this.setState({ makeVersionIsVisible: false });
    this.handleChange('files', undefined);
  }
  handleMakeVersionClick = () => {
    this.props.makeVersion().then(() => this.hideMakeVersionForm());
  }
  sendToApply = () => {
    this.setState({ mainButtonEnable: false });
    this.props.sendToApply().then(() => {
      this.setState({ mainButtonEnable: true })
    });
  }
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

    const {
      makeVersionIsVisible = false,
      mainButtonEnable = true,
      addFileModalShow = false,
    } = this.state;

    const {
      is_active = false,
    } = state;
    const title = 'Создание программы ремонта';

    let ModalFileProps = false;
    if (makeVersionIsVisible || addFileModalShow) {
      if (addFileModalShow) {
        ModalFileProps = {
          title: 'Прикреплённый файл',
          show: addFileModalShow,
          state,
          onHide: this.hideAddFileModal,
          onSubmit: this.hideAddFileModal,
          handleChange: this.handleChange,
          btName: 'Прикрепить',
        };
      } else if (makeVersionIsVisible){
        ModalFileProps = {
          title: 'Создание новой версии',
          show: makeVersionIsVisible,
          state,
          onHide: this.hideMakeVersionForm,
          onSubmit: this.handleMakeVersionClick,
          handleChange: this.handleChange,
          btName: 'Загрузить файл и создать версию',
        };
      }
    }

    return (
      <div>
        {ModalFileProps && <MakeVersionFrom {...ModalFileProps} />}
        <Modal {...this.props} show={this.props.show && !makeVersionIsVisible} bsSize="lg" backdrop="static">
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
                  value={stateProgramOptions[0] && state.state_program_id}
                  onChange={this.handleChange}
                  boundKeys={['state_program_id']}
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
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
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
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
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
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
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
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
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
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
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
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
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
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
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
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
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                />
              </Col>
            </Row>
          </Div>
          <ModalBody />
          <Modal.Footer>
            <Row>
              <Col md={12}>
                {[
                  this.getButton(0, this.props.handleExportVersion, <Glyphicon glyph="download-alt" />, false && permissionForButton.exportPDF),
                  this.getButton(1, this.props.loadFile, <Glyphicon glyph="file" />, permissionForButton.downloadFile),
                  this.getButton(2, this.showMakeVersionForm, 'Создать версию', permissionForButton.createVersion, this.props.canSave && state.status === 'accepted' && mainButtonEnable),
                  this.getButton(3, this.sendToApply, 'Отправить на согласование', permissionForButton.sendToApply, this.props.canSave && (state.status === 'draft' || state.status === 'rejected') && mainButtonEnable),
                  this.getButton(4, this.props.onSubmit, 'Сохранить', permissionForButton.onSubmit, this.props.canSave && (state.status === 'draft' || state.status === 'rejected') && mainButtonEnable),
                  this.getButton(5, this.props.onSubmitAndContinue, 'Сохранить и продолжить', permissionForButton.onSubmitAndContinue, this.props.canSave && (state.status === 'draft' || state.status === 'rejected') && mainButtonEnable),
                ]}
              </Col>
            </Row>
            <Row style={{ marginTop: 5 }}>
              <Col md={12}>
                {[
                  this.getButton(20, this.props.applyVersion, 'Согласовать', permissionForButton.applyVersion, this.props.canSave && state.status === 'sent_on_review'),
                  this.getButton(21, this.props.canselVersion, 'Отклонить', permissionForButton.canselVersion, this.props.canSave && state.status === 'sent_on_review'),
                  this.getButton(22, this.props.closeVersion, 'Закрыть программу (завершить)', permissionForButton.closeVersion, this.props.canSave && state.status === 'accepted'),
                ]}
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
