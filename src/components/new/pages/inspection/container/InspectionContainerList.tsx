import * as React from 'react';
import { DivNone } from 'global-styled/global-styled';

import IAVisibleWarning from '../autobase/components/vsible_warning/IAVisibleWarning';
import { inspectContainerSchema } from './filed_to_check/inspect_autobase_schema';
import { filedToCheckContainerFirst, filedToCheckContainerSecond } from './filed_to_check/filedToCheck';
import inspectContainerPermissions from './_config_data/permissions';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { getDefaultInspectContainerElement } from './utils';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { OwnInspectContainerProps, DispatchPropsInspectContainer, StatePropsInspectContainer, PropsInspectContainerWithForm, PropsInspectContainerForm } from './@types/InspectionContainerList';
import { ReduxState } from 'redux-main/@types/state';
import IAVisibleWarningContainer from './filed_to_check/IAVisibleWarningContainer';
import InspectContainerRegistry from './registry/InspectContainerRegistry';
import EtsModal from 'components/new/ui/modal/Modal';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import inspectContainerActions from 'redux-main/reducers/modules/inspect/container/container_actions';

class InspectionContainerList extends React.Component<PropsInspectContainerForm> {
  addToActionRow = (action) => {
    // можно открывать форму
    this.props.handleChange({
      actions: [
        ...this.props.formState.actions,
        action,
      ],
    });
  }

  removeActionByIndex = (removeIndex: number) => {
    this.props.handleChange({
      actions: this.props.formState.actions.filter((_, index) => index !== removeIndex),
    });
  }

  handleChangeData = (data) => {
    this.props.handleChange({
      data,
    });
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page, path,
    } = this.props;

    const isPermitted = true;

    return (
      <EtsModal
        id="modal-inspect_container-mission"
        show
        onHide={this.props.hideWithoutChanges}
        bsSize="large"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Карточка емкости</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <IAVisibleWarningContainer
                onChange={this.props.handleChange}
                data={state}
                errors={errors}
                isPermitted={isPermitted}
                filedToCheck={filedToCheckContainerFirst}
              />
              <br/>
              <IAVisibleWarning
                onChange={this.handleChangeData}
                data={state.data}
                isPermitted={isPermitted}
                filedToCheck={filedToCheckContainerSecond}
              />
              <br/>
              <Row>
                <InspectContainerRegistry
                  actions={state.actions}
                  page={this.props.page}
                  path={this.props.path}
                  addToActionRow={this.addToActionRow}
                  removeActionByIndex={this.removeActionByIndex}
                />
              </Row>
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          {isPermitted ? ( // либо обновление, либо создание
            <div>
              <Button
                disabled={!this.props.canSave}
                onClick={this.props.defaultSubmit}>
                Сохранить
              </Button>
            </div>
          ) : (
            <DivNone />
          )}
          <Button onClick={this.props.hideWithoutChanges}>Отмена</Button>
        </Modal.Footer>
      </EtsModal>
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
    permissions: inspectContainerPermissions,
  }),
)(InspectionContainerList);
