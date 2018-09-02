import * as React from 'react';
import { DropdownButton, MenuItem, Glyphicon, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { saveData } from 'utils/functions';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInFaxogramms,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import {
  saveOrder,
} from 'redux/trash-actions/order/promise';

import {
  ButtonReadOrder,
  LinkToOrder,
} from 'components/directories/order/buttons/buttons';

import PDFViewModal from 'components/dashboard/new/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModal';

import {
  PropsFaxogrammsInfo,
  StateFaxogrammsInfo,
} from 'components/dashboard/new/menu/cards/faxogramms/info/FaxogrammsInfo.h';

require('components/dashboard/new/menu/cards/faxogramms/info/FaxogrammInfo.scss');

const DropdownButtonTSX: any = DropdownButton;

const TypeDownload = {
  old: 'old',
  new: 'new',
};

class FaxogrammsInfo extends React.Component<PropsFaxogrammsInfo, StateFaxogrammsInfo> {
  state = {
    showFaxogrammMissionsFormWrap: false,
    elementFaxogrammMissionsFormWrap: null,
    blob: null,
    showPDFViewModal: false,
  };

  handleFaxogrammMissionsFormWrapHide = () => (
    this.setState({
      showFaxogrammMissionsFormWrap: false,
      elementFaxogrammMissionsFormWrap: null,
    })
  )

  seclectDownload = (event, eventKey) => {
    const payload: any = {};

    if (eventKey === TypeDownload.new) {
      payload.format = 'xls';
    }

    saveOrder(this.props.infoData.data.id, payload)
      .then(({ blob, fileName }) => saveData(blob, fileName))
      .catch((error) => {
        console.warn(error)
      })
  }

  showPDFViewModal = () => {
    saveOrder(this.props.infoData.data.id)
      .then(({ blob }) => {
        if (!!blob) {
          this.setState({
            showPDFViewModal: true,
            blob,
          });
        } else {
          console.error('no blob')
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  handleHidePDFViewModal = () => {
    this.setState({
      showPDFViewModal: false,
      blob: null,
    });
  }

  render() {
    const {
      meta,
      infoData,
      infoData: {
        subItems = [],
        data: {
          order_info,
        },
      },
      ...props,
    } = this.props;

    return (
      <InfoCard title="Расшифровка факсограммы" handleClose={props.handleClose}>
        <ul>
          {
            subItems.map(({ title }, index) => (
              <li key={index}>
                <span>{title}</span>
              </li>
            ))
          }
        </ul>
        {
          order_info ?
          (
            <div>
              <div className="line_data"><b>Доп. информация</b></div>
              <div>{order_info}</div>
            </div>
          )
          :
          (
            <div className="none"></div>
          )
        }
        <div className="right_button_block buttons_order_info">
          <DropdownButtonTSX id="save-faxogramm" onSelect={this.seclectDownload} title={<Glyphicon glyph="download-alt" />} pullRight>
            <MenuItem eventKey={TypeDownload.old}>Скан-копия факсограммы</MenuItem>
            <MenuItem eventKey={TypeDownload.new}>Расшифровка централизованного задания</MenuItem>
          </DropdownButtonTSX>
          <ButtonReadOrder onClick={this.showPDFViewModal}><Glyphicon glyph="info-sign" /></ButtonReadOrder>
          <LinkToOrder to={`/orders?idOrder=${infoData.data.id}&dateFrom=${meta.date_from}&dateTo=${meta.date_to}`}>
            <Button >Сформировать задания</Button>
          </LinkToOrder>
        </div>
        {
          this.state.showPDFViewModal ?
          (
            <PDFViewModal
              blob={this.state.blob}
              onHide={this.handleHidePDFViewModal}
            />
          )
          :
          (
            <div className="none"></div>
          )
        }
      </InfoCard>
    );
  }
}

const mapStateToProps = (state) => ({
  meta: state.dashboard.faxogramms.data.meta,
  infoData: state.dashboard.faxogramms.infoData,
});

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => (
    dispatch(
      dashboardSetInfoDataInFaxogramms(null),
    )
  ),
});

export default hocAll(
  withShowByProps({
    path: ['dashboard', 'faxogramms', 'infoData'],
    type: 'none',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(FaxogrammsInfo);