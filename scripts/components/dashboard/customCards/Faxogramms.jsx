import React from 'react';
import Div from '../../ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well, Button } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import FaxogrammMissionsFormWrap from '../../directories/faxogramm/FaxogrammMissionsFormWrap.jsx';

export default class Faxogramms extends DashboardCardMedium {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showFaxogrammForm: false,
    });
  }

  action(data) {
    this.props.openFullList(true);
    this.setState({showFaxogrammForm: true, faxogramm: data});
  }

  renderCustomCardData() {
    let selectedItemIndex = this.state.selectedItem;
    let selectedItem = this.props.items[selectedItemIndex] || null;
    let subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    let data = selectedItem !== null ? selectedItem.data || {} : {};

    return (
      <Div>
        <Div style={{marginTop: 10}}>
          <h5>Доп. информация</h5>
          <p>{data.order_info}</p>
        </Div>
        <Div className="text-right">
          <Button className="dashboard-card-action-button" onClick={(e) => {e.preventDefault(); this.action(data);}}>Сформировать задания</Button>
        </Div>
      </Div>
    );
  }

  renderCustomCardForm() {
    return (
      <FaxogrammMissionsFormWrap onFormHide={() => this.setState({showFaxogrammForm: false})}
                               showForm={this.state.showFaxogrammForm}
                               element={this.state.faxogramm}
                               {...this.props}/>
    );
  }

}
