import * as React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';

import { ExtField } from 'components/ui/new/field/ExtField';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import memoize from 'memoize-one';
import {
  StatePropsModalSwitchApiVersion,
  DispatchPropsModalSwitchApiVersion,
  OwnPropsModalSwitchApiVersion,
  PropsModalSwitchApiVersion,
  StateModalSwitchApiVersion,
  OneOptionInStateModalSwitchApiVersion,
} from 'components/new/ui/modal_switch_api_version/ModalSwitchApiVersion.h';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import config from 'config';
import { getSessionState } from 'redux-main/reducers/selectors';

const modalKey = 'ModalSwitchApiVersion';
const defaultNonVersionoption = {
  value: -1,
  label: 'Без версии',
};

const keyTracksCachingForTest = `TEST::${config.tracksCaching}`;

class ModalSwitchApiVersion extends React.PureComponent<PropsModalSwitchApiVersion, StateModalSwitchApiVersion> {
  state = {
    serviceValue: get(
      JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'),
      [config.backend],
      null,
    ),
    tracksCachingValue:
      get(
        JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'),
        [keyTracksCachingForTest],
        null,
      ) ||
      get(
        JSON.parse(localStorage.getItem(global.API__KEY2) || '{}'),
        [config.tracksCaching],
        null,
      ),
  };

  refresh = () => {
    global.window.location.reload();
  };

  handleChangeService = (
    serviceValue: OneOptionInStateModalSwitchApiVersion['value'],
  ) => {
    let versions = JSON.parse(localStorage.getItem(global.API__KEY2) || '{}');

    if (!versions) {
      versions = {};
    }
    versions[config.backend] =
      serviceValue === -1 || !serviceValue ? '' : serviceValue.toString();
    localStorage.setItem(global.API__KEY2, JSON.stringify(versions));
    this.setState({
      serviceValue: serviceValue === -1 || !serviceValue ? '' : serviceValue,
    });
  };

  handleChangeTracksCaching = (
    tracksCachingValue: OneOptionInStateModalSwitchApiVersion['value'],
  ) => {
    let versions = JSON.parse(localStorage.getItem(global.API__KEY2) || '{}');

    if (!versions) {
      versions = {};
    }
    versions[keyTracksCachingForTest] =
      tracksCachingValue === -1 ? '' : tracksCachingValue.toString();
    localStorage.setItem(global.API__KEY2, JSON.stringify(versions));
    this.setState({
      tracksCachingValue: tracksCachingValue === -1 ? '' : tracksCachingValue,
    });
  };

  makeOptionsFromAppConfigApiVersions = memoize(
    (api_versions: InitialStateSession['appConfig']['api_versions']) => [
      defaultNonVersionoption,
      ...api_versions.map((version) => ({
        value: version.toString(),
        label: version,
      })),
    ],
  );

  makeOptionsFromAppTracksCachingConfigApiVersions = memoize(
    (
      api_versions: InitialStateSession['appConfigTracksCaching']['api_versions'],
      api_version_stable: InitialStateSession['appConfigTracksCaching']['api_version_stable'],
    ) =>
      api_versions.map((version) => ({
        value: version.toString(),
        label: `${version}${
          version === api_version_stable ? ' (стабильная)' : ''
        }`,
      })),
  );

  render() {
    const {
      appConfig: { api_versions },
      appConfigTracksCaching: {
        api_versions: tracks_api_versions,
        api_version_stable,
      },
    } = this.props;

    const apiVersionsOptions = this.makeOptionsFromAppConfigApiVersions(
      api_versions,
    );

    const apiTracksCachingVersionsOptions = this.makeOptionsFromAppTracksCachingConfigApiVersions(
      tracks_api_versions,
      api_version_stable,
    );

    return (
      <Modal
        id="modal-battery-brand"
        show
        onHide={this.props.onHide}
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Изменить версию API</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader
          page={modalKey}
          path="none"
          typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                id="version_api"
                type="select"
                label="Версия API"
                options={apiVersionsOptions}
                value={this.state.serviceValue || -1}
                onChange={this.handleChangeService}
                clearable={false}
                modalKey={modalKey}
                emptyValue={null}
              />
            </Col>
            <Col md={12}>
              <ExtField
                id="version_api"
                type="select"
                label="Версия API tracks-caching"
                options={apiTracksCachingVersionsOptions}
                value={this.state.tracksCachingValue || -1}
                onChange={this.handleChangeTracksCaching}
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

export default connect<
  StatePropsModalSwitchApiVersion,
  DispatchPropsModalSwitchApiVersion,
  OwnPropsModalSwitchApiVersion,
  ReduxState
>((state) => ({
  appConfig: getSessionState(state).appConfig,
  appConfigTracksCaching: getSessionState(state).appConfigTracksCaching,
}))(ModalSwitchApiVersion);
