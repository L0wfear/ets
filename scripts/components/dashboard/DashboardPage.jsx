import React from 'react';
import ReactDOM from 'react-dom'
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import ElementsList from 'components/ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import DashboardCardMedium from './DashboardCardMedium.jsx';
import DashboardCardSmall from './DashboardCardSmall.jsx';
import DashboardManagementCard from './DashboardManagementCard.jsx';
import DashboardPageHeader from './DashboardPageHeader.jsx';
import customCards from './customCards/index.js';

class DashboardPage extends React.Component {

  constructor(props, context) {
    super(props);

    this.state = {
      loadingComponents: [],
      itemOpenedKey: null,
      showMissionInfoForm: false,
      showFaxogrammForm: false,
    };

  }

  init() {
    let { flux } = this.context;
    let actions = flux.getActions('dashboard');
    let components = flux.getStore('dashboard').getComponentsByRole();
    _.each(components, c => c.side ? actions.getDashboardSideComponent(c.key) : actions.getDashboardComponent(c.key));
  }

  refreshAll() {
    let { flux } = this.context;
    let components = flux.getStore('dashboard').getComponentsByRole();
    _.each(components.filter(c => !c.side), c => c.key !== this.state.itemOpenedKey ? this.refreshCard(c.key) : null);
  }

  componentDidMount() {
    this.componentsUpdateInterval = setInterval(this.refreshAll.bind(this), 1000 * 60);
    document.getElementsByTagName('html')[0].classList.add('overflow-scroll');
    this.init();
  }

  componentWillUnmount() {
    clearInterval(this.componentsUpdateInterval);
    document.getElementsByTagName('html')[0].classList.remove('overflow-scroll');
  }

  refreshCard(key, id, forcedKey) {
    if (typeof forcedKey === 'string' && forcedKey.indexOf('_') > -1) {
      key = forcedKey;
    }
    let { loadingComponents } = this.state;
    loadingComponents.push(key);
    this.setState({loadingComponents});
    this.context.flux.getActions('dashboard').getDashboardComponent(key).then(() => {
      let { loadingComponents } = this.state;
      loadingComponents.splice(_.findIndex(loadingComponents, key), 1);
      setTimeout(() => this.setState({loadingComponents}), 500);
    });
  }

  openSubitemsList(key, clear) {
    this.setState({itemOpenedKey: clear ? null : key});
  }

  render() {

    let role = this.context.flux.getStore('session').getCurrentUser().role;
    const { componentsList = [], componentsSideList = [] } = this.props;

    let lists = _(componentsList).groupBy((el, i) => Math.floor(i/3)).toArray().value();
    let rows = [];
    lists.map((row, i) => {
      rows.push(
        <Row key={i} className="cards-row">
          {row.map((c, j) => {
            let direction = j % 3 === 0 ? 'right' : 'left';
            let hidden = false;
            if (j % 3 === 0) {
              if (row[j+1] && row[j + 1].key === this.state.itemOpenedKey) {
                hidden = true;
              }
            } else if (j % 3 === 1) {
              if (row[j+1] && row[j - 1].key === this.state.itemOpenedKey) {
                hidden = true;
              }
            }
            let cardClassname = cx({'visibilityHidden': hidden});
            let DashboardCard = customCards[c.key] || DashboardCardMedium;
            return <Col key={j} md={4} className={cardClassname}>
              <DashboardCard title={c.title}
                items={c.items}
                dashboardKey={c.key}
                itemsTitle={c.itemsTitle}
                loading={this.state.loadingComponents.indexOf(c.key) > -1}
                refreshCard={this.refreshCard.bind(this, c.key, c.id)}
                openSubitemsList={this.openSubitemsList.bind(this, c.key)}
                itemOpened={this.state.itemOpenedKey === c.key}
                direction={direction} />
            </Col>
          })}
        </Row>
      )
    });

    let componentsSide = componentsSideList.map((c, i) => <DashboardCardSmall key={i} card={c}/>);

    return (
      <Div className="ets-page-wrap dashboard-page">
        <DashboardPageHeader/>
        <Row>
          <Col md={9}>
            {rows}
          </Col>
          <Col md={3}>
            <DashboardManagementCard role={role} refreshCard={this.refreshCard.bind(this)}/>
            {componentsSide}
          </Col>
        </Row>
      </Div>
    );
  }
}

DashboardPage.contextTypes = {
  history: React.PropTypes.object,
  flux: React.PropTypes.object,
};

export default connectToStores(DashboardPage, ['dashboard', 'loading']);
