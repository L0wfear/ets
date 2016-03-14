import React from 'react';
import ReactDOM from 'react-dom'
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import Div from '../ui/Div.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import DashboardCardMedium from './DashboardCardMedium.jsx';
import DashboardCardSmall from './DashboardCardSmall.jsx';
import DashboardMasterManagementCard from './DashboardMasterManagementCard.jsx';
import MissionInfoFormWrap from './MissionInfoFormWrap.jsx';
import FaxogrammMissionsFormWrap from '../directories/faxogramm/FaxogrammMissionsFormWrap.jsx';

let DashboardPageHeader = (props) => {
  return (
    <Row>
      <Col md={4}>
      </Col>
      <Col md={4}>
        <Div className="dashboard-time" id="dashboard-time"/>
      </Col>
      <Col md={4}>
      </Col>
    </Row>
  );
}

class DashboardPage extends React.Component {

  constructor(props, context) {
    super(props);

    this.state = {
      time: '',
      loadingComponents: [],
      itemOpenedKey: null,
      showMissionInfoForm: false,
      showFaxogrammForm: false,
    };

  }

  init() {
    let { flux } = this.context;
    flux.getActions('objects').getModels();
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
    this.updateClock();
    this.timeInterval = setInterval(this.updateClock.bind(this), 1000);
    this.componentsUpdateInterval = setInterval(this.refreshAll.bind(this), 1000 * 60);
    document.getElementsByTagName('html')[0].classList.add('overflow-scroll');
    this.init();
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearInterval(this.componentsUpdateInterval);
    document.getElementsByTagName('html')[0].classList.remove('overflow-scroll');
  }

  updateClock() {
    let time = moment().format('HH:mm:ss');
    document.getElementById('dashboard-time').innerHTML = time;
  }

  refreshCard(key) {
    let { loadingComponents } = this.state;
    loadingComponents.push(key);
    this.setState({loadingComponents});
    this.context.flux.getActions('dashboard').getDashboardComponent(key).then(() => {
      let { loadingComponents } = this.state;
      loadingComponents.splice(_.findIndex(loadingComponents, key), 1);
      setTimeout(() => this.setState({loadingComponents}), 500);
    });
  }

  openFullList(key, clear) {
    this.setState({itemOpenedKey: clear ? null : key});
  }

  render() {

    let role = this.context.flux.getStore('session').getCurrentUser().role;
    const { componentsList = [], componentsSideList = [] } = this.props;
    componentsSideList.map(c => {
      //переделать этот бред
      let params = '';
      if (c.key === 'released_waybill') {
        if (c.items[0].filter) {
          for (let key in c.items[0].filter) {
            if (params.length > 0) params += '&';
            params += `${key}=${c.items[0].filter[key].join(`&${key}=`)}`;
          }
        }
        c.items[0].action = () => this.context.history.pushState(null, `/waybill-journal?${params}`)
      }
      if (c.key === 'count_waybill_closed') {
        if (!c.items[0].filter) {
          c.items[0].filter = {
            status: ['closed'],
            date_create: [moment().format('YYYY-MM-DD')],
          };
        }
        for (let key in c.items[0].filter) {
          if (params.length > 0) params += '&';
          params += `${key}=${c.items[0].filter[key].join(`&${key}=`)}`;
        }
        c.items[0].action = () => this.context.history.pushState(null, `/waybill-journal?${params}`)
      }

    });

    componentsList.map(c => {
      if (c.key === 'current_missions') {
        c.items.map(item => {
          item.action = (data) => {
            this.setState({showMissionInfoForm: true, itemOpenedKey: null, mission: data});
          }
        });
      }
      if (c.key === 'faxogramms') {
        c.items.map(item => {
          item.action = (data) => {
            this.setState({showFaxogrammForm: true, itemOpenedKey: null, faxogramm: data});
          }
        });
      }
    });

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
            return <Col key={j} md={4} className={cardClassname}>
              <DashboardCardMedium title={c.title}
                                   items={c.items}
                                   dashboardKey={c.key}
                                   itemsTitle={c.itemsTitle}
                                   loading={this.state.loadingComponents.indexOf(c.key) > -1}
                                   refreshCard={this.refreshCard.bind(this, c.key, c.id)}
                                   openFullList={this.openFullList.bind(this, c.key)}
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
          <Col md={10}>
            {rows}
          </Col>

          <Col md={2}>
            <DashboardMasterManagementCard/>

            {componentsSide}
          </Col>
        </Row>

        <MissionInfoFormWrap onFormHide={() => this.setState({showMissionInfoForm: false})}
														 showForm={this.state.showMissionInfoForm}
                             element={this.state.mission}
														 {...this.props}/>
        <FaxogrammMissionsFormWrap onFormHide={() => this.setState({showFaxogrammForm: false})}
  																 showForm={this.state.showFaxogrammForm}
  																 element={this.state.faxogramm}
  																 {...this.props}/>


      </Div>
    );
  }
}

DashboardPage.contextTypes = {
  history: React.PropTypes.object,
  flux: React.PropTypes.object,
};

export default connectToStores(DashboardPage, ['dashboard', 'loading']);
