import * as React from 'react';

import { getSessionState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { VersionContainer } from 'components/new/ui/app_footer/version/styled';
import ModalSwitchApiVersion from 'components/new/ui/modal_switch_api_version/ModalSwitchApiVersion';

type OwnProps = {};
type Props = OwnProps & {};

const VERSION_DESCRIPTION = `Версия ${process.env.VERSION}`;
const countToShowChangeApi = 10;

const Version: React.FC<Props> = React.memo(
  (props) => {
    const [clickOnVersionCount, setClickOnVersionCount] = React.useState(0);
    const appConfig = etsUseSelector((state) => getSessionState(state).appConfig);

    const clickOnVersion = React.useCallback(
      () => {
        const isPermittedSwitchApiVersion = appConfig.can_switch_api_version;

        if (appConfig.project_name === 'ets-dev' || isPermittedSwitchApiVersion) {
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

export default Version;
