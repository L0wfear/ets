import * as React from 'react';
import { connect } from 'react-redux';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';

import { ExtField } from 'components/ui/new/field/ExtField';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import {
  StatePropsModalSwitchApiVersion,
  DispatchPropsModalSwitchApiVersion,
  OwnPropsModalSwitchApiVersion,
  PropsModalSwitchApiVersion,
  StateModalSwitchApiVersion,
  OneOptionInStateModalSwitchApiVersion,
} from 'components/modal_switch_api_version/ModalSwitchApiVersion.h';

const modalKey = 'ModalSwitchApiVersion';
const defaultNonVersionoption = {
  value: -1,
  label: 'Без версии',
};

class ModalSwitchApiVersion extends React.PureComponent<PropsModalSwitchApiVersion, StateModalSwitchApiVersion> {
  state = {
    value: localStorage.getItem(global.API__KEY2),
    appConfig: this.props.appConfig,
    options: [
      defaultNonVersionoption,
      ...this.props.appConfig.api_versions.map((version) => ({
        value: version,
        label: version,
      })),
    ],
  };

  static getDerivedStateFromProps({ appConfig }: PropsModalSwitchApiVersion, state: StateModalSwitchApiVersion) {
    if (state.appConfig !== appConfig) {
      return {
        options: [
          defaultNonVersionoption,
          ...appConfig.api_versions.map((version) => ({
            value: version,
            label: version,
          })),
        ],
      };
    }

    return null;
  }

  refresh = () => {
    global.window.location.reload();
  }

  handleChange = (value: OneOptionInStateModalSwitchApiVersion['value']) => {
    localStorage.setItem(global.API__KEY2, value === -1 ? '' : value.toString());
    this.setState({
      value: value === -1 ? '' : value,
    });
  }

  render() {
    return (
      <Modal id="modal-battery-brand" show onHide={this.props.onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Изменить версию API</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={modalKey} path="none" typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                id="version_api"
                type="select"
                label="Версия API"
                options={this.state.options}
                value={this.state.value || -1}
                onChange={this.handleChange}
                clearable={false}
                modalKey={modalKey}
                emptyValue={null}
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          <Button onClick={this.refresh}>Перезагрузить страницу</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect<StatePropsModalSwitchApiVersion, DispatchPropsModalSwitchApiVersion, OwnPropsModalSwitchApiVersion, ReduxState>(
  (state) => ({
    appConfig: state.session.appConfig,
  }),
)(ModalSwitchApiVersion);
