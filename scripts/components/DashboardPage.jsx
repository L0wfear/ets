import React from 'react';
import ReactDOM from 'react-dom'
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import Div from './ui/Div.jsx';
import MissionFormWrap from './missions/MissionFormWrap.jsx';
import ElementsList from './ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';


let DashboardCardSmall = ({card}) => {
  let action = () => true;
  let itemActionObject = card.items[0].action;
  if (itemActionObject) {
    action = itemActionObject;
  }
  return (
    <Div className="dashboard-card-sm">
      <Panel header={card.title} bsStyle="success">
        <Div className="pointer" onClick={action}>{card.items[0].title}</Div>
      </Panel>
    </Div>
  );
};

let DashboardItemChevron = (props) => {

  if (props.direction === 'left') {
    return (
      <Div className="card-chevron-left" hidden={props.hidden}>
        <Glyphicon glyph="menu-left"/>
      </Div>
    );
  }

  return (
    <Div className="card-chevron-right" hidden={props.hidden}>
      <Glyphicon glyph="menu-right"/>
    </Div>
  );

}

let DashboardCardHeader = (props) => {
  let iconClassname = cx({'glyphicon-spin': props.loading});
  return (
    <Div>
      <Div className="dashboard-card-title">{props.title}</Div>
      <Div onClick={props.onClick} className="dashboard-card-refresh"><Glyphicon className={iconClassname} glyph="refresh"/></Div>
    </Div>
  );
};

let DashboardPageHeader = (props) => {
  return (
    <Row>
      <Col md={4}>
      </Col>
      <Col md={4}>
        <Div className="dashboard-time" id="dashboard-time">
        </Div>
      </Col>
      <Col md={4}>
        <Div className="dashboard-title">
          {props.personRole}: {props.personFIO}
        </Div>
      </Col>
    </Row>
  );
}

class DashboardCardMedium extends React.Component {

  static contextTypes = {
    flux: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      fullListOpen: false,
      selectedItem: null,
      items: [],
    };
  }

  componentDidMount() {
    let cardWidth = ReactDOM.findDOMNode(this.refs.card).offsetWidth;
    this.setState({cardWidth});
  }

  selectItem(i) {
    this.setState({selectedItem: i});
    this.props.openFullList();
  }

  toggleFullList() {
    this.setState({fullListOpen: !!!this.state.fullListOpen});
  }

  refreshCard() {
    this.props.refreshCard();
  }

  render() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedItem = this.props.items[selectedItemIndex] || null;
    let subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    const items = this.props.items.map((item,i) => {
      return <Div key={i} className="pointer dashboard-card-item" onClick={this.selectItem.bind(this, i)}>
                <Div style={{width: '90%', textAlign: 'left', marginLeft: 'auto', marginRight: 'auto'}}>
                  {item.title}
                </Div>
             </Div>
    });
    let styleObject = {
      width: this.state.cardWidth, marginLeft: this.state.cardWidth + 30
    };
    if (this.props.direction === 'left') {
      styleObject = {
        width: this.state.cardWidth, right: this.state.cardWidth + 44
      };
    }
    let firstItems = items.slice(0, 2);
    let otherItems = items.slice(2, items.length);
    //let dashboardCardClass = cx('dashboard-card', {'visibilityHidden'});
    let Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard.bind(this)}/>

    return (
      <Div md={12}>
        <Panel className="dashboard-card" header={Header} bsStyle="success" ref="card">
          <Div className="dashboard-card-items">
            {firstItems}
            <Collapse in={this.state.fullListOpen}>
              <Div>
                  {otherItems}
              </Div>
            </Collapse>
          </Div>

          <Div className="menu-down-block" hidden={otherItems.length === 0}>
            <hr/>
            <Div style={{textAlign: 'center'}} hidden={this.state.fullListOpen}>
              <Glyphicon glyph="menu-down" className="pointer" onClick={this.toggleFullList.bind(this)}/>
            </Div>
            <Div style={{textAlign: 'center'}} hidden={!this.state.fullListOpen}>
              <Glyphicon glyph="menu-up" className="pointer" onClick={this.toggleFullList.bind(this)}/>
            </Div>
          </Div>

          <Div className="dashboard-card-overlay" hidden={!this.props.loading}></Div>
        </Panel>

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || subItems.length === 0 || !this.props.itemOpened} />

        <Div style={styleObject} hidden={subItems.length === 0} className={cx('dashboard-card-info', {active: selectedItem !== null && this.props.itemOpened})} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <div>
              <Well>
                <Div className="card-glyph-remove" onClick={() => this.setState({selectedItem: null})}>
                  <Glyphicon glyph="remove"/>
                </Div>
                <h5>{selectedItem !== null ? selectedItem.title : ''}</h5>
                <hr/>
                <ul>
                  {subItems.map((item, i) => <li key={i}>{item.title || item}</li>)}
                </ul>
              </Well>
            </div>
          </Fade>
        </Div>

      </Div>
    );
  }

};

class MasterManagementCard extends ElementsList {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
		const { flux } = this.context;
    flux.getActions('objects').getTechOperations();
    flux.getActions('routes').getRoutes();
    flux.getActions('objects').getCars();
    flux.getActions('missions').getMissionSources();
  }

  render() {

    return (
      <Div className="dashboard-card-sm" hidden={this.props.hidden}>
        <Panel header={'Управление'} bsStyle="success">
          <Button onClick={this.showForm.bind(this)}><Glyphicon glyph="plus"/> Создать задание</Button>
        </Panel>
        <MissionFormWrap onFormHide={this.onFormHide.bind(this)}
                         showForm={this.state.showForm}
                         element={this.state.selectedElement}/>
      </Div>
    );

  }

}

class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      time: '',
      loadingComponents: [],
      itemOpenedKey: null,
    };

  }

  init(role) {
    this.context.flux.getActions('dashboard').getDashboardComponent(role, 'current_missions', 1);
    this.context.flux.getActions('dashboard').getDashboardComponent(role, 'future_missions', 2);
    this.context.flux.getActions('dashboard').getDashboardComponent(role, 'car_in_work_on_current_missions', 7);
    this.context.flux.getActions('dashboard').getDashboardComponent(role, 'count_offline_cars', 6);
    this.context.flux.getActions('dashboard').getDashboardComponent(role, 'count_traveled_routes_by_current_operations', 3);
    if (role === 'master' || role === 'superuser') {
      this.context.flux.getActions('dashboard').getDashboardSideComponent(role, 'car_in_work', 8);
      this.context.flux.getActions('dashboard').getDashboardComponent(role, 'odh_not_covered_by_routes', 5);
      this.context.flux.getActions('dashboard').getDashboardComponent(role, 'odh_not_covered_by_current_missions', 4);
      this.context.flux.getActions('dashboard').getDashboardSideComponent(role, 'count_waybill_closed', 10);
      this.context.flux.getActions('dashboard').getDashboardComponent(role, 'estimated_time', 13);
    } else if (role === 'dispatcher' || role === 'superuser') {
      this.context.flux.getActions('dashboard').getDashboardComponent(role, 'count_closed_waybill_by_current_operations', 18);
      this.context.flux.getActions('dashboard').getDashboardComponent(role, 'estimated_time', 13);
      this.context.flux.getActions('dashboard').getDashboardComponent(role, 'count_assigned_routes', 15);
      this.context.flux.getActions('dashboard').getDashboardSideComponent(role, 'released_waybill', 16);
    }
  }

  componentDidMount() {
    let role = this.context.flux.getStore('session').getCurrentUser().role;
    this.updateClock();
    this.timeInterval = setInterval(this.updateClock.bind(this), 1000);
    document.getElementsByTagName('html')[0].classList.add('overflow-scroll');
    this.init(role);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    document.getElementsByTagName('html')[0].classList.remove('overflow-scroll');
  }

  updateClock() {
    let time = moment().format('HH:mm:ss');
    document.getElementById('dashboard-time').innerHTML = time;
  }

  refreshCard(key, id) {
    let role = this.context.flux.getStore('session').getCurrentUser().role;
    let { loadingComponents } = this.state;
    loadingComponents.push(key);
    this.setState({loadingComponents});
    this.context.flux.getActions('dashboard').getDashboardComponent(role, key, id).then(() => {
      let { loadingComponents } = this.state;
      loadingComponents.splice(_.findIndex(loadingComponents, key), 1);
      setTimeout(() => this.setState({loadingComponents}), 500);
    });
  }

  openFullList(key) {
    this.setState({itemOpenedKey: key});
  }

  render() {

    let cards = [];
    let role = this.context.flux.getStore('session').getCurrentUser().role;
    let propsByRole = this.props[role] || {};
    const { componentsList = [], componentsSideList = [] } = propsByRole;
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
    let lists = _(componentsList).groupBy((el, i) => Math.floor(i/3)).toArray().value();
    let rows = [];
    lists.map((row, i) => {
      rows.push(
        <Row key={i} className="cards-row">
          {row.map((c, j) => {
            return <Col key={j} md={4}>
              <DashboardCardMedium title={c.title}
                                   items={c.items}
                                   loading={this.state.loadingComponents.indexOf(c.key) > -1}
                                   refreshCard={this.refreshCard.bind(this, c.key, c.id)}
                                   openFullList={this.openFullList.bind(this, c.key)}
                                   itemOpened={this.state.itemOpenedKey === c.key}
                                   direction={j % 3 === 0 ? 'right' : 'left'} />
            </Col>
          })}
        </Row>
      )
    });

    let componentsSide = componentsSideList.map((c, i) => <DashboardCardSmall key={i} card={c}/>);

    return (
      <Div className="ets-page-wrap dashboard-page">

        <DashboardPageHeader personRole={role === 'master' || role === 'superuser' ? 'Мастер' : 'Диспетчер'} personFIO={role === 'master' || role === 'superuser' ? 'Лебедев И.А.' : 'Иванов К.М.'} />

        <Row>
          <Col md={10}>
            {rows}
          </Col>

          <Col md={2}>
            <MasterManagementCard/>

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
