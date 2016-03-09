import React from 'react';
import ReactDOM from 'react-dom';
import Div from '../ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import { FluxContext } from '../decorators/index.js';
import DashboardCardHeader from './DashboardCardHeader.jsx';
import DashboardItemChevron from './DashboardItemChevron.jsx';
import cx from 'classnames';
import {getFormattedDateTimeSeconds} from '../../utils/dates.js';

let getDataTraveledYet = (data) => {
  if (typeof data === 'string') {
    return data;
  }
  return parseInt(data, 10);
}

@FluxContext
export default class DashboardCardMedium extends React.Component {

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
    let item = this.props.items[i];
    if ((item && item.subItems && item.subItems.length) || i === null || (item && item.data && item.data.mission_name)) {
      this.setState({selectedItem: i});
      this.props.openFullList(i === null);
    }
  }

  toggleFullList() {
    this.setState({fullListOpen: !!!this.state.fullListOpen});
  }

  refreshCard() {
    this.props.refreshCard();
  }

  async completeMission(id) {
		let mission = await this.context.flux.getActions('missions').getMissionById(id);
        mission = mission.result[0];
    console.log(mission);
		mission.status = 'complete';
		await this.context.flux.getActions('missions').updateMission(mission);
    this.selectItem(null);
    this.props.refreshCard();
	}

  render() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedItem = this.props.items[selectedItemIndex] || null;
    let subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    let data = selectedItem !== null ? selectedItem.data || {} : {};
    const items = this.props.items.map((item,i) => {
      let itemClassName = cx('dashboard-card-item', {'pointer': (item.data && item.data.mission_name) || (item.subItems && item.subItems.length)});
      return <Div key={i} className={itemClassName} onClick={this.selectItem.bind(this, i)}>
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
    let Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard.bind(this)}/>;
    let action = () => true;
    let itemAction = selectedItem !== null ? selectedItem.action : null;
    if (itemAction) {
      action = itemAction.bind(null, selectedItem.data || {});
    }

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

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || (subItems.length === 0 && !data.mission_name) || !this.props.itemOpened} />

        <Div style={styleObject} hidden={subItems.length === 0 && !data.mission_name} className={cx('dashboard-card-info', {active: selectedItem !== null && this.props.itemOpened})} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <div>
              <Well>
                <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, null)}>
                  <Glyphicon glyph="remove"/>
                </Div>
                <h5>{this.props.itemsTitle ? this.props.itemsTitle : selectedItem !== null ? selectedItem.title : ''}</h5>
                <hr/>
                <ul>
                  {subItems.map((item, i) => {
                    return <li key={i}>{item.title || item}</li>
                  })}
                  <Div style={{marginTop: 20}} hidden={this.props.dashboardKey !== 'faxogramms'}>
                    <h5>Доп. информация</h5>
                    <p>{data.order_info}</p>
                  </Div>
                  <Div hidden={this.props.dashboardKey !== 'faxogramms'} className="text-right">
                    <Button className="dashboard-card-action-button" onClick={(e) => {e.preventDefault(); action();}}>Сформировать задания</Button>
                  </Div>
                </ul>
                <Div hidden={!data || (data && !data.mission_name)}>
                  <ul>
                    <li><b>Задание:</b> {data.mission_name}</li>
                    <li><b>Тех. операция:</b> {data.technical_operation_name}</li>
                    <li><b>Водитель:</b> {data.driver_fio}</li>
                    <li><b>Гос. номер ТС:</b> {data.car_gov_number}</li>
                    <li><b>Начало задания:</b> {getFormattedDateTimeSeconds(data.mission_date_start)}</li>
                    <li><b>Окончание задания:</b> {getFormattedDateTimeSeconds(data.mission_date_end)}</li>
                    <li><b>Расчетное время выполнения:</b> {getFormattedDateTimeSeconds(data.estimated_finish_time || null)}</li>
                    <li><b>Пройдено:</b> {getDataTraveledYet(data.traveled_yet)}</li>
                    <li><a className="pointer" onClick={(e) => {e.preventDefault(); action();}}>Подробнее...</a></li>
                    <Div className="text-right">
                      <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, data.mission_id)}>Завершить</Button>
                    </Div>
                  </ul>
                </Div>
              </Well>
            </div>
          </Fade>
        </Div>

      </Div>
    );
  }

};
