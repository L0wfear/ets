import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';

import LoadingOverlay from 'components/ui/LoadingOverlay.jsx';
import ModalTP from 'components/modalTP/ModalTP.tsx';
import Routes from 'components/indexRoute.tsx';
import { connectToStores, FluxContext } from 'utils/decorators';

import NotifiactionOrders from 'components/modal_notification/NotifiactionOrders.tsx';

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
      currentUser: {
        structure_name = '',
        company_name,
      },
    } = this.props;

    return (
      <div className="app">
        <div className="app-navigation"><Header /></div>

        <div className="app-content">
          <ModalTP
            show={this.state.showFormTp}
            onHide={this.hideFormTp}
          />
          <Routes />
          <LoadingOverlay main />
          <NotifiactionOrders />
        </div>

        <div className="app-footer">
          <Col md={3}>
            <Div hidden={this.state.needShowHrefOnNewProd}>
              <Col md={12}>
                <a className="tp" onClick={this.showFormTp}>Техническая поддержка</a>
              </Col>
            </Div>
            <Div hidden={!this.state.needShowHrefOnNewProd}>
              <Col md={6}>
                <a className="tp" onClick={this.showFormTp}>Техническая поддержка</a>
              </Col>
            </Div>
          </Col>
          <Col md={6}>
            <span>{`${company_name ? company_name : ''} ${structure_name ? structure_name : ''}`}</span>
          </Col>
          <Col md={3}>
            <span style={{ position: 'absolute', right: 20 }}>
              {VERSION_DESCRIPTION}
            </span>
          </Col>
        </div>
      </div>
    );
  }
}


export default MainApp;
