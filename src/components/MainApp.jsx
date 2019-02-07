import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';

import LoadingOverlay from 'components/ui/LoadingOverlay';
import ModalTP from 'components/new/ui/modal_tp/ModalTP';
import Routes from 'components/indexRoute';
import { connectToStores, FluxContext } from 'utils/decorators';

import NotifiactionOrders from 'components/new/ui/modal_notification/NotifiactionOrders';
import AdmNotification from 'components/new/ui/adm_notification/AdmNotification';
import UserNotificationWs from 'components/notifications/UserNotificationWs';

import AppHeader from 'components/new/ui/app_header/AppHeader';

import {
  sessionResetData,
  sessionSetData,
} from 'redux-main/reducers/modules/session/actions-session';
import { DivNone } from 'global-styled/global-styled';
import ModalSwitchApiVersion from 'components/new/ui/modal_switch_api_version/ModalSwitchApiVersion';

let VERSION_DESCRIPTION;
try {
  const VERSION = process.env.VERSION;
  VERSION_DESCRIPTION = `Версия ${VERSION}`;
} catch (e) {
  VERSION_DESCRIPTION = '';
}

const countToShowChangeApi = 10;

@connectToStores(['session'])
@connect(
  state => ({
    appConfig: state.session.appConfig,
  }),
  dispatch => ({
    sessionSetData: props => dispatch(sessionSetData(props)),
    sessionResetData: () => dispatch(sessionResetData()),
  }),
)
@FluxContext
class MainApp extends React.Component {
  static get propTypes() {
    return {
      currentUser: PropTypes.object,
      sessionSetData: PropTypes.func,
      sessionResetData: PropTypes.func,
      appConfig: PropTypes.object,
    };
  }

  constructor() {
    super();

    this.state = {
      showFormTp: false,
      clickOnVersionCount: 0,
    };
  }

  componentDidMount() {
    if (this.props.currentUser.user_id) {
      this.props.sessionSetData(this.props);
    } else {
      this.props.sessionResetData();
    }
  }

  componentWillUnmount() {
    this.props.sessionResetData();
  }

  clickOnVersion = () => {
    const project_name = get(this.props, ['appConfig', 'project_name'], '');
    const isPermittedSwitchApiVersion = get(this.props, ['appConfig', 'can_switch_api_version'], false);

    if (project_name === 'ets-dev2' || isPermittedSwitchApiVersion) {
      this.setState((state) => {
        if (state.clickOnVersionCount > 1 && state.clickOnVersionCount < countToShowChangeApi - 1) {
          console.log(`%c Пожалуйста, продолжай (${countToShowChangeApi - state.clickOnVersionCount - 1})`, 'font-size: 18px; background: #222; color: #bada55'); // eslint-disable-line
        }

        return {
          clickOnVersionCount: state.clickOnVersionCount + 1,
        };
      });
    }
  }

  hideFormChangeApiVersion = () => {
    this.setState({
      clickOnVersionCount: 0,
    });
  }

  logout = () => this.context.flux.getActions('session').logout();

  hideFormTp = () => this.setState({ showFormTp: false });

  showFormTp = () => this.setState({ showFormTp: true });

  render() {
    const {
      currentUser,
      appConfig: {
        footer_url,
      },
    } = this.props;

    const company_name = currentUser.company_name || '';
    const structure_name = currentUser.structure_name || '';

    return (
      <>
        <div className="app">
          <AppHeader />
          <div className="app-content">
            <div className="app-content-absolute">
              <ModalTP
                show={this.state.showFormTp}
                onHide={this.hideFormTp}
              />
              <Routes />
              <LoadingOverlay main />
              <NotifiactionOrders />
              <AdmNotification />
              <UserNotificationWs />
            </div>
          </div>

          <div className="app-footer">
            <div className="container-tp">
              <a className="tp" onClick={this.showFormTp}>Техническая поддержка</a>
              {
                footer_url
                  ? (
                    <div className="container-tp">
                      <a className="tp not-red" href={footer_url}>{footer_url}</a>
                    </div>
                  )
                  : (
                    <div className="none"></div>
                  )
              }
            </div>
            <div className="container-company">
              <span>{`${company_name} ${structure_name}`}</span>
            </div>
            <div className="container-version" onClick={this.clickOnVersion}>
              <span>
                {VERSION_DESCRIPTION}
              </span>
            </div>
          </div>
        </div>
        {
          this.state.clickOnVersionCount >= countToShowChangeApi
            ? (
              <ModalSwitchApiVersion
                onHide={this.hideFormChangeApiVersion}
              />
            )
            : (
              <DivNone />
            )
        }
      </>
    );
  }
}


export default MainApp;
