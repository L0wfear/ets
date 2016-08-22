import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button, Modal } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import DashboardCardHeader from '../DashboardCardHeader.jsx';
import DashboardItemChevron from '../DashboardItemChevron.jsx';
import RouteInfo from 'components/route/RouteInfo.jsx';
import cx from 'classnames';
import { isEmpty } from 'utils/functions';
import { FluxContext } from 'utils/decorators';

@FluxContext
export default class CurrentDutyMissions extends DashboardCardMedium {

  constructor(props, context) {
    super(props, context);

    this.state = Object.assign(this.state, {
      showCurrentDutyMissionForm: false
    });

    this.canView = context.flux.getStore('session').getPermission("duty_mission.read");
    this.canCompleteOrReject = context.flux.getStore('session').getPermission("duty_mission.update");
  }

  async showCurrentDutyMissionForm(data) {
    this.props.openSubitemsList(true);
    let route = await this.context.flux.getActions('routes').getRouteById(data.duty_mission_route_id);
    this.setState({showCurrentDutyMissionForm: true, selectedDutyMission: data, route});
  }

  selectItem(i) {
    let item = this.props.items[i];
    if ((item && item.subItems && item.subItems.length) || i === null || (item && item.data)) {
      let { selectedItem } = this.state;
      this.setState({selectedItem: selectedItem === i ? null : i});
      this.props.openSubitemsList(true);
    }
  }

  selectedDutyMission(i) {
    this.setState({selectedDutyMission: i});
    this.props.openSubitemsList(this.state.selectedItem === null);
  }

  async completeMission(id) {
		let mission = await this.context.flux.getActions('missions').getDutyMissionById(id);
        mission = mission.result[0];
		mission.status = 'complete';
		await this.context.flux.getActions('missions').updateDutyMission(mission);
    this.selectItem(null);
    this.props.refreshCard();
	}

  async rejectMission(id) {
    let reason = prompt('Введите причину', '');
    if (reason) {
      let mission = await this.context.flux.getActions('missions').getDutyMissionById(id);
          mission = mission.result[0];
      mission.status = 'fail';
      mission.comment = reason;
      this.context.flux.getActions('missions').updateDutyMission(mission);
    }
    this.selectItem(null);
    this.props.refreshCard();
	}

  renderSubitems(subItems) {
    return this.renderSelectedMission();
  }

  renderSelectedMission() {

  }

  renderCollapsibleSubitems(item, i) {
    let { subItems = [] } = item;

    return (
      <Collapse in={this.state.selectedItem === i}>
        <Div className={!this.canView ? 'no-pointer-events' : 'pointer'}>
          <ul>
            {subItems.map((item, key) => <li key={key} onClick={this.selectedDutyMission.bind(this, key)}>{item.title || item}</li>)}
          </ul>
        </Div>
      </Collapse>
    );
  }


  renderCustomCardData() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedDutyMissionIndex = this.state.selectedDutyMission;
    if (isEmpty(selectedItemIndex) || isEmpty(selectedDutyMissionIndex)) return <div/>;
    let selectedItem = this.props.items[selectedItemIndex].subItems[selectedDutyMissionIndex] || null;
    let data = selectedItem !== null ? selectedItem.data || {} : {};

    return (
      <Div>
        <Div hidden={!data || (data && !data.technical_operation_name)}>
          <ul>
            <li><b>№ задания:</b> {data.duty_mission_number}</li>
            <li><b>Техоперация:</b> {data.technical_operation_name}</li>
            <li><b>Начало задания (плановое):</b> {data.duty_mission_date_start}</li>
            <li><b>Окончание задания (плановое):</b> {data.duty_mission_date_end}</li>
            <li><b>ФИО бригадира:</b> {data.foreman_fio}</li>
            <li><b>Номер телефона бригадира:</b> {data.foreman_phone}</li>
            {this.canView ? <li><a className="pointer" onClick={(e) => {e.preventDefault(); this.showCurrentDutyMissionForm(data);}}>Показать на карте</a></li> : ''}
            {this.canCompleteOrReject ? <Div className="text-right">
              <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, data.duty_mission_id)}>Выполнено</Button>
              <Button className="dashboard-card-action-button" onClick={this.rejectMission.bind(this, data.duty_mission_id)}>Не выполнено</Button>
            </Div> : ''}
          </ul>
        </Div>
      </Div>
    );
  }

  renderCustomCardForm() {
    if (!this.state.selectedDutyMission || !this.state.route) return (<div></div>)
    return (
      <Modal show={this.state.showCurrentDutyMissionForm} onHide={() => this.setState({showCurrentDutyMissionForm: false})} backdrop="static">

				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-lg">Бригадир {this.state.selectedDutyMission.foreman_fio}</Modal.Title>
				</Modal.Header>

	      <Modal.Body>
          <RouteInfo route={this.state.route} mapOnly={true}/>
	      </Modal.Body>

			</Modal>
    );
  }

  render() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedItem = this.props.items[selectedItemIndex] || null;
    let subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    let data = selectedItem !== null ? selectedItem.data || {} : {};
    const items = this.props.items.map((item,i) => {
      let itemClassName = cx('dashboard-card-item-inner', {'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action)});
      let status = item.title.split("").reverse().join("").split(' ')[0].split("").reverse().join("");
      let title =  item.title.split(status)[0];
      return <Div key={i} className="dashboard-card-item">
        <Div className={itemClassName} onClick={this.selectItem.bind(this, i)}>
          {title}
          <span title='Кол-во заданий в статусе "Назначено" / Общее кол-во заданий на текущую тех.операцию'>
            {status}
          </span>
        </Div>
        {
          typeof this.renderCollapsibleSubitems === 'function' ? this.renderCollapsibleSubitems(item, i) : ''
        }
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
    if (!this.state.cardWidth) {
      styleObject = {};
    }
    let firstItems = items.slice(0, 2);
    let otherItems = items.slice(2, items.length);
    //let dashboardCardClass = cx('dashboard-card', {'visibilityHidden'});
    let Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard.bind(this)}/>;
    // отрефакторить

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

        <Div style={styleObject} hidden={(subItems.length === 0 && !data) || !this.props.itemOpened} className={cx('dashboard-card-info', {active: selectedItem !== null && this.props.itemOpened})} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <div>
              <Well>
                <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, null)}>
                  <Glyphicon glyph="remove"/>
                </Div>
                <h5>{this.props.itemsTitle || (selectedItem !== null ? selectedItem.title : '')}</h5>
                <div style={{marginTop: 15}}/>
                {this.renderSubitems(subItems)}
                {typeof this.renderCustomCardData === 'function' ? this.renderCustomCardData() : null}
              </Well>
            </div>
          </Fade>
        </Div>
        {typeof this.renderCustomCardForm === 'function' ? this.renderCustomCardForm() : null}

      </Div>
    );
  }

}
