import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Field from 'components/ui/Field';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FileField } from 'components/ui/input/fields';

import UNSAFE_Form from 'components/compositions/UNSAFE_Form';

import {
  ProgramRemarkList,
  ProgramObjectList,
} from 'components/program_registry/UpdateFrom/inside_components';
import MakeVersionFrom from 'components/program_registry/UpdateFrom/MakeVersionFrom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import { DivNone } from 'global-styled/global-styled';

const styleTextMakeVersion = { marginBottom: 5 };
const TextMakeVersion = (
  <EtsBootstrap.Row>
    <EtsBootstrap.Row>
      <EtsBootstrap.Col md={12} style={styleTextMakeVersion}>
        После создания новой версии программы ремонта, текущая версия станет
        недействующей и недоступной для ввода данных.
      </EtsBootstrap.Col>
      <EtsBootstrap.Col md={12} style={styleTextMakeVersion}>
        Если Вы уверены, что хотите продолжить, то необходимо приложить
        скан-копию документа, на основании которого создается новая версия.
      </EtsBootstrap.Col>
    </EtsBootstrap.Row>
  </EtsBootstrap.Row>
);

const getTitleByStatus = (status) => {
  switch (status) {
    case 'draft':
      return 'Программа ремонта. Черновик';
    case 'sent_on_review':
      return 'Программа ремонта. Отправлена на согласование';
    case 'accepted':
      return 'Программа ремонта. Согласована';
    case 'rejected':
      return 'Программа ремонта. Не согласована';
    case 'closed':
      return 'Программа ремонта. Выполнена';
    default:
      return 'Программа ремонта. Редактирование';
  }
};

@connectToStores(['repair', 'objects'])
class ProgramRegistryForm extends UNSAFE_Form {
  constructor(props) {
    super(props);
    const { entity } = props;

    const isSupervisor = this.props.userPermissionsSet.has(`${entity}.review`);
    const isСustomer = this.props.userPermissionsSet.has(`${entity}.create`);

    this.state = {
      isSupervisor,
      isСustomer,
      makeVersionIsVisible: false,
      mainButtonEnable: true,
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    const { fromCreating } = this.props;
    if (!fromCreating) {
      flux
        .getActions('repair')
        .getRepairListByType(
          'stateProgram',
          { status: 'active' },
          { makeOptions: true, selectListMapper: defaultSelectListMapper },
        );
    }
    flux
      .getActions('repair')
      .getRepairListByType(
        'contractor',
        {},
        { makeOptions: true, selectListMapper: defaultSelectListMapper },
      );
  }

  getButton = (key, onClick, text, show = false, canSave = true) =>
    show && (
      <EtsBootstrap.Button key={key} disabled={!canSave} onClick={onClick}>
        {text}
      </EtsBootstrap.Button>
    );

  handleSubmitWrap = (...arg) => this.handleSubmit(...arg);

  showMakeVersionForm = () => this.setState({ makeVersionIsVisible: true });

  hideMakeVersionForm = () => {
    this.setState({ makeVersionIsVisible: false });
    this.handleChange('files', undefined);
  };

  handleMakeVersionClick = (fileState) => {
    const stateForPatchFile = {
      ...fileState,
      id: this.props.activeVersionId,
    };
    return this.props
      .onSubmitFiles(stateForPatchFile)
      .then(() => this.props.makeVersion())
      .then(() => this.setState({ makeVersionIsVisible: false }));
  };

  sendToApply = () => {
    this.setState({ mainButtonEnable: false });
    return this.props
      .sendToApply()
      .then(() => this.setState({ mainButtonEnable: true }));
  };

  updateObjectData = (needVersionUpdate = true) => {
    if (needVersionUpdate) {
      this.props.updateVersionOuter();
    }
    return this.context.flux
      .getActions('repair')
      .getRepairListByType('objects', {
        program_version_id: this.props.formState.id,
      });
  };

  render() {
    const {
      formState: state,
      formErrors: errors,
      isPermitted = false,
      isPermittedByStatus = false,
      isPermittetForContractorL = false,
      RepairOptions: { stateProgramOptions, contractorOptions },
      activeVersionId,
      versionOptions,
      permissionForButton,
    } = this.props;

    const {
      makeVersionIsVisible = false,
      mainButtonEnable = true,
      isSupervisor,
      isСustomer,
    } = this.state;

    const { is_active = false, status = 'draft' } = state;

    const title = getTitleByStatus(status);
    return (
      <div>
        <MakeVersionFrom
          title="Создание новой версии"
          TextBody={TextMakeVersion}
          btName="Загрузить файл и создать версию"
          show={makeVersionIsVisible}
          onHide={this.hideMakeVersionForm}
          onSubmit={this.handleMakeVersionClick}
        />
        <EtsBootstrap.ModalContainer
          id="modal-program-registry-u"
          show={this.props.show && !makeVersionIsVisible}
          onHide={this.props.onHide}
          bsSize="large">
          <EtsBootstrap.ModalHeader closeButton>
            <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
          </EtsBootstrap.ModalHeader>
          {/* <<< Добавить page, path */}
          <ModalBody style={{ padding: '0px 15px' }}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={5} xsOffset={7}>
                <Field
                  type="select"
                  label="Версии"
                  options={versionOptions}
                  value={activeVersionId}
                  onChange={this.props.changeVersion}
                  clearable={false}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="select"
                  label="Гос. программа"
                  error={errors.state_program_id}
                  options={stateProgramOptions}
                  value={stateProgramOptions[0] && state.state_program_id}
                  onChange={this.handleChange}
                  boundKeys="state_program_id"
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                  clearable={false}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="Тип ремонта"
                  value={state.repair_type_name}
                  readOnly
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  type="string"
                  label="Тип объектов ремонта"
                  value={state.object_type_name}
                  readOnly
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  type="string"
                  label="Заказчик"
                  value={state.company_name}
                  readOnly
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row style={{ paddingTop: 15 }}>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="Наименование программы"
                  value={state.name}
                  error={errors.name}
                  onChange={this.handleChange}
                  boundKeys="name"
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  type="date"
                  label="Плановые сроки:"
                  date={state.plan_date_start}
                  time={false}
                  error={errors.plan_date_start}
                  onChange={this.handleChange}
                  boundKeys="plan_date_start"
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  type="date"
                  label=""
                  date={state.plan_date_end}
                  time={false}
                  error={errors.plan_date_end}
                  onChange={this.handleChange}
                  boundKeys="plan_date_end"
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="Статус"
                  value={state.status_name}
                  readOnly
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  type="date"
                  label="Фактические сроки:"
                  date={state.fact_date_start}
                  time={false}
                  error={errors.fact_date_start}
                  onChange={this.handleChange}
                  boundKeys="fact_date_start"
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <ExtField
                  type="date"
                  label=""
                  date={state.fact_date_end}
                  time={false}
                  error={errors.fact_date_end}
                  onChange={this.handleChange}
                  boundKeys="fact_date_end"
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="Процент выполнения"
                  value={`${state.percent} %`}
                  readOnly
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row style={{ paddingTop: 15 }}>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="select"
                  label="Подрядчик"
                  error={errors.contractor_id}
                  options={contractorOptions}
                  value={state.contractor_id}
                  onChange={this.handleChange}
                  boundKeys="contractor_id"
                  disabled={
                    !isPermitted || !isPermittetForContractorL || !is_active
                  }
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="№ контракта"
                  value={state.contract_number}
                  error={errors.contract_number}
                  onChange={this.handleChange}
                  boundKeys="contract_number"
                  disabled={
                    !isPermitted || !isPermittetForContractorL || !is_active
                  }
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={10}>
                <ExtField
                  type="text"
                  label="Примечание"
                  value={state.note ? state.note : ''}
                  onChange={this.handleChange}
                  error={errors.note}
                  boundKeys="note"
                  textAreaStyle={{ resize: 'none' }}
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <FileField
                  multiple
                  label="Файл"
                  value={state.files}
                  error={errors.files}
                  onChange={this.handleChange}
                  boundKeys="files"
                  disabled={!isPermitted || !isPermittedByStatus || !is_active}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              {state.id ? (
                <EtsBootstrap.Col md={12}>
                  <ProgramObjectList
                    program_version_id={state.id}
                    program_version_status={state.status}
                    object_type_id={state.object_type_id}
                    contract_number={state.contract_number}
                    contractor_id={state.contractor_id}
                    company_id={state.company_id}
                    company_name={state.company_name}
                    repair_type_name={state.repair_type_name}
                    updateObjectData={this.updateObjectData}
                    isPermittedByStatus={isPermittedByStatus}
                    changeVersion={this.props.changeVersion}
                  />
                  <ProgramRemarkList
                    isSupervisor={isSupervisor}
                    isСustomer={isСustomer}
                    program_version_id={state.id}
                    program_version_status={state.status}
                    isPermittedByStatus={isPermittedByStatus}
                  />
                </EtsBootstrap.Col>
              ) : (
                <DivNone />
              )}
            </EtsBootstrap.Row>
          </ModalBody>
          <EtsBootstrap.ModalFooter>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                {[
                  this.getButton(
                    0,
                    this.props.handleExportVersion,
                    <EtsBootstrap.Glyphicon glyph="download-alt" />,
                    false && permissionForButton.exportPDF,
                  ),
                  this.getButton(
                    1,
                    this.showMakeVersionForm,
                    'Создать версию',
                    permissionForButton.createVersion,
                    this.props.canSave
                      && state.status === 'accepted'
                      && state.is_active
                      && mainButtonEnable,
                  ),
                  this.getButton(
                    2,
                    this.sendToApply,
                    'Сохранить и отправить на согласование',
                    permissionForButton.sendToApply,
                    this.props.canSave
                      && (state.status === 'draft'
                        || state.status === 'rejected')
                      && mainButtonEnable,
                  ),
                  this.getButton(
                    3,
                    this.props.onSubmit,
                    'Сохранить',
                    permissionForButton.onSubmit,
                    this.props.canSave
                      && (state.status === 'draft'
                        || state.status === 'rejected'
                        || state.status === 'accepted')
                      && mainButtonEnable,
                  ),
                  this.getButton(
                    4,
                    this.props.onSubmitAndContinue,
                    'Сохранить и продолжить',
                    permissionForButton.onSubmitAndContinue,
                    this.props.canSave
                      && (state.status === 'draft'
                        || state.status === 'rejected'
                        || state.status === 'accepted')
                      && mainButtonEnable,
                  ),
                ]}
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row style={{ marginTop: 5 }}>
              <EtsBootstrap.Col md={12}>
                {[
                  this.getButton(
                    20,
                    this.props.applyVersion,
                    'Согласовать',
                    permissionForButton.applyVersion,
                    this.props.canSave && state.status === 'sent_on_review',
                  ),
                  this.getButton(
                    21,
                    this.props.canselVersion,
                    'Отклонить',
                    permissionForButton.canselVersion,
                    this.props.canSave && state.status === 'sent_on_review',
                  ),
                  this.getButton(
                    22,
                    this.props.closeVersion,
                    'Закрыть программу (завершить)',
                    permissionForButton.closeVersion,
                    this.props.canSave && state.status === 'accepted',
                  ),
                ]}
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.ModalFooter>
        </EtsBootstrap.ModalContainer>
      </div>
    );
  }
}

export default compose(
  connect((state) => ({
    userPermissionsSet: getSessionState(state).userData.permissionsSet,
  })),
)(ProgramRegistryForm);
