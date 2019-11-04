import * as React from 'react';

import { inspectContainerSchema } from './filed_to_check/container_schema';
import { filedToCheckContainerFirst, filedToCheckContainerSecond } from './filed_to_check/filedToCheck';
import inspectPgmBasePermissions from '../pgm_base/_config_data/permissions';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { getDefaultInspectContainerElement } from './utils';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { OwnInspectContainerProps, DispatchPropsInspectContainer, StatePropsInspectContainer, PropsInspectContainerWithForm, PropsInspectContainerForm } from './@types/InspectionContainerList';
import { ReduxState } from 'redux-main/@types/state';
import IAVisibleWarningContainer from './filed_to_check/IAVisibleWarningContainer';
import InspectContainerRegistry from './registry/InspectContainerRegistry';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import inspectContainerActions from 'redux-main/reducers/modules/inspect/container/container_actions';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class InspectionContainerList extends React.Component<PropsInspectContainerForm> {
  addToActionRow = (action) => {
    // можно открывать форму
    this.props.handleChange({
      actions: [
        ...this.props.formState.actions,
        action,
      ],
    });
  };

  removeActionByIndex = (removeIndex: number) => {
    this.props.handleChange({
      actions: this.props.formState.actions.filter((_, index) => index !== removeIndex),
    });
  };

  handleChangeData = (data) => {
    this.props.handleChange({
      data: {
        ...this.props.formState.data,
        ...data,
      },
    });
  };

  render() {
    const {
      formState: state,
      formErrors: errors,
      page, path,
      isPermitted,
      isPermittedChangeListParams,
    } = this.props;

    return (
      <EtsBootstrap.ModalContainer
        id="modal-inspect_container-mission"
        show
        onHide={this.props.hideWithoutChanges}
        bsSize="large"
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Карточка емкости</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <IAVisibleWarningContainer
                onChange={this.props.handleChange}
                data={state}
                errors={errors}
                isPermitted={isPermittedChangeListParams}
                filedToCheck={filedToCheckContainerFirst}
              />
              <br/>
              <IAVisibleWarningContainer
                onChange={this.handleChangeData}
                data={state.data}
                isPermitted={isPermitted}
                filedToCheck={filedToCheckContainerSecond}
              />
              <br/>
              <EtsBootstrap.Row>
                <InspectContainerRegistry
                  actions={state.actions}
                  page={this.props.page}
                  path={this.props.path}
                  addToActionRow={this.addToActionRow}
                  removeActionByIndex={this.removeActionByIndex}
                  isPermitted={isPermittedChangeListParams}
                />
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            Boolean(isPermittedChangeListParams) && ( // либо обновление, либо создание
              <EtsBootstrap.Button
                disabled={!this.props.canSave}
                onClick={this.props.defaultSubmit}>
                Сохранить
              </EtsBootstrap.Button>
            )
          }
          <EtsBootstrap.Button onClick={this.props.hideWithoutChanges}>{Boolean(isPermittedChangeListParams) ? 'Отмена' : 'Закрыть'}</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsInspectContainerForm, OwnInspectContainerProps>(
  connect<StatePropsInspectContainer, DispatchPropsInspectContainer, OwnInspectContainerProps, ReduxState>(
    null,
  ),
  withForm<PropsInspectContainerWithForm, InspectContainer>({
    uniqField: 'id',
    createAction: inspectContainerActions.actionCreateInspectContainer,
    updateAction: inspectContainerActions.actionUpdateInspectContainer,
    mergeElement: ({ element }) => {
      return getDefaultInspectContainerElement(element);
    },
    schema: inspectContainerSchema,
    permissions: inspectPgmBasePermissions,
  }),
)(InspectionContainerList);
