import React from 'react';
import { DropdownButton, MenuItem, Glyphicon, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { OrderService } from 'api/Services';
import Div from 'components/ui/Div.jsx';
import { FluxContext, connectToStores } from 'utils/decorators';
import { saveData } from 'utils/functions';
import DashboardCardMedium from '../DashboardCardMedium.jsx';
import PDFViewModal from './PDFViewModal.jsx';

const TypeDownload = {
  old: '1',
  new: '2',
};

@connectToStores(['objects'])
@FluxContext
export default class Faxogramms extends DashboardCardMedium {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showPDFViewModal: false,
    });
  }

  async showPDFViewModal(data) {
    const url = await this.context.flux.getActions('objects').getOrderPDFUrl(data.id);
    const { blob } = await OrderService.path(data.id).getBlob();
    if (blob === null) {
      return;
    }
    this.setState({ showPDFViewModal: true, url });
  }

  saveOrder(typeSave) {
    const { flux } = this.context;
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || null;
    const data = selectedItem !== null ? selectedItem.data || {} : {};

    const payload = {};
    if (typeSave === TypeDownload.new) {
      payload.format = 'xls';
    }

    flux.getActions('objects').saveOrder(data.id, payload)
      .then(({ blob, fileName }) => saveData(blob, fileName));
  }

  seclectDownload = (eventName) => {
    switch (eventName) {
      case TypeDownload.old: return this.saveOrder(TypeDownload.old);
      case TypeDownload.new: return this.saveOrder(TypeDownload.new);
      default: return null;
    }
  }

  renderCustomCardData() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || null;
    const data = selectedItem !== null ? selectedItem.data || {} : {};

    const canViewPDF = this.context.flux.getStore('session').getPermission('faxogramm.read');
    const canCreateMission = this.context.flux.getStore('session').getPermission('mission.create');

    const {
      meta: {
        date_to = '',
        date_from = '',
      } = {},
    } = this.props;

    return (
      <Div>
        <Div style={{ marginTop: 10 }}>
          <h5>Доп. информация</h5>
          <p>{data.order_info}</p>
        </Div>
        <Div className="text-right-flex">
          <div className="dashboard-card-action-button">
            <DropdownButton onSelect={this.seclectDownload} title={<Glyphicon glyph="download-alt" />} id="bg-nested-dropdown">
              <MenuItem eventKey={TypeDownload.old}>Скан-копия факсограммы</MenuItem>
              {<MenuItem eventKey={TypeDownload.new}>Расшифровка централизованного задания</MenuItem>}
            </DropdownButton>
          </div>
          {canViewPDF ? <Button className="dashboard-card-action-button" onClick={(e) => { e.preventDefault(); this.showPDFViewModal(data); }}><Glyphicon glyph="info-sign" /></Button> : ''}
          {canCreateMission ? <Link to={`/orders/${data.id}?dateFrom=${date_from}&dateTo=${date_to}`}><Button className="dashboard-card-action-button">Сформировать задания</Button></Link> : ''}
        </Div>
        <PDFViewModal
          blob={this.state.blob}
          show={this.state.showPDFViewModal}
          onHide={() => this.setState({ showPDFViewModal: false, blob: null })}
        />
      </Div>
    );
  }
}
