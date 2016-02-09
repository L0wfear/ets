import React from 'react';
import ReactDOM from 'react-dom'
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import Div from './ui/Div.jsx';
import SDiv from './ui/SDiv.jsx';
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
        <Glyphicon glyph="chevron-left"/>
      </Div>
    );
  }

  return (
    <Div className="card-chevron-right" hidden={props.hidden}>
      <Glyphicon glyph="chevron-right"/>
    </Div>
  );

}

class DashboardCardMedium extends React.Component {

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
    this.setState({selectedItem: this.state.selectedItem === i ? null : i});
  }

  toggleFullList() {
    this.setState({fullListOpen: !!!this.state.fullListOpen});
  }

  render() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedItem = this.props.items[selectedItemIndex] || null;
    let subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    const items = this.props.items.map((item,i) => {
      return <Div key={i} className="pointer" onClick={this.selectItem.bind(this, i)}>
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

    return (
      <Div md={12}>
        <Panel className="dashboard-card" header={this.props.header} bsStyle="success" ref="card">
          <Div>
            {firstItems}
            <Collapse in={this.state.fullListOpen}>
              <Div>
                  {otherItems}
              </Div>
            </Collapse>
          </Div>

          <Div hidden={otherItems.length === 0}>
            <hr/>
            <Div style={{textAlign: 'center'}} hidden={this.state.fullListOpen}>
              <Glyphicon glyph="menu-down" className="pointer" onClick={this.toggleFullList.bind(this)}/>
            </Div>
            <Div style={{textAlign: 'center'}} hidden={!this.state.fullListOpen}>
              <Glyphicon glyph="menu-up" className="pointer" onClick={this.toggleFullList.bind(this)}/>
            </Div>
          </Div>
        </Panel>

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || subItems.length === 0} />

        <Div style={styleObject} hidden={subItems.length === 0} className={cx('dashboard-card-info', {active: selectedItem !== null})} >
          <Fade in={selectedItem !== null}>
            <div>
              <Well>
                <Div className="card-glyph-remove" onClick={() => this.setState({selectedItem: null})}>
                  <Glyphicon glyph="remove"/>
                </Div>
                <h4>{selectedItem !== null ? selectedItem.title : ''}</h4>
                <ul>
                  {subItems.map((item, i) => <li key={i}>{item.title}</li>)}
                </ul>
              </Well>
            </div>
          </Fade>
        </Div>
      </Div>
    );
  }

};

let DashboardHeader = (props) => {
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

class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      time: '',
    };

  }

  init(role = this.props.params.role) {
    this.context.flux.getActions('dashboard').getDashboardComponent(role, 'current_missions', 1);
    this.context.flux.getActions('dashboard').getDashboardComponent(role, 'future_missions', 2);
    if (role === 'master') {
      this.context.flux.getActions('dashboard').getDashboardSideComponent(role, 'car_in_work', 8);
      this.context.flux.getActions('dashboard').getDashboardSideComponent(role, 'count_waybill_closed', 10);
    } else {
      this.context.flux.getActions('dashboard').getDashboardSideComponent(role, 'released_waybill', 16);
    }
  }

  componentDidMount() {
    this.updateClock();
    this.timeInterval = setInterval(this.updateClock.bind(this), 1000);
    document.getElementsByTagName('html')[0].classList.add('overflow-scroll');
    this.init();
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    document.getElementsByTagName('html')[0].classList.remove('overflow-scroll');
  }

  componentWillReceiveProps(props) {
    if (props.params.role !== this.props.params.role) {
      this.init(props.params.role);
    }
  }

  updateClock() {
    let time = moment().format('HH:mm:ss');
    document.getElementById('dashboard-time').innerHTML = time;
  }

  render() {

    let cards = [];
    let { role } = this.props.params;
    const { componentsList = [], componentsSideList = [] } = this.props[role];
    componentsSideList.map(c => {
      if (c.key === 'released_waybill') {
        c.items[0].action = () => this.context.history.pushState(null, '/waybill-journal?status=active')
      }
      if (c.key === 'count_waybill_closed') {
        c.items[0].action = () => this.context.history.pushState(null, '/waybill-journal?status=closed')
      }
    });
    let lists = _(componentsList).groupBy((el, i) => Math.floor(i/3)).toArray().value();
    let rows = [];
    lists.map((row, i) => {
      rows.push(
        <Row key={i} className="cards-row">
          {row.map((c, j) => {
            return <Col key={j} md={4}>
              <DashboardCardMedium header={c.title} items={c.items} direction={j % 3 === 0 ? 'rigth' : 'left'}/>
            </Col>
          })}
        </Row>
      )
    });

    let componentsSide = componentsSideList.map((c, i) => <DashboardCardSmall key={i} card={c}/>);

    return (
      <Div className="ets-page-wrap dashboard-page">

        <DashboardHeader personRole={role === 'master' ? 'Мастер' : 'Диспетчер'} personFIO={role === 'master' ? 'Лебедев И.А.' : 'Иванов К.М.'} />

        <Row>
          <Col md={10}>
            {rows}
          </Col>

          <Col md={2}>
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

export default connectToStores(DashboardPage, ['dashboard']);
