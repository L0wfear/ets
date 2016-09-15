import React from 'react';
import Div from 'components/ui/Div.jsx';
import { Glyphicon, Button } from 'react-bootstrap';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import FaxogrammMissionsFormWrap from '../../directories/faxogramm/FaxogrammMissionsFormWrap.jsx';
import PDFViewModal from './PDFViewModal.jsx';
import { FluxContext } from 'utils/decorators';

@FluxContext
export default class Faxogramms extends DashboardCardMedium {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showFaxogrammForm: false,
      showPDFViewModal: false,
    });
  }

  showFaxogrammForm(data) {
    this.props.openSubitemsList(true);
    this.setState({ showFaxogrammForm: true, faxogramm: data });
  }

  async showPDFViewModal(data) {
    const url = await this.context.flux.getActions('objects').getFaxogrammPDFUrl(data.id);
    this.setState({ showPDFViewModal: true, url });
  }

  renderCustomCardData() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || null;
    const data = selectedItem !== null ? selectedItem.data || {} : {};

    const canViewPDF = this.context.flux.getStore('session').getPermission('faxogramm.read');
    const canCreateMission = this.context.flux.getStore('session').getPermission('mission.create');

    return (
      <Div>
        <Div style={{ marginTop: 10 }}>
          <h5>Доп. информация</h5>
          <p>{data.order_info}</p>
        </Div>
        <Div className="text-right">
          {canViewPDF ? <Button className="dashboard-card-action-button" onClick={(e) => { e.preventDefault(); this.showPDFViewModal(data); }}><Glyphicon glyph="info-sign" /></Button> : ''}
          {canCreateMission ? <Button className="dashboard-card-action-button" onClick={(e) => { e.preventDefault(); this.showFaxogrammForm(data); }}>Сформировать задания</Button> : ''}
        </Div>
        <PDFViewModal
          url={this.state.url}
          show={this.state.showPDFViewModal}
          onHide={() => this.setState({ showPDFViewModal: false, url: null })}
        />
      </Div>
    );
  }

  renderCustomCardForm() {
    return (
      <FaxogrammMissionsFormWrap
        onFormHide={() => this.setState({ showFaxogrammForm: false })}
        showForm={this.state.showFaxogrammForm}
        element={this.state.faxogramm}
        {...this.props}
      />
    );
  }

}
