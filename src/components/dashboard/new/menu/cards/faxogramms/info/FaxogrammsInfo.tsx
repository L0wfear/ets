import * as React from 'react';
import { DropdownButton, MenuItem, Glyphicon, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { saveData } from 'utils/functions';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInFaxogramms,
} from 'components/dashboard/new/redux-main/modules/dashboard/actions-dashboard';
import { saveOrderBlob } from 'redux-main/trash-actions/order/order';

import {
  ButtonReadOrder,
  LinkToOrder,
} from 'components/directories/order/buttons/buttons';

import PDFViewModal from 'components/dashboard/new/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModal';

import {
  PropsFaxogrammsInfo,
  StateFaxogrammsInfo,
} from 'components/dashboard/new/menu/cards/faxogramms/info/FaxogrammsInfo.h';
import {
  RightButton_BlockContainer,
} from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';

import {
  DivNone,
} from 'global-styled/global-styled';

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

    this.props.saveOrder(this.props.infoData.data.id, payload)
      .then(({ blob, fileName }) => saveData(blob, fileName))
      .catch((error) => {
        console.warn(error)
      })
  }

  showPDFViewModal = () => {
    this.props.saveOrder(this.props.infoData.data.id)
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
        // tslint:disable-next-line
        console.log(error);
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
      ...props
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
            <DivNone />
          )
        }
        <RightButton_BlockContainer needMarginBottom>
          <DropdownButtonTSX id="save-faxogramm" onSelect={this.seclectDownload} title={<Glyphicon glyph="download-alt" />} pullRight>
            <MenuItem eventKey={TypeDownload.old}>Скан-копия факсограммы</MenuItem>
            <MenuItem eventKey={TypeDownload.new}>Расшифровка централизованного задания</MenuItem>
          </DropdownButtonTSX>
          <ButtonReadOrder onClick={this.showPDFViewModal}><Glyphicon glyph="info-sign" /></ButtonReadOrder>
          <LinkToOrder to={`/orders?idOrder=${infoData.data.id}&dateFrom=${meta.date_from}&dateTo=${meta.date_to}`}>
            <Button >Сформировать задания</Button>
          </LinkToOrder>
        </RightButton_BlockContainer>
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
            <DivNone />
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
  saveOrder: (id, payload) => (
    dispatch(
      saveOrderBlob(
        '',
        id,
        payload,
        {
          promise: true,
          page: 'dashboard',
        },
      ),
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