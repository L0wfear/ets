import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { path } from 'components/new/pages/nsi/order/_config-data';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInFaxogramms,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

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
import { promiseLoadOrderBlobAndSave, promiseLoadOrderBlob } from 'redux-main/reducers/modules/order/order_promise';
import { LinkToOrder } from 'components/new/pages/nsi/order/_config-data/buttons';
import { TypeDownload } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import orderPermissions from 'components/new/pages/nsi/order/_config-data/permissions';

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
  );

  seclectDownload = (event) => {
    promiseLoadOrderBlobAndSave(this.props.infoData.data.id, event);
  };

  showPDFViewModal = () => {
    promiseLoadOrderBlob(this.props.infoData.data.id, TypeDownload.old)
      .then(({ blob }) => {
        if (blob) {
          this.setState({
            showPDFViewModal: true,
            blob,
          });
        }
      })
      .catch((error) => {
        console.info(error); // eslint-disable-line
      });
  };

  handleHidePDFViewModal = () => {
    this.setState({
      showPDFViewModal: false,
      blob: null,
    });
  };

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
          order_info
            ? (
              <div>
                <div className="line_data"><b>Доп. информация</b></div>
                <div>{order_info}</div>
              </div>
            )
            :          (
              <DivNone />
            )
        }
        <RightButtonBlockContainer needMarginBottom>
          <EtsBootstrap.Dropdown
            id="save-faxogramm"
            toggleElement={<EtsBootstrap.Glyphicon glyph="download-alt" />}
          >
            <EtsBootstrap.DropdownMenu dropupRight>
              <EtsBootstrap.MenuItem eventKey={TypeDownload.old} onSelect={this.seclectDownload}>Скан-копия факсограммы</EtsBootstrap.MenuItem>
              <EtsBootstrap.MenuItem eventKey={TypeDownload.new} onSelect={this.seclectDownload}>Расшифровка централизованного задания</EtsBootstrap.MenuItem>
            </EtsBootstrap.DropdownMenu>
          </EtsBootstrap.Dropdown>
          <EtsBootstrap.Button onClick={this.showPDFViewModal} permissions={orderPermissions.read} style={{marginRight: '5px', }} ><EtsBootstrap.Glyphicon glyph="info-sign" /></EtsBootstrap.Button>
          <LinkToOrder to={`${path}/${infoData.data.id}`}>
            <EtsBootstrap.Button >Сформировать задания</EtsBootstrap.Button>
          </LinkToOrder>
        </RightButtonBlockContainer>
        <PDFViewModalLazy
          show={this.state.showPDFViewModal}
          blob={this.state.blob}
          onHide={this.handleHidePDFViewModal}
          title="Скан-копия факсограммы"
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
    }),
  ),
)(FaxogrammsInfo);
