import * as React from 'react';
import { connect } from 'react-redux';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import ModalBody from 'components/old/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Field from 'components/@next/@ui/renderFields/Field';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { FileField } from 'components/old/ui/input/fields';

import UNSAFE_Form from 'components/old/compositions/UNSAFE_Form';

import {
  ProgramRemarkList,
  ProgramObjectList,
} from 'components/old/program_registry/UpdateFrom/inside_components';
import MakeVersionFrom from 'components/old/program_registry/UpdateFrom/MakeVersionFrom';

import { getSessionState } from 'redux-main/reducers/selectors';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

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

type StateProps = {
  userPermissionsSet: Set<string>;
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  formState: any;

  formErrors: any;
  isPermitted: boolean;
  isPermittedByStatus: boolean;
  isPermittetForContractorL: boolean;
  RepairOptions: {
    stateProgramOptions: any;
    contractorOptions: any;
  };
  versionOptions: Array<any>;
  permissionForButton: any;
  show?: boolean;
  onHide: (...arg: Array<any>) => any;
  isPermittetForObjectFact: boolean;
  canSave: boolean;

  isPermittedPercentByStatus: any;

  changeVersion: (...arg: Array<any>) => Promise<any>;
  canselVersion: (...arg: Array<any>) => Promise<any>;
  onSubmitAndContinue: (...arg: Array<any>) => Promise<any>;
  handleExportVersion: (...arg: Array<any>) => Promise<any>;
  onSubmit: (...arg: Array<any>) => Promise<any>;
  applyVersion: (...arg: Array<any>) => Promise<any>;
  closeVersion: (...arg: Array<any>) => Promise<any>;

  fromCreating: any;
  activeVersionId: number;
  onSubmitFiles: (...arg: Array<any>) => Promise<any>;
  sendToApply: (...arg: Array<any>) => Promise<any>;
  updateVersionOuter: (...arg: any) => any;

  makeVersion: () => Promise<any>;

  handleFormChange: (...arg: any) => any;
  handleMultipleChange?: (...arg: any) => any;
};

type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);
type State = any;

@connectToStores(['repair'])
class ProgramRegistryForm extends UNSAFE_Form<Props, State> {
  constructor(props) {
    super(props);
    const { entity } = props;

    const isSupervisor = props.userPermissionsSet.has(`${entity}.review`);
    const isСustomer = props.userPermissionsSet.has(`${entity}.create`);

    this.state = {
      isSupervisor,
      isСustomer,
      makeVersionIsVisible: false,
      mainButtonEnable: true,
    } as any;
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

  updateObjectData = (needVersionUpdate = true, payload) => {
    if (needVersionUpdate) {
      this.props.updateVersionOuter(payload);
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
                  disabled={
                    !isPermitted
                    || !this.props.isPermittetForObjectFact
                    || !is_active
                  }
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
                  disabled={
                    !isPermitted
                    || !this.props.isPermittetForObjectFact
                    || !is_active
                  }
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
              {Boolean(state.id) && (
                <React.Fragment>
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
                    isPermittedPercentByStatus={
                      this.props.isPermittedPercentByStatus
                    }
                    changeVersion={this.props.changeVersion}
                    isPermittetForObjectFact={
                      this.props.isPermittetForObjectFact
                    }
                  />
                  <ProgramRemarkList
                    isSupervisor={isSupervisor}
                    isСustomer={isСustomer}
                    program_version_id={state.id}
                    program_version_status={state.status}
                    isPermittedByStatus={isPermittedByStatus}
                  />
                </React.Fragment>
              )}
            </EtsBootstrap.Row>
          </ModalBody>
          <EtsBootstrap.ModalFooter>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <EtsButtonsContainer>
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
                        && mainButtonEnable
                        && state.is_active,
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
                        && mainButtonEnable
                        && state.is_active,
                    ),
                  ]}
                </EtsButtonsContainer>
                <EtsButtonsContainer>
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
                      this.props.canSave
                        && state.status === 'accepted'
                        && state.is_active,
                    ),
                  ]}
                </EtsButtonsContainer>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.ModalFooter>
        </EtsBootstrap.ModalContainer>
      </div>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    userPermissionsSet: getSessionState(state).userData.permissionsSet,
  }),
)(ProgramRegistryForm as any);
