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
// РЕФАКТОРИНГ
// Писалось на скорую руку ( отмазки) )
class ProgramRegistryFormWrap extends FormWrap {
  state = {
    fromCreating: false,
    versionOptions: [],
    activeVersion: 0,
  };
  iLoad = false;
  constructor(props, context) {
    super(props);
    this.schema = formValidationSchema;
    this.preventDefaultNotification = true;

    this.createAction = context.flux.getActions('repair').programRegistryPost;
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
      console.warn(e);

      throw e;
    }
  }

  handleSubmitFirstForm = () => {
    const callback = this.context.flux.getActions('repair').programRegistryPost;
    this.defSendFromState(callback).then((result) => {
      if (result.error) return;

      // форма не обновляет значения, если её не закрыть
      this.props.onFormHide();
      this.setState({ fromCreating: true });
      this.props.setNewSelectedElement(result.result.rows[0]);
    });
  }

  changeVersion = (version) => {
    const { reduceVersionList } = this.state;

    this.setState({ ...this.getFrowmStateAndErrorAndCanSave(reduceVersionList[version]) });
  }
  handleExportVersion = () => {
  }
  loadFile = () => {
  }
  makeVersion = () => {
    const callback = this.context.flux.getActions('repair').programVersionCreateVersion;
    this.defSendFromState(callback, { program_id: this.props.element.id }).then(() => {
      // global.NOTIFICATION_SYSTEM.notify('Версия создана', 'success');
      this.updateVersionList(this.props.element.id, this.state.activeVersionId);
    }).catch(() => {
      // global.NOTIFICATION_SYSTEM.notify('Версия не создана', 'error');
    });
  }

  sendToApply = () => {
    const callback = this.context.flux.getActions('repair').programVersionSendToReview;
    this.defSendFromState(callback).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Запрос на согласование отправлен', 'success');
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
      global.NOTIFICATION_SYSTEM.notify('Версия применена', 'success');
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка применения версии', 'error');
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
    const callback = this.context.flux.getActions('repair').programVersionSendToClose;
    this.defSendFromState(callback).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Версия закрыта', 'success');
    }).catch(() => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка закрытия версии', 'error');
    });
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
        handleFormChange={this.handleFormStateChange.bind(this)}
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
    } = this.state;

    const canSave = isPermitted && this.state.canSave && saveButtonEnability;

    return (
      <ProgramRegistryForm
        formState={this.state.formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        addPermissionProp
        isPermitted={isPermitted}
        canSave={canSave}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        fromCreating={fromCreating}

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
