import * as React from 'react';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import MissionFormWrap from '../../missions/mission/MissionFormWrap.jsx';
import { Panel as BootstrapPanel, Glyphicon, Fade, Well } from 'react-bootstrap';
import cx from 'classnames';

import Div from 'components/ui/Div.jsx';
import { wrappedRef } from 'utils/decorators';
// TODO move to HOC
import DashboardCardHeader from 'components/dashboard/DashboardCardHeader.jsx';
import DashboardItemChevron from 'components/dashboard/DashboardItemChevron.jsx';

import ItemsCentralized from 'components/dashboard/customCards/FutureMissionItems/ItemsCentralized';
import ItemsDecentralized from 'components/dashboard/customCards/FutureMissionItems/ItemsDecentralized';


const Panel = wrappedRef(BootstrapPanel);

export default class FutureMissions extends DashboardCardMedium {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showMissionForm: false,
      selectedMission: null,
    });
  }

  selectItem = (type, itemIndex) => {
    const canView = this.context.flux.getStore('session').getPermission('mission.read');

    if (canView) {
      this.context.flux
      .getActions('missions')
      .getMissionById(this.props[type][itemIndex].id)
      .then((m) => {
        this.setState({ selectedMission: m.result.rows[0], showMissionForm: true });
      });
    }
  }

  onHideMissionFormWrap = () => this.setState({ showMissionForm: false });

  render() {
    const selectedItemIndex = this.state.selectedItem;
    const selectetdType = this.state.selectetdType;
    const selectedItem = (selectetdType && this.props.items[selectedItemIndex]) || null;
    const subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    const data = selectedItem !== null ? selectedItem.data || {} : {};
    // отрефакторить
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
    const Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard} />;

    return (
      <Div>
        <Panel className="dashboard-card" header={Header} bsStyle="success" wrappedRef={node => (this._card = node)}>
          <Div className="dashboard-card-items">
            <ItemsCentralized
              items={this.props.items_centralized}
              title={this.props.title_centralized}
              selectItem={this.selectItem}
              selectMission={this.selectMission}
              selectedItem={selectetdType === 'items_centralized' ? this.state.selectedItem : null}
            />
            <ItemsDecentralized
              items={this.props.items_decentralized}
              title={this.props.title_decentralized}
              selectItem={this.selectItem}
              selectMission={this.selectMission}
              selectedItem={selectetdType === 'items_decentralized' ? this.state.selectedItem : null}
            />
          </Div>
          <Div className="dashboard-card-overlay" hidden={!this.props.loading} />
        </Panel>
        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || (subItems.length === 0 && !data.mission_name) || !this.props.itemOpened} />

        <Div style={styleObject} hidden={(subItems.length === 0 && !data) || !this.props.itemOpened} className={cx('dashboard-card-info', { active: selectedItem !== null && this.props.itemOpened })} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <Well>
              <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, selectetdType, null)}>
                <Glyphicon glyph="remove" />
              </Div>
              <h5>{this.props.itemsTitle || (selectedItem !== null ? selectedItem.title : '')}</h5>
              <div style={{ marginTop: 15 }} />
            </Well>
          </Fade>
        </Div>
        <MissionFormWrap
          onFormHide={this.onHideMissionFormWrap}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
          fromDashboard
          {...this.props}
        />
      </Div>
    );
  }
}
