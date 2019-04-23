import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import ModalSwitchApiVersion from '../../modal_switch_api_version/ModalSwitchApiVersion';
import { VersionContainer } from './styled';

type VersionStateProps = {
  appConfig: InitialStateSession['appConfig'];
};
type VersionDispatchProps = DispatchProp;
type VersionOwnProps = {};
type VersionMergedProps = (
  VersionStateProps
  & VersionDispatchProps
  & VersionOwnProps
);
type VersionProps = VersionMergedProps;

const VERSION_DESCRIPTION = `Версия ${process.env.VERSION}`;
const countToShowChangeApi = 10;

const Version: React.FC<VersionProps> = React.memo(
  (props) => {
    const [clickOnVersionCount, setClickOnVersionCount] = React.useState(0);
    const {
      appConfig,
    } = props;

    const clickOnVersion = React.useCallback(
      () => {
        const isPermittedSwitchApiVersion = appConfig.can_switch_api_version;

        if (appConfig.project_name === 'ets-dev2' || isPermittedSwitchApiVersion) {
          setClickOnVersionCount(clickOnVersionCount + 1);
        }
      },
      [appConfig, clickOnVersionCount],
    );
    const hideFormChangeApiVersion = React.useCallback(
      () => {
        setClickOnVersionCount(0);
      },
      [],
    );

    return (
      <React.Fragment>
        <VersionContainer onClick={clickOnVersion}>
          <span>{VERSION_DESCRIPTION}</span>
        </VersionContainer>
        {
          clickOnVersionCount >= countToShowChangeApi
            && (
              <ModalSwitchApiVersion onHide={hideFormChangeApiVersion} />
            )
        }
      </React.Fragment>
    );
  },
);

export default connect<VersionStateProps, VersionDispatchProps, VersionOwnProps, ReduxState>(
  (state) => ({
    appConfig: getSessionState(state).appConfig,
  }),
)(Version);
