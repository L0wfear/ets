import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';

import LoadingOverlay from 'components/ui/LoadingOverlay.jsx';
import ModalTP from 'components/modalTP/ModalTP.tsx';
import Routes from 'components/indexRoute.tsx';
import { connectToStores, FluxContext } from 'utils/decorators';

import NotifiactionOrders from 'components/modal_notification/NotifiactionOrders.tsx';
import AdmNotification from 'components/adm-notification/AdmNotification';
import UserNotificationWs from 'components/notifications/UserNotificationWs';

import Header from 'components/navbar/Header';

let VERSION_DESCRIPTION;
try {
  const VERSION = process.env.VERSION;
  VERSION_DESCRIPTION = `Версия ${VERSION}`;
} catch (e) {
  VERSION_DESCRIPTION = '';
}

@connectToStores(['session'])
@FluxContext
class MainApp extends React.Component {

  static get propTypes() {
    return {
      currentUser: PropTypes.object,
    };
  }

  constructor() {
    super();

    this.state = {
      showFormTp: false,
    };
  }

  logout = () => this.context.flux.getActions('session').logout();

  hideFormTp = () => this.setState({ showFormTp: false });
  showFormTp = () => this.setState({ showFormTp: true });

  render() {
    const {
      currentUser,
    } = this.props;

    const company_name = currentUser.company_name || '';
    const structure_name = currentUser.structure_name || '';

    return (
      <div className="app">
        <div className="app-navigation">
          <Header />
        </div>

        <div className="app-content">
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

        <div className="app-footer">
          <div className="container-tp">
            <a className="tp" onClick={this.showFormTp}>Техническая поддержка</a>
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
