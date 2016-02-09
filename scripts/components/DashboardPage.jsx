import React from 'react';
import ReactDOM from 'react-dom'
import { Panel, Row, Col, Button, Fade, Well, Glyphicon, Collapse } from 'react-bootstrap';
import Div from './ui/Div.jsx';
import moment from 'moment';
import cx from 'classnames';

let subItems = [
  {
    title: 'Крылатские холмы',
    action: () => true,
  },
  {
    title: 'Осенняя улица',
    action: () => true,
  },
  {
    title: 'Еще какая-то улица',
    action: () => true,
  },
  {
    title: 'Крылатские холмы ПУ',
    action: () => true,
  },
];

let firstCard = {
  title: 'Текущие задания',
  items: [
    {
      title: 'Подметание'
    },
    {
      title: 'Распределение жидких реагентов'
    }
  ]
}

const cardsList = [
  {
    title: 'ОДХ не назначенные на текущие задания',
    items: [
      {
        title: 'Подметание — 32 ОДХ',
        subItems: [
          {
          title: 'Крылатские холмы',
          action: () => true,
          actionButtonName: 'Посмотреть на карте',
          },
          {
            title: 'Осенняя улица',
            action: () => true,
          },
          {
            title: 'Еще какая-то улица',
            action: () => true,
          },
          {
            title: 'Крылатские холмы ПУ',
            action: () => true,
          },
        ],
      },
      {
        title: 'Распределение жидких реагентов — 11 ОДХ',
        subItems: [],
      }
    ]
  },
  {
    title: 'Количество назначенных маршрутов',
    items: [
      {
        title: 'Подметание — 8',
        subItems: subItems,
      },
      {
        title: 'Распределение жидких реагентов — 9',
        subItems: subItems,
      }
    ]
  },
  {
    title: 'ТС в работе по текущим заданиям',
    items: [
      {
        title: 'Подметание — 6 ед. из 9',
        subItems: subItems,
      },
      {
        title: 'Распределение жидких реагентов — 2 ед. из 7',
        subItems: subItems,
      }
    ]
  },
  {
    title: 'Количество ТС на маршруте, не передающих сигнал',
    items: [
      {
        title: 'Подметание — 2 ед.',
        subItems: subItems,
      },
      {
        title: 'Распределение жидких реагентов — 0 ед.',
        subItems: subItems,
      }
    ]
  }
];

let DashboardCardSmall = ({card}) => {
  let action = () => true;
  let itemActionObject = card.items[0].action;
  if (itemActionObject) {
    action = itemActionObject.action;
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
    let subItems =  selectedItem !== null ? selectedItem.subItems || [] : [];
    const items = this.props.items.map((item,i) => {
      return <Div key={i} className="pointer" onClick={this.selectItem.bind(this, i)}>
                <Div style={{width: '90%', textAlign: 'left', marginLeft: 'auto', marginRight: 'auto'}}>
                  {item.title}
                </Div>
             </Div>
    });
    let styleObject = {
      width: this.state.cardWidth - 25, marginLeft: this.state.cardWidth - 5
    };
    if (this.props.direction === 'left') {
      styleObject = {
        width: this.state.cardWidth - 25, right: this.state.cardWidth + 10
      };
    }

    return (
      <Col md={12} ref="card">
        <Panel className="dashboard-card" header={this.props.header} bsStyle="success">
          <Div>
            {items}
            <Collapse in={this.state.fullListOpen}>
              <Div>
                  {items}
              </Div>
            </Collapse>
          </Div>

          <hr/>
          <Div style={{textAlign: 'center'}} hidden={this.state.fullListOpen}>
            <Glyphicon glyph="menu-down" className="pointer" onClick={this.toggleFullList.bind(this)}/>
          </Div>
          <Div style={{textAlign: 'center'}} hidden={!this.state.fullListOpen}>
            <Glyphicon glyph="menu-up" className="pointer" onClick={this.toggleFullList.bind(this)}/>
          </Div>
        </Panel>

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null} />

        <Div style={styleObject} className={cx('dashboard-card-info', {active: selectedItem !== null})} >
          <Fade in={selectedItem !== null}>
            <div>
              <Well>
                <h4>{selectedItem !== null ? selectedItem.title : ''}</h4>
                <ul>
                  {subItems.map((item, i) => <li key={i}>{item.title}</li>)}
                </ul>
              </Well>
            </div>
          </Fade>
        </Div>
      </Col>
    );
  }

};

class DashboardPage extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      open: [],
      cardsOpen: [],
      time: '',
    };

    this.smallCardsList = [
      {
        title: 'ТС в работе',
        items: [
          {
            title: '46/83',
          }
        ]
      },
      {
        title: 'Кол-во закрытых путевых листов',
        items: [
          {
            title: '12/31',
            action: {
              type: 'url',
              url: '/waybill-journal?status=closed',
              action: () => context.history.pushState(null, '/waybill-journal?status=closed'),
            }
          }
        ]
      }
    ];

  }

  openODH(i) {
    let { open } = this.state;
    if (open.indexOf(i) > -1) {
      open.splice(open.indexOf(i), 1);
    } else {
      open.push(i);
    }
    this.setState({open});
  }

  openCardList(i) {
    let { cardsOpen } = this.state;
    if (cardsOpen.indexOf(i) > -1) {
      cardsOpen.splice(cardsOpen.indexOf(i), 1);
    } else {
      cardsOpen.push(i);
    }
    this.setState({cardsOpen});
  }

  componentDidMount() {
    this.updateClock();
    this.timeInterval = setInterval(this.updateClock.bind(this), 1000);
    document.getElementsByTagName('html')[0].classList.add('overflow-scroll');
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    document.getElementsByTagName('html')[0].classList.remove('overflow-scroll');
  }

  updateClock() {
    let time = moment().format('HH:mm:ss');
    this.setState({time});
  }

  render() {

    let cards = [];
    cardsList.map((c, i) => {
      cards.push(
        <Col key={i} md={4}>
          <Row>
            <DashboardCardMedium header={c.title} items={c.items} direction={i % 3 === 0 ? 'rigth' : 'left'}/>
          </Row>
        </Col>
      );
      if ((i + 1) % 3 === 0) {
        cards.push(<div key={`${i}clearfix`} className="clearfix"></div>);
      }
    })

    return (
      <Div className="ets-page-wrap dashboard-page">
        <Row>
          <Col md={4}>
          </Col>
            <Col md={4}>
              <Div className="dashboard-time">
                {this.state.time}
              </Div>
            </Col>
              <Col md={4}>
                <Div className="dashboard-title">
                  Мастер: Лебедев И.А.
                </Div>
              </Col>
        </Row>
        <Row>
          <Col md={10}>
            <Row>
              {cards}
            </Row>
          </Col>

          <Col md={2}>
            {this.smallCardsList.map((c, i) => {
              return <Row key={i}>
                        <DashboardCardSmall card={c}/>
                      </Row>
            })}
          </Col>

        </Row>
      </Div>
    );
  }
}

DashboardPage.contextTypes = {
  history: React.PropTypes.object,
};

export default DashboardPage;
