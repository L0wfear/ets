import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';

export default class OdhNotCoveredByRoutes extends DashboardCardMedium {

  static contextTypes = {
    history: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  action(technical_operation_id) {
    console.log(technical_operation_id);
    this.context.history.pushState(null, `/routes-list/?technical_operation_id=${technical_operation_id}`);
  }

  renderCustomCardData() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedItem = this.props.items[selectedItemIndex] || {};
    let technical_operation_id = selectedItem.technical_operation_id;
    return (
      <Div>
        <Div className="text-right">
          <Button className="dashboard-card-action-button" onClick={(e) => {e.preventDefault(); this.action(technical_operation_id);}}>Перейти к маршрутам</Button>
        </Div>
      </Div>
    );
  }

}
