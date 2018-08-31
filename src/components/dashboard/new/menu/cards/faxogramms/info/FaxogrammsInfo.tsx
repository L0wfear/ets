import * as React from 'react';
import { DropdownButton, MenuItem, Glyphicon, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { saveData } from 'utils/functions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/dashboard/new/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardSetInfoDataInFaxogramms,
} from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import {
  saveFaxogramm,
} from 'redux/trash-actions/faxogramm/promise';

import FaxogrammMissionsFormWrap from 'components/directories/faxogramm/FaxogrammMissionsFormWrap.jsx';
import PDFViewModal from 'components/dashboard/new/menu/cards/faxogramms/info/PDFViewModal';

require('components/dashboard/new/menu/cards/faxogramms/info/FaxogrammInfo.scss');

const ButtonReadFaxogramm = withRequirePermissionsNew({
  permissions: 'faxogramm.read',
})(Button);

const ButtonCreateMission = withRequirePermissionsNew({
  permissions: 'mission.create',
})(Button);

const DropdownButtonTSX: any = DropdownButton;

type PropsFaxogrammsInfo = {
  infoData: any;

  handleClose: React.MouseEventHandler<HTMLDivElement>;
}

type StateFaxogrammsInfo = {
  showFaxogrammMissionsFormWrap: boolean;
  elementFaxogrammMissionsFormWrap: any;

  blob: any;
  showPDFViewModal: boolean;
}

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

  showFaxogrammFormWrap = () => {
    this.setState({
      showFaxogrammMissionsFormWrap: true,
      elementFaxogrammMissionsFormWrap: this.props.infoData.data,
    });
  }

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

    saveFaxogramm(this.props.infoData.data.id, payload)
      .then(({ blob, fileName }) => saveData(blob, fileName))
      .catch((error) => {
        console.warn(error)
      })
  }

  showPDFViewModal = () => {
    saveFaxogramm(this.props.infoData.data.id)
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
      infoData,
      infoData: {
        subItems = [],
        data: {
          order_info
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
        <div className="right_button_block buttons_faxogramm_info">
          <DropdownButtonTSX id="save-faxogramm" onSelect={this.seclectDownload} title={<Glyphicon glyph="download-alt" />} pullRight>
            <MenuItem eventKey={TypeDownload.old}>Скан-копия факсограммы</MenuItem>
            <MenuItem eventKey={TypeDownload.new}>Расшифровка централизованного задания</MenuItem>
          </DropdownButtonTSX>
          <ButtonReadFaxogramm onClick={this.showPDFViewModal}><Glyphicon glyph="info-sign" /></ButtonReadFaxogramm>
          <ButtonCreateMission onClick={this.showFaxogrammFormWrap}>Сформировать задания</ButtonCreateMission>
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
        <FaxogrammMissionsFormWrap
          onFormHide={this.handleFaxogrammMissionsFormWrapHide}
          showForm={this.state.showFaxogrammMissionsFormWrap}
          element={this.state.elementFaxogrammMissionsFormWrap}
        />
      </InfoCard>
    );
  }
}

const mapStateToProps = (state) => ({
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