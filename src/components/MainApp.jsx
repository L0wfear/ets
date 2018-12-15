import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingOverlay from 'components/ui/LoadingOverlay';
import ModalTP from 'components/modalTP/ModalTP';
import Routes from 'components/indexRoute';
import { connectToStores, FluxContext } from 'utils/decorators';

import NotifiactionOrders from 'components/modal_notification/NotifiactionOrders';
import AdmNotification from 'components/adm-notification/AdmNotification';
import UserNotificationWs from 'components/notifications/UserNotificationWs';

import Header from 'components/navbar/Header';
import AppHeader from 'components/app_header/AppHeader';

import {
  sessionResetData,
  sessionSetData,
} from 'redux-main/reducers/modules/session/actions-session';

let VERSION_DESCRIPTION;
try {
  const VERSION = process.env.VERSION;
  VERSION_DESCRIPTION = `Версия ${VERSION}`;
} catch (e) {
  VERSION_DESCRIPTION = '';
}

@connectToStores(['session'])
@connect(
  (state) => ({
    appConfig: state.session.appConfig,
  }),
  (dispatch) => ({
    sessionSetData: (props) => dispatch(sessionSetData(props)),
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
      <div className="app">
        <AppHeader />
        <Header />
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
          <div className="container-version">
            <span>
              {VERSION_DESCRIPTION}
            </span>
          </div>
        </div>
      </div>
    );
  }
}


export default MainApp;
