import * as React from 'react';

import { isEmpty } from 'utils/functions';
import { FluxContext } from 'utils/decorators';

import ProgramRegistryFormBase from 'components/old/program_registry/UpdateFrom/ProgramRegistryUForm';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get, cloneDeep } from 'lodash';

import { getSessionState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { isNullOrUndefined } from 'util';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { ReduxState } from 'redux-main/@types/state';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

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
const ButtonInFormDefPermission = ButtonInFormList.reduce(
  (obj, name) => ({ ...obj, [name]: false }),
  {},
);

const ProgramRegistryForm = withRequirePermission<any>({
  byEntity: true,
  type: 'read',
})(ProgramRegistryFormBase);

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
const checkIsPermittedByStatusForObjectFact = (status) => {
  switch (status) {
    case 'sent_on_review':
    case 'closed':
      return false;
    default:
      return true;
  }
};
const checkIsPermittedByStatusForContractorLine = (status) => {
  switch (status) {
    case 'sent_on_review':
    case 'closed':
      return false;
    default:
      return true;
  }
};

type StateProps = {
  userPermissionsSet: Set<string>;
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  [k: string]: any;
};

type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);
type State = any;

@FluxContext
class ProgramRegistryFormWrap extends React.Component<Props, State> {
  preventDefaultNotification = true;
  defaultElement: any;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      activeVersion: 0,
      versionOptions: [],
      formState: {},
      formErrors: {},
      permissionForButton: { ...ButtonInFormDefPermission },
    } as any;
  }

  componentDidMount() {
    const { id } = this.props.element;

    const permissionForButton = Object.entries(existButtonInForm).reduce(
      (newObj, [buttonName, buttonPerm]) => ({
        ...newObj,
        [buttonName]: this.props.userPermissionsSet.has(buttonPerm),
      }),
      {},
    );

    const data = {
      id,
      additionalState: { permissionForButton },
    };

    this.updateVersionList(data);
    this.componentDidUpdate({});
  }

  componentDidUpdate(prevProps) {
    const { props } = this;

    const prevId = get(prevProps.element, 'id');
    const id = get(props.element, 'id');

    if (prevId !== id) {
      let element = {};
      if (props.element !== null) {
        element = cloneDeep(props.element);
      } else {
        element = !isEmpty(this.defaultElement)
          ? cloneDeep(this.defaultElement)
          : {};
      }
      const formErrors = this.validate(element, {});

      this.setState({
        formState: element,
        formErrors,
        canSave: Object.values(formErrors).reduce(
          (boolean, oneError) => boolean && !oneError,
          true,
        ),
      });
    }
  }

  /**
   * @override
   */
  validate = (state, errors) => this.props.validate(state, errors);

  updateVersionList({ id, additionalState, percentUpdate }: any) {
    this.setState({ isLoading: true });
    return this.context.flux
      .getActions('repair')
      .getAllVersionsById(id)
      .then(({ result: { rows: versionList } }) => {
        const reduceVersionList = versionList.reduce(
          (newObj, d) => ({ ...newObj, [d.id]: d }),
          {},
        );

        const versionOptions = versionList.map((version) => ({
          value: version.id,
          label: `${version.version_name} (${
            version.is_active ? 'Действующая' : 'Недействующая'
          })`,
        }));

        const activeVersionId = versionList.find((d) => d.is_active).id;

        const oldFormState = {
          ...this.state.formState,
          percent: get(reduceVersionList[activeVersionId], 'percent', null),
        };
        const versionState = !isNullOrUndefined(percentUpdate)
          ? {
            ...this.props.getFrowmStateAndErrorAndCanSave(oldFormState),
          }
          : {
            ...this.props.getFrowmStateAndErrorAndCanSave(
              reduceVersionList[activeVersionId],
            ),
          };

        this.setState({
          isLoading: true,
          versionOptions,
          activeVersionId,
          reduceVersionList,
          ...additionalState,
          ...versionState,
        });
      });
  }

  changeVersion = (version) => {
    const { reduceVersionList } = this.state;

    this.setState({
      activeVersionId: version,
      ...this.props.getFrowmStateAndErrorAndCanSave(reduceVersionList[version]),
    });
    return Promise.resolve();
  };

  handleExportVersion = () => {
    global.NOTIFICATION_SYSTEM.notify('Не реализовано', 'error');
  };

  loadFile = () => {
    global.NOTIFICATION_SYSTEM.notify('Не реализовано', 'error');
  };

  makeVersion = () => {
    const payload: any = {};
    payload.callback = this.context.flux.getActions(
      'repair',
    ).programVersionCreateVersion;
    payload.outFormState = {
      ...this.state.formState,
      program_id: this.props.element.id,
    };

    this.props.setParams({
      program_registry_registry_id: null,
    });

    return this.props
      .defSendFromState(payload)
      .then((ans) => {
        global.NOTIFICATION_SYSTEM.notify('Версия создана', 'success');
        this.props.setParams({
          program_registry_registry_id: get(ans, 'result.rows.0.id', null),
        });
        return this.updateVersionList({ id: this.props.element.id });
      })
      .catch(({ errorIsShow }) => {
        this.props.setParams({
          program_registry_registry_id: this.props.element.id,
        });
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify('Ошибка создания версии', 'error');
        }
      });
  };

  sendToApply = () => {
    const payload: any = {};
    payload.callback = this.context.flux.getActions(
      'repair',
    ).programVersionSendToReview;
    payload.outFormState = { ...this.state.formState };

    return this.props
      .defSendFromState(payload)
      .then(() => {
        global.NOTIFICATION_SYSTEM.notify(
          'Запрос на согласование отправлен',
          'success',
        );

        return this.updateVersionList({ id: this.props.element.id });
      })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify(
            'Запрос на согласование не отправлен',
            'error',
          );
        }
      });
  };

  onSubmitAndContinue = () => this.onSubmitWithouContinue(false);

  onSubmitWithouContinue = (close = true) => {
    const payload: any = {};
    payload.callback = this.context.flux.getActions('repair').programVersionPut;
    payload.outFormState = { ...this.state.formState };

    this.props.defSendFromState(payload).then(async () => {
      if (close) {
        return this.props.handleHide();
      }
      return this.updateVersionList({ id: this.props.element.id });
    });
  };

  onSubmitFiles = (fileState) => {
    const payload: any = {};
    payload.callback = this.context.flux.getActions(
      'repair',
    ).programVersionPutOnlyFiles;
    payload.outFormState = { ...fileState };

    return this.props.defSendFromState(payload).then((ans) => {
      this.updateVersionList({ id: this.props.element.id });
      return ans;
    });
  };

  applyVersion = () => {
    const payload: any = {};
    payload.callback = this.context.flux.getActions(
      'repair',
    ).programVersionSendToApply;
    payload.outFormState = { ...this.state.formState };

    this.props
      .defSendFromState(payload)
      .then(() => {
        global.NOTIFICATION_SYSTEM.notify('Версия согласована', 'success');

        return this.updateVersionList({ id: this.props.element.id });
      })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify('Ошибка согласования версии', 'error');
        }
      });
  };

  canselVersion = () => {
    const payload: any = {};
    payload.callback = this.context.flux.getActions(
      'repair',
    ).programVersionSendToCansel;
    payload.outFormState = { ...this.state.formState };

    this.props
      .defSendFromState(payload)
      .then(() => {
        global.NOTIFICATION_SYSTEM.notify('Версия отменена', 'success');

        return this.updateVersionList({ id: this.props.element.id });
      })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify('Ошибка отмены версии', 'error');
        }
      });
  };

  closeVersion = () => {
    const {
      formState: { percent = 0 },
    } = this.state;

    if (percent < 100) {
      global.NOTIFICATION_SYSTEM.notify(
        'Программа ремонта не выполнена',
        'warning',
      );
      return;
    }

    const payload: any = {};
    payload.callback = this.context.flux.getActions(
      'repair',
    ).programVersionSendToClose;
    payload.outFormState = { ...this.state.formState };

    this.props
      .defSendFromState(payload)
      .then(() => {
        global.NOTIFICATION_SYSTEM.notify('Версия закрыта', 'success');

        return this.updateVersionList({ id: this.props.element.id });
      })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify('Ошибка закрытия версии', 'error');
        }
      });
  };

  handleFormStateChange = (field, e) => {
    const value
      = e !== undefined && e !== null && !!e.target ? e.target.value : e;
    let { formErrors } = this.state;
    const { formState } = this.state;
    const newState: any = {};

    console.info('Form changed', field, value);   // eslint-disable-line
    formState[field] = value;

    formErrors = this.validate(formState, formErrors);

    newState.canSave = Object.values(formErrors).reduce(
      (boolean, oneError) => boolean && !oneError,
      true,
    );

    newState.formState = formState;
    newState.formErrors = formErrors;

    this.setState(newState);

    return newState;
  };

  updateVersionOuter = (payload) => {
    const percentUpdate = get(payload, 'percentUpdate', false);
    return this.updateVersionList({ id: this.props.element.id, percentUpdate });
  };

  render() {
    const { isPermitted = false, entity } = this.props;
    const {
      formState,
      saveButtonEnability = true,
      fromCreating = false,
      versionOptions = [],
      activeVersionId = 0,
      permissionForButton = {},
    } = this.state;

    const { status } = formState;

    const canSave = isPermitted && this.state.canSave && saveButtonEnability;
    const isPermittedByStatus = checkIsPermittedByStatus(status);

    const isPermittetForContractorL = checkIsPermittedByStatusForContractorLine(
      status,
    );

    const isPermittetForObjectFact = checkIsPermittedByStatusForObjectFact(
      status,
    );
    const isPermittedPercentByStatus = isPermittetForObjectFact;

    return (
      <ProgramRegistryForm
        formState={formState}
        formErrors={this.state.formErrors}
        permissions={[`${entity}.update`]}
        entity={entity}
        addPermissionProp
        isPermittedByStatus={isPermittedByStatus}
        isPermittedPercentByStatus={isPermittedPercentByStatus}
        isPermittetForContractorL={isPermittetForContractorL}
        isPermittetForObjectFact={isPermittetForObjectFact}
        canSave={canSave}
        handleFormChange={this.handleFormStateChange}
        show
        onHide={this.props.handleHide}
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
        updateVersionOuter={this.updateVersionOuter}
      />
    );
  }
}

export default compose(
  withSearch,
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    (state) => ({
      userPermissionsSet: getSessionState(state).userData.permissionsSet,
    }),
  ),
  withRequirePermission(),
)(ProgramRegistryFormWrap);
