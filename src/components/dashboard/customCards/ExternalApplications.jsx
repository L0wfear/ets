import React from 'react';
import { autobind } from 'core-decorators';
import Div from 'components/ui/Div.jsx';
import { Panel as BootstrapPanel, Collapse, Glyphicon, Fade, Well } from 'react-bootstrap';
import cx from 'classnames';
import { wrappedRef } from 'utils/decorators';
// TODO move to HOC
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import DashboardCardHeader from '../DashboardCardHeader.jsx';
import DashboardItemChevron from '../DashboardItemChevron.jsx';

const Panel = wrappedRef(BootstrapPanel);

@autobind
export default class ExternalApplications extends DashboardCardMedium {

  constructor(props, context) {
    super(props, context);

    this.state = Object.assign(this.state, {
      customCardLoading: false,
      selectedMission: {},
    });
  }

  selectItem(i) {
    const item = this.props.items[i];
    if ((item && item.subItems && item.subItems.length) || i === null || (item && item.data)) {
      const { selectedItem } = this.state;
      this.setState({ selectedItem: selectedItem === i ? null : i });
      this.props.openSubitemsList(true);
    }
  }

  selectMission(title) {
    this.setState({ customCardLoading: true });
    // flux.getActions('missions').getMissionData(id).then((res) => {
    //   this.setState({ selectedMission: res.result, customCardLoading: false });
    // });
    this.setState({ selectedMission: { title }, customCardLoading: false });
    this.props.openSubitemsList(this.state.selectedItem === null);
  }

  renderCollapsibleSubitems(item, i) {
    const { subItems = [] } = item;

    return (
      <Collapse in={this.state.selectedItem === i}>
        <Div className={'pointer'}>
          <ul>
            {subItems.map((subItem, key) => <li key={key} onClick={this.selectMission.bind(this, subItem.title)}>{subItem.title || subItem}</li>)}
          </ul>
        </Div>
      </Collapse>
    );
  }

  renderCustomCardData() {
    const { customCardLoading, selectedMission } = this.state;
    if (selectedMission === null) return <div />;
    // const { mission_data, car_data, report_data, route_data,
    //   technical_operation_data, waybill_data } = selectedMission;
    // if (customCardLoading) {
    //   return <Preloader />;
    // }

    // const data = {
    //   ...mission_data,
    //   car_gov_number: car_data.gov_number,
    // };

    return (
      <Div>
        <Div hidden={Object.keys(selectedMission) === 0}>
          <ul>
            {/* <li><b>Задание:</b> {mission_data.name}</li>
              <li><b>Тех. операция:</b> {technical_operation_data.name}</li>
              <li><b>Водитель:</b> {car_data.driver_fio}</li>
              <li><b>Рег. номер ТС:</b> {car_data.gov_number}</li>
              <li><b>Начало задания:</b> {getFormattedDateTimeSeconds(mission_data.date_start)}</li>
              <li><b>Окончание задания:</b> {getFormattedDateTimeSeconds(mission_data.date_end)}</li>
              <li><b>Расчетное время выполнения:</b> {getEstimatedFinishTime(report_data.estimated_finish_time || 'Подсчет')}</li>
              <li><b>Пройдено в рабочем режиме:</b> {getDataTraveledYet([report_data.traveled, report_data.check_unit].join(' '))}</li>
              <li><b>Пройдено с рабочей скоростью:</b> {getDataTraveledYet([report_data.traveled, report_data.check_unit, report_data.time_work_speed].join(' '))}</li>
              <li><b>Пройдено с превышением рабочей скорости:</b> {getDataTraveledYet([report_data.traveled_high_speed, report_data.check_unit, report_data.time_high_speed].join(' '))}</li>
              {this.canView ? <div><a className="pointer" onClick={(e) => { e.preventDefault(); this.missionAction(selectedMission); }}>Подробнее...</a></div> : ''}
              {this.canCompleteOrReject ? <Div className="text-right">
              <Button className="dashboard-card-action-button" onClick={this.completeMission.bind(this, mission_data.id)}>Выполнено</Button>
              <Button className="dashboard-card-action-button" onClick={this.rejectMission.bind(this, mission_data.id)}>Не выполнено</Button>
            </Div> : ''} */}
            <li><b>Дата поступления:</b> 25.12.16</li>
            <li><b>Описание:</b> Проведены земельные работы ----------------------------------------------------</li>
            <li><b>Комментарий:</b> Проведены хорошо ----------------------------------------------------</li>
          </ul>
        </Div>
      </Div>
    );
  }

  render() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || null;
    const subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    const data = selectedItem !== null ? selectedItem.data || {} : {};
    const items = this.props.items.map((item, i) => {
      const itemClassName = cx('dashboard-card-item-inner', { 'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action) });
      const title = item.title;
      return (
        <Div key={i} className="dashboard-card-item">
          <Div className={itemClassName} onClick={this.selectItem.bind(this, i)}>
            {title}
          </Div>
          {typeof this.renderCollapsibleSubitems === 'function' ? this.renderCollapsibleSubitems(item, i) : ''}
        </Div>
      );
    });
    let styleObject = {
      width: this.state.cardWidth, marginLeft: this.state.cardWidth + 30,
    };
    if (this.props.direction === 'left') {
      styleObject = {
        width: this.state.cardWidth, right: this.state.cardWidth + 44,
      };
    }
    if (!this.state.cardWidth) {
      styleObject = {};
    }
    const firstItems = items.slice(0, 2);
    const otherItems = items.slice(2, items.length);
    const Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard} />;

    // отрефакторить

    return (
      <Div md={12}>
        <Panel className="dashboard-card" header={Header} bsStyle="success" wrappedRef={node => (this._card = node)}>
          <Div className="dashboard-card-items">
            {firstItems}
            <Collapse in={this.state.fullListOpen}>
              <Div>
                {otherItems}
              </Div>
            </Collapse>
          </Div>

          <Div className="menu-down-block" hidden={otherItems.length === 0}>
            <Div style={{ textAlign: 'center' }} hidden={this.state.fullListOpen}>
              <Glyphicon glyph="menu-down" className="pointer" onClick={this.toggleFullList} />
            </Div>
            <Div style={{ textAlign: 'center' }} hidden={!this.state.fullListOpen}>
              <Glyphicon glyph="menu-up" className="pointer" onClick={this.toggleFullList} />
            </Div>
          </Div>

          <Div className="dashboard-card-overlay" hidden={!this.props.loading} />
        </Panel>

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || (subItems.length === 0 && !data.mission_name) || !this.props.itemOpened} />

        <Div style={styleObject} hidden={(subItems.length === 0 && !data) || !this.props.itemOpened} className={cx('dashboard-card-info', { active: selectedItem !== null && this.props.itemOpened })} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <Well>
              <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, null)}>
                <Glyphicon glyph="remove" />
              </Div>
              <h5>{this.props.itemsTitle || (selectedItem !== null ? selectedItem.title : '')}</h5>
              <div style={{ marginTop: 15 }} />
              {typeof this.renderCustomCardData === 'function' ? this.renderCustomCardData() : null}
            </Well>
          </Fade>
        </Div>
        {typeof this.renderCustomCardForm === 'function' ? this.renderCustomCardForm() : null}

      </Div>
    );
  }

}
