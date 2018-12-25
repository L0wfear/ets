import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import { ExtField } from 'components/ui/new/field/ExtField';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import Button from 'react-bootstrap/lib/Button';

const modalKey = 'ModalSwitchApiVersion';

class ModalSwitchApiVersion extends React.PureComponent<{ onHide: () => void, appConfig: InitialStateSession['appConfig']  }, {}> {
  state = {
    value: localStorage.getItem(global.API__KEY2),
    appConfig: this.props.appConfig,
    options: [
      {
        value: -1,
        label: 'Без версии',
      },
      ...this.props.appConfig.api_versions.map((version) => ({
        value: version,
        label: version,
      })),
    ],
  };

  static getDerivedStateFromProps({ appConfig }, state) {
    if (state.appConfig !== appConfig) {
      return {
        options: [
          {
            value: -1,
            label: 'Без версии',
          },
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

  handleChange = (value) => {
    localStorage.setItem(global.API__KEY2, value === -1 ? '' : value);
    this.setState({
      value,
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

export default connect<any, any, any, ReduxState>(
  (state) => ({
    appConfig: state.session.appConfig,
  }),
)(ModalSwitchApiVersion);
