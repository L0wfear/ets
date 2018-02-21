import React, { PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';

import cx from 'classnames';
import { FluxContext, connectToStores } from 'utils/decorators';
import DashboardCardMedium from './DashboardCardMedium.jsx';
import DashboardManagementCard from './DashboardManagementCard.jsx';
import DashboardPageHeader from './DashboardPageHeader.jsx';
import customCards from './customCards/index.js';

@connectToStores(['dashboard', 'loading'])
@autobind
@FluxContext
export default class DashboardPage extends React.Component {

  static get propTypes() {
    return {
      componentsList: PropTypes.arrayOf(PropTypes.object),
      history: PropTypes.any,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      loadingComponents: [],
      itemOpenedKey: null,
    };
  }

  componentDidMount() {
    this.componentsUpdateInterval = setInterval(
      this.refreshComponents.bind(this),
      (1000 * (2 * 60))
    );
    this.currentMissionsUpdateInterval = setInterval(
      this.refreshComponentCurrentMission.bind(this),
      (1000 * 60)
    );

    document.getElementsByTagName('html')[0].classList.add('overflow-scroll');
    this.init();
  }

  componentWillUnmount() {
    clearInterval(this.componentsUpdateInterval);
    clearInterval(this.currentMissionsUpdateInterval);
    Object.values(this.componentsInterval).forEach(clearInterval);
    document.getElementsByTagName('html')[0].classList.remove('overflow-scroll');
  }

  init() {
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozones();
    const actions = flux.getActions('dashboard');
    const components = flux.getStore('dashboard').getComponentsByPermissionsAll();
    this.componentsInterval = {};

    _.each(components, c => actions.getDashboardComponent(c.key));
  }

  refreshComponents() {
    const { flux } = this.context;

    const components = flux.getStore('dashboard').getComponentsByPermissions();
    components.forEach((c) => {
      if (c.key !== this.state.itemOpenedKey) {
        this.componentsInterval[c.key] = setTimeout(this.refreshCard.bind(this, c.key), 2000 * Math.round(Math.random() * 21));
      }
    });
  }

  refreshComponentCurrentMission() {
    const { flux } = this.context;
    const components = flux.getStore('dashboard').getComponentsByPermissions(['current_missions'], []);
    components.forEach(c => c.key !== this.state.itemOpenedKey ? this.refreshCard(c.key) : null);
  }

  refreshCard(key, id, forcedKey) {
    if (key === 'external_applications') return;
    if (typeof forcedKey === 'string' && forcedKey.indexOf('_') > -1) {
      key = forcedKey;
    }
    const { loadingComponents } = this.state;
    if (loadingComponents.indexOf(key) === -1) {
      loadingComponents.push(key);
    }
    this.setState({ loadingComponents });
    this.context.flux.getActions('dashboard').getDashboardComponent(key).then(({ key: dashboardKey }) => {
      const { loadingComponents: dashboardLoadingComponents } = this.state;
      dashboardLoadingComponents.splice(dashboardLoadingComponents.indexOf(dashboardKey), 1);
      setTimeout(() => this.setState({ dashboardLoadingComponents }), 500);
    }).catch(() => {
    });
  }

  openSubitemsList(key, clear) {
    this.setState({ itemOpenedKey: clear ? null : key });
  }
  goToOrders = () => {
    this.props.history.push('/orders');
  }

  render() {
    const { componentsList = [] } = this.props;

    const lists = _(componentsList).chunk(3).value();
    const rows = [];
    lists.forEach((row, i) => {
      rows.push(
        <Row key={i} className="cards-row">
          {row.map((c, j) => {
            const direction = j % 3 === 0 ? 'right' : 'left';
            let hidden = false;
            if (j % 3 === 0) {
              if (row[j + 1] && row[j + 1].key === this.state.itemOpenedKey) {
                hidden = true;
              }
            } else if (j % 3 === 1) {
              if (row[j + 1] && row[j - 1].key === this.state.itemOpenedKey) {
                hidden = true;
              }
            }
            const cardClassname = cx({ 'visibilityHidden': hidden });
            const DashboardCard = customCards[c.key] || DashboardCardMedium;
            return (
              <Col key={j} md={4} className={cardClassname}>
                <DashboardCard
                  title={c.title}
                  title_centralized={c.title_centralized}
                  title_decentralized={c.title_decentralized}
                  items={c.items}
                  items_centralized={c.items_centralized}
                  items_decentralized={c.items_decentralized}
                  meta={c.meta}
                  dashboardKey={c.key}
                  itemsTitle={c.itemsTitle}
                  loading={this.state.loadingComponents.indexOf(c.key) > -1}
                  refreshCard={this.refreshCard.bind(this, c.key, c.id)}
                  openSubitemsList={this.openSubitemsList.bind(this, c.key)}
                  itemOpened={this.state.itemOpenedKey === c.key}
                  direction={direction}
                />
              </Col>
            );
          })}
        </Row>
      );
    });

    return (
      <Div className="ets-page-wrap dashboard-page">
        <DashboardPageHeader />
        <Row>
          <Col md={9}>
            {rows}
          </Col>
          <Col md={3}>
            <DashboardManagementCard
              refreshCard={this.refreshCard}
              goToOrders={this.goToOrders}
            />
          </Col>
        </Row>
      </Div>
    );
  }
}
