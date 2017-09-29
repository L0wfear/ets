import React from 'react';
import { omit, cloneDeep } from 'lodash';

import { isEmpty } from 'utils/functions';
import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import ProgramRegistryFormCreate from './ProgramRegistryFormCreate';
import ProgramRegistryForm from './ProgramRegistryForm';
import { formValidationSchema } from './schema';

const firstStepFields = [
  'state_program_id',
  'name',
  'repair_type_id',
  'plan_date_start',
  'plan_date_end',
];

const existButtonInForm = {
  exportPDF: 'repair_program_version.read',
  downloadFile: 'repair_program_version.update',
  createVersion: 'repair_program_version.create',
  sendToApply: 'repair_program_version.update',
  onSubmit: 'repair_program_version.create',
  onSubmitAndContinue: 'repair_program_version.create',
  applyVersion: 'repair_program_version.review',
  canselVersion: 'repair_program_version.review',
  closeVersion: 'repair_program_version.update',
};

// РЕФАКТОРИНГ
// Писалось на скорую руку ( отмазка )
class ProgramRegistryFormWrap extends FormWrap {
  iLoad = false;
  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('repair').programRegistryPost;

    const permissionForButton = Object.entries(existButtonInForm).reduce((newObj, [buttonName, buttonPerm]) => {
      newObj[buttonName] = context.flux.getStore('session').getPermission(buttonPerm);
      return newObj;
    }, {});

    this.state = {
      fromCreating: false,
      versionOptions: [],
      activeVersion: 0,
      showFormMakeVersion: false,
      permissionForButton,
    };
  }
  /**
  * @override
  */
  componentWillReceiveProps(props) {
    const uniqueField = this.uniqueField || 'id';

    if (props.showForm && (props.showForm !== this.props.showForm)) {
      if (props.element && !isEmpty(props.element[uniqueField]) && props.element.id) {
        this.updateVersionList(props.element.id);
      } else {
        this.setState({ ...this.getFrowmStateAndErrorAndCanSave(props.element) });
      }
    }
  }
  handleFormStateChangeWrap = (...arg) => this.handleFormStateChange(...arg);

  async updateVersionList(id, activeVersionIdprops = false) {
    this.iLoad = true;
    const { result: { rows = [] } } = await this.context.flux.getActions('repair').getAllVersionsById(id);

    this.iLoad = false;

    const reduceVersionList = rows.reduce((newObj, d) => {
      newObj[d.id] = d;
      return newObj;
    }, {});

    const versionOptions = rows.map(d => ({ value: d.id, label: `${d.version_name} (${d.is_active ? 'Действующая' : 'Недействующая'})` }));

    const activeVersionId = activeVersionIdprops || rows.find(d => d.is_active).id;

    this.setState({
      ...this.getFrowmStateAndErrorAndCanSave(reduceVersionList[activeVersionId]),
      versionOptions,
      activeVersionId,
      reduceVersionList,
    });
  }

  async defSendFromState(callback) {
    let { formState } = this.state;

    Object.entries(formState).forEach(([key, val]) => {
      if (typeof val === 'string') {
        formState[key] = val.trim();
      }
    });

    if (this.schema) {
      this.schema.properties.forEach((p) => {
        if (p.type === 'number' && p.float) {
          formState[p.key] = !isNaN(formState[p.key]) && formState[p.key] !== null ? parseFloat(formState[p.key]) : null;
        }
        if (p.type === 'number' && p.integer) {
          const parsedValue = parseInt(formState[p.key], 10);
          formState[p.key] = !isNaN(parsedValue) ? parsedValue : null;
        }

        if (typeof p.isSubmitted === 'function') {
          formState = p.isSubmitted(formState) ? formState : omit(formState, p.key);
        }
      });
    }

    try {
      this.setState({
        saveButtonLabel: 'Сохранение...',
        saveButtonEnability: false,
      });
      const result = await callback(formState);

      this.setState({
        saveButtonLabel: 'Сохранить',
        saveButtonEnability: true,
      });
      return result;
    } catch (e) {
      this.setState({
        saveButtonLabel: 'Сохранить',
        saveButtonEnability: true,
      });
      console.warn(e); // eslint-disable-line

      throw e;
    }
  }

  handleSubmitFirstForm = () => {
    const callback = this.context.flux.getActions('repair').programRegistryPost;
    this.defSendFromState(callback).then((result) => {
      this.props.onFormHide();
      this.setState({ fromCreating: true });
      this.props.setNewSelectedElement(result.result.rows[0]);
    });
  }

  changeVersion = (version) => {
    const { reduceVersionList } = this.state;

    this.setState({
      activeVersionId: version,
      ...this.getFrowmStateAndErrorAndCanSave(reduceVersionList[version]),
    });
  }
  handleExportVersion = () => {
    global.NOTIFICATION_SYSTEM.notify('Не реализовано', 'error');
  }
  loadFile = () => {
    global.NOTIFICATION_SYSTEM.notify('Не реализовано', 'error');
  }
  makeVersion = () =>
    confirmDialog({
      title: 'Внимание',
      body: 'После создания новой версии программы ремонта, текущая версия станет недействующей и недоступной для ввода данных. Вы уверены, что хотите продолжить?',
    })
    .then(() => {
      this.setState({
        showFormMakeVersion: true,
      });
      const callback = this.context.flux.getActions('repair').programVersionCreateVersion;
      this.defSendFromState(callback, { program_id: this.props.element.id }).then(() => {
        global.NOTIFICATION_SYSTEM.notify('Версия создана', 'success');
        this.updateVersionList(this.props.element.id, this.state.activeVersionId);
      }).catch(() => {
        global.NOTIFICATION_SYSTEM.notify('Ошибка создания версии', 'error');
      });
    });

  sendToApply = () => {
    const callback = this.context.flux.getActions('repair').programVersionSendToReview;

    return this.defSendFromState(callback).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Запрос на согласование отправлен', 'success');
      return this.updateVersionList(this.props.element.id, this.state.activeVersionId);
    }).then(() => {
      console.log('version is apdate');
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Запрос на согласование не отправлен', 'error');
    });
  }

  onSubmitWithouContinue = (close = true) => {
    const callback = this.context.flux.getActions('repair').programVersionPut;

    this.defSendFromState(callback).then(() => {
      if (close) {
        this.props.onFormHide();
      } else {
        this.updateVersionList(this.props.element.id, this.state.activeVersionId);
      }
    });
  }
  onSubmitAndContinue = () => this.onSubmitWithouContinue(false);

  getFrowmStateAndErrorAndCanSave(elementOld = null) {
    let element = {};
    if (elementOld !== null) {
      element = cloneDeep(elementOld);
    } else {
      element = !isEmpty(this.defaultElement) ? cloneDeep(this.defaultElement) : {};
    }
    const formErrors = this.validate(element, {});

    return {
      formState: element,
      formErrors,
      canSave: Object.values(formErrors).reduce((boolean, oneError) => boolean && !oneError, true),
    };
  }

  applyVersion = () => {
    const callback = this.context.flux.getActions('repair').programVersionSendToApply;
    this.defSendFromState(callback).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Версия согласована', 'success');
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка согласования версии', 'error');
    });
  }
  canselVersion = () => {
    const callback = this.context.flux.getActions('repair').programVersionSendToCansel;
    this.defSendFromState(callback).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Версия отменена', 'success');
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка отмены версии', 'error');
    });
  }
  closeVersion = () => {
    const { fromState: { percent = 0 } } = this.state;

    if (percent < 100) {
      global.NOTIFICATION_SYSTEM.notify('Программа ремонта не выполнена', 'warning');
      return;
    }

    const callback = this.context.flux.getActions('repair').programVersionSendToClose;
    this.defSendFromState(callback).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Версия закрыта', 'success');
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка закрытия версии', 'error');
    });
  }

  checkIsPermittedByStatus(status) {
    switch (status) {
      case 'sent_on_review':
      case 'accepted':
      case 'closed':
        return false;
      default:
        return true;
    }
  }

  renderFromFirstCreate() {
    const { entity, isPermitted = false } = this.props;
    const { saveButtonEnability = true } = this.state;

    const stateCanSave = Object.entries(this.state.formErrors).reduce((boolean, [key, oneError]) => {
      if (firstStepFields.includes(key)) {
        return boolean && !oneError;
      }
      return boolean;
    }, true);

    const canSave = isPermitted && stateCanSave && saveButtonEnability;

    return (
      <ProgramRegistryFormCreate
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        canSave={canSave}
        onSubmit={this.handleSubmitFirstForm}
        handleFormChange={this.handleFormStateChangeWrap}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
      />
    );
  }

  renderFrom() {
    const {
      entity,
      isPermitted = false,
    } = this.props;
    const {
      saveButtonEnability = true,
      fromCreating = false,
      versionOptions = [],
      activeVersionId = 0,
      permissionForButton = {},
    } = this.state;

    const canSave = isPermitted && this.state.canSave && saveButtonEnability;
    const isPermittedByStatus = this.checkIsPermittedByStatus(this.state.formState.status);

    return (
      <ProgramRegistryForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        isPermittedByStatus={isPermittedByStatus}
        canSave={canSave}
        handleFormChange={this.handleFormStateChangeWrap}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        fromCreating={fromCreating}
        permissionForButton={permissionForButton}

        activeVersionId={activeVersionId}
        versionOptions={versionOptions}
        changeVersion={this.changeVersion}

        handleExportVersion={this.handleExportVersion}
        loadFile={this.loadFile}
        makeVersion={this.makeVersion}
        sendToApply={this.sendToApply}
        onSubmit={this.onSubmitWithouContinue}
        onSubmitAndContinue={this.onSubmitAndContinue}

        applyVersion={this.applyVersion}
        canselVersion={this.canselVersion}
        closeVersion={this.closeVersion}
      />
    );
  }

  render() {
    const { showForm } = this.props;
    if (!showForm || this.iLoad) return null;

    const {
      formState = {},
    } = this.state;
    const uniqueField = this.uniqueField || 'id';

    if (isEmpty(formState[uniqueField])) {
      return this.renderFromFirstCreate();
    }
    return this.renderFrom();
  }
}

export default enhanceWithPermissions(ProgramRegistryFormWrap);
