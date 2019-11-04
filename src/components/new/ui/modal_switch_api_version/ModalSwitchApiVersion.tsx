import * as React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import ExtField from 'components/@next/@ui/renderFields/Field';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import memoize from 'memoize-one';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import config from 'config';
import { getSessionState } from 'redux-main/reducers/selectors';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type StateProps = {
  appConfig: InitialStateSession['appConfig'];
  appConfigTracksCaching: InitialStateSession['appConfigTracksCaching'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  onHide: () => void;
};

type NoneVersionOption = {
  value: number | null;
  label: string;
};

type DefaultVersionOption = {
  value: string;
  label: string;
};

type OneOptionInStateModalSwitchApiVersion = NoneVersionOption | DefaultVersionOption;

type StateModalSwitchApiVersion = {
  serviceValue: OneOptionInStateModalSwitchApiVersion['value'];
  tracksCachingValue: OneOptionInStateModalSwitchApiVersion['value'];
};
type PropsModalSwitchApiVersion = (
  StateProps
  & DispatchProps
  & OwnProps
);

const modalKey = 'ModalSwitchApiVersion';
const defaultNonVersionoption = {
  value: -1,
  label: 'Без версии',
};

const keyTracksCachingForTest = `TEST::${config.tracksCaching}`;

class ModalSwitchApiVersion extends React.PureComponent<PropsModalSwitchApiVersion, StateModalSwitchApiVersion> {
  state = {
    serviceValue: get(
      JSON.parse(localStorage.getItem(global.API__KEY) || '{}'),
      [config.backend],
      null,
    ),
    tracksCachingValue:
      get(
        JSON.parse(localStorage.getItem(global.API__KEY) || '{}'),
        [keyTracksCachingForTest],
        null,
      )
      || get(
        JSON.parse(localStorage.getItem(global.API__KEY) || '{}'),
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
    let versions = JSON.parse(localStorage.getItem(global.API__KEY) || '{}');

    if (!versions) {
      versions = {};
    }
    versions[config.backend]
      = serviceValue === -1 || !serviceValue ? '' : serviceValue.toString();
    localStorage.setItem(global.API__KEY, JSON.stringify(versions));
    this.setState({
      serviceValue: serviceValue === -1 || !serviceValue ? '' : serviceValue,
    });
  };

  handleChangeTracksCaching = (
    tracksCachingValue: OneOptionInStateModalSwitchApiVersion['value'],
  ) => {
    let versions = JSON.parse(localStorage.getItem(global.API__KEY) || '{}');

    if (!versions) {
      versions = {};
    }
    versions[keyTracksCachingForTest]
      = tracksCachingValue === -1 ? '' : tracksCachingValue.toString();
    localStorage.setItem(global.API__KEY, JSON.stringify(versions));
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
      <EtsBootstrap.ModalContainer
        id="modal-battery-brand"
        show
        onHide={this.props.onHide}
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Изменить версию API</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader
          page={modalKey}
          path="none"
          typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
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
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
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
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={this.refresh}>Перезагрузить страницу</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>((state) => ({
  appConfig: getSessionState(state).appConfig,
  appConfigTracksCaching: getSessionState(state).appConfigTracksCaching,
}))(ModalSwitchApiVersion);
