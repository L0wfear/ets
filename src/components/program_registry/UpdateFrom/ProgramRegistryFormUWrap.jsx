import React from 'react';

import FormWrap from 'components/compositions/FormWrap.jsx';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import ProgramRegistryFormBase from './ProgramRegistryUForm';

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

const ButtonInFormList = Object.keys(existButtonInForm);
const ButtonInFormDefPermission = ButtonInFormList.reduce((obj, name) => Object.assign(obj, ({ [name]: false })), {});

const ProgramRegistryForm = enhanceWithPermissions(ProgramRegistryFormBase);
const checkIsPermittedByStatus = (status) => {
  switch (status) {
    case 'sent_on_review':
    case 'accepted':
    case 'closed':
      return false;
    default:
      return true;
  }
};
// РЕФАКТОРИНГ
// Писалось на скорую руку ( отмазка )
class ProgramRegistryFormWrap extends FormWrap {
  constructor(props) {
    super(props);
    this.preventDefaultNotification = true;

    this.state = {
      isLoading: false,
      activeVersion: 0,
      versionOptions: [],
      formState: {},
      formErrors: {},
      permissionForButton: { ...ButtonInFormDefPermission },
    };
  }
  componentDidMount() {
    const {
      id,
    } = this.props.element;

    const permissionForButton = Object.entries(existButtonInForm).reduce((newObj, [buttonName, buttonPerm]) => {
      newObj[buttonName] = this.context.flux.getStore('session').getPermission(buttonPerm);
      return newObj;
    }, {});

    const data = {
      id,
      activeVersionIdprops: false,
      additionalState: {
        permissionForButton,
      },
    };

    this.updateVersionList(data);
  }

  /**
   * @override
   */
  validate = (state, errors) => this.props.validate(state, errors);

  handleFormStateChangeWrap = (...arg) => this.handleFormStateChange(...arg);

  updateVersionList({ id, activeVersionIdprops = false, additionalState }) {
    this.setState({
      isLoading: true,
    });

    return this.context.flux.getActions('repair').getAllVersionsById(id).then(({ result: { rows = [] } }) => {
      const reduceVersionList = rows.reduce((newObj, d) => Object.assign(newObj, ({ [d.id]: d })), {});

      const versionOptions = rows
        .map(d => ({
          value: d.id,
          label: `${d.version_name} (${d.is_active ? 'Действующая' : 'Недействующая'})`,
        }));

      const activeVersionId = activeVersionIdprops || rows.find(d => d.is_active).id;

      this.setState({
        isLoading: true,
        versionOptions,
        activeVersionId,
        reduceVersionList,
        ...additionalState,
        ...this.props.getFrowmStateAndErrorAndCanSave(reduceVersionList[activeVersionId]),
      });
    });
  }

  changeVersion = (version) => {
    const { reduceVersionList } = this.state;

    this.setState({
      activeVersionId: version,
      ...this.props.getFrowmStateAndErrorAndCanSave(reduceVersionList[version]),
    });
  }
  handleExportVersion = () => {
    global.NOTIFICATION_SYSTEM.notify('Не реализовано', 'error');
  }
  loadFile = () => {
    global.NOTIFICATION_SYSTEM.notify('Не реализовано', 'error');
  }
  makeVersion = () => {
    const payload = {};
    payload.callback = this.context.flux.getActions('repair').programVersionCreateVersion;
    payload.outFormState = {
      ...this.state.formState,
      program_id: this.props.element.id,
    };

    return this.props.defSendFromState(payload).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Версия создана', 'success');

      const {
        element: {
          id = 0,
        } = {},
      } = this.props;

      return this.updateVersionList({ id });
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка создания версии', 'error');
    });
  }

  sendToApply = () => {
    const payload = {};
    payload.callback = this.context.flux.getActions('repair').programVersionSendToReview;
    payload.outFormState = { ...this.state.formState };

    return this.props.defSendFromState(payload).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Запрос на согласование отправлен', 'success');

      const {
        element: {
          id = 0,
        } = {},
      } = this.props;

      const { activeVersionId } = this.state;

      return this.updateVersionList({ id, activeVersionId });
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Запрос на согласование не отправлен', 'error');
    });
  }

  onSubmitAndContinue = () => this.onSubmitWithouContinue(false);

  onSubmitWithouContinue = (close = true) => {
    const payload = {};
    payload.callback = this.context.flux.getActions('repair').programVersionPut;
    payload.outFormState = { ...this.state.formState };

    this.props.defSendFromState(payload).then(() => {
      if (close) {
        return this.props.onFormHide();
      }
      const {
        element: {
          id = 0,
        } = {},
      } = this.props;

      const { activeVersionId } = this.state;

      return this.updateVersionList({ id, activeVersionId });
    });
  }
  onSubmitFiles = (fileState) => {
    const payload = {};
    payload.callback = this.context.flux.getActions('repair').programVersionPutOnlyFiles;
    payload.outFormState = { ...fileState };

    return this.props.defSendFromState(payload).then(() => {
      const {
        element: {
          id = 0,
        } = {},
      } = this.props;

      const { activeVersionId } = this.state;

      return this.updateVersionList({ id, activeVersionId });
    });
  }

  applyVersion = () => {
    const payload = {};
    payload.callback = this.context.flux.getActions('repair').programVersionSendToApply;
    payload.outFormState = { ...this.state.formState };

    this.props.defSendFromState(payload).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Версия согласована', 'success');

      const {
        element: {
          id = 0,
        } = {},
      } = this.props;

      const { activeVersionId } = this.state;

      return this.updateVersionList({ id, activeVersionId });
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка согласования версии', 'error');
    });
  }

  canselVersion = () => {
    const payload = {};
    payload.callback = this.context.flux.getActions('repair').programVersionSendToCansel;
    payload.outFormState = { ...this.state.formState };

    this.props.defSendFromState(payload).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Версия отменена', 'success');

      const {
        element: {
          id = 0,
        } = {},
      } = this.props;

      const { activeVersionId } = this.state;

      return this.updateVersionList({ id, activeVersionId });
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка отмены версии', 'error');
    });
  }

  closeVersion = () => {
    const { formState: { percent = 0 } } = this.state;

    if (percent < 100) {
      global.NOTIFICATION_SYSTEM.notify('Программа ремонта не выполнена', 'warning');
      return;
    }

    const payload = {};
    payload.callback = this.context.flux.getActions('repair').programVersionSendToClose;
    payload.outFormState = { ...this.state.formState };

    this.props.defSendFromState(payload).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Версия закрыта', 'success');

      const {
        element: {
          id = 0,
        } = {},
      } = this.props;

      const { activeVersionId } = this.state;

      return this.updateVersionList({ id, activeVersionId });
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка закрытия версии', 'error');
    });
  }

  render() {
    const {
      isPermitted = false,
      entity,
    } = this.props;
    const {
      saveButtonEnability = true,
      fromCreating = false,
      versionOptions = [],
      activeVersionId = 0,
      permissionForButton = {},
    } = this.state;

    const canSave = isPermitted && this.state.canSave && saveButtonEnability;
    const isPermittedByStatus = checkIsPermittedByStatus(this.state.formState.status);

    return (
      <ProgramRegistryForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        entity={entity}
        addPermissionProp
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
        onSubmitFiles={this.onSubmitFiles}

        applyVersion={this.applyVersion}
        canselVersion={this.canselVersion}
        closeVersion={this.closeVersion}
      />
    );
  }
}

export default enhanceWithPermissions(ProgramRegistryFormWrap);
