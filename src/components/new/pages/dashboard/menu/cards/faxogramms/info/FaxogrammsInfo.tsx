import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { saveData } from 'utils/functions';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInFaxogramms,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import { saveOrderBlob } from 'redux-main/trash-actions/order/order';

import {
  ButtonReadOrder,
  LinkToOrder,
} from 'components/directories/order/buttons/buttons';

import PDFViewModalLazy from 'components/new/pages/dashboard/menu/cards/faxogramms/info/pdf-veiw-modal/PDFViewModalLazy';

import {
  PropsFaxogrammsInfo,
  StateFaxogrammsInfo,
} from 'components/new/pages/dashboard/menu/cards/faxogramms/info/FaxogrammsInfo.h';
import { RightButtonBlockContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';

import {
  DivNone,
} from 'global-styled/global-styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

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

    if (event === TypeDownload.new) {
      payload.format = 'xls';
    }

    this.props.saveOrder(this.props.infoData.data.id, payload)
      .then(({ payload: { blob, fileName } }) => saveData(blob, fileName))
      .catch((error) => {
        // tslint:disable-next-line
        console.warn(error);
      });
  }

  showPDFViewModal = () => {
    this.props.saveOrder(this.props.infoData.data.id)
      .then(({ payload: { blob } }) => {
        if (blob) {
          this.setState({
            showPDFViewModal: true,
            blob,
          });
        }
      })
      .catch((error) => {
        console.log(error); // tslint:disable-line:no-console
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
        <RightButtonBlockContainer needMarginBottom>
          <EtsBootstrap.DropdownButton id="save-faxogramm" onSelect={this.seclectDownload} title={<EtsBootstrap.Glyphicon glyph="download-alt" />} pullRight>
            <EtsBootstrap.MenuItem eventKey={TypeDownload.old}>Скан-копия факсограммы</EtsBootstrap.MenuItem>
            <EtsBootstrap.MenuItem eventKey={TypeDownload.new}>Расшифровка централизованного задания</EtsBootstrap.MenuItem>
          </EtsBootstrap.DropdownButton>
          <ButtonReadOrder onClick={this.showPDFViewModal}><EtsBootstrap.Glyphicon glyph="info-sign" /></ButtonReadOrder>
          <LinkToOrder to={`/orders?idOrder=${infoData.data.id}&dateFrom=${meta.date_from}&dateTo=${meta.date_to}`}>
            <EtsBootstrap.Button >Сформировать задания</EtsBootstrap.Button>
          </LinkToOrder>
        </RightButtonBlockContainer>
        <PDFViewModalLazy
          show={this.state.showPDFViewModal}
          blob={this.state.blob}
          onHide={this.handleHidePDFViewModal}
        />
      </InfoCard>
    );
  }
}

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'faxogramms', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      meta: getDashboardState(state).faxogramms.data.meta,
      infoData: getDashboardState(state).faxogramms.infoData,
    }),
    (dispatch) => ({
      handleClose: () => (
        dispatch(
          dashboardSetInfoDataInFaxogramms(null),
        )
      ),
      saveOrder: (id, payload) => (
        dispatch(
          saveOrderBlob(
            'none',
            id,
            payload,
            {
              promise: true,
              page: 'dashboard',
            },
          ),
        )
      ),
    }),
  ),
)(FaxogrammsInfo);
