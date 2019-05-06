import * as React from 'react';
import { connect } from 'react-redux';
import { GEOOBJECTS_OBJ_BY_SERVER_NAME } from 'constants/geoobjects-new';

import GeoDataTemplate from 'components/monitor/info/geoobjects-info/geo-data-template/GeoDataTemplate';
import { monitorPageRemoveFromSelectedGeoobjects } from 'components/monitor/redux-main/models/actions-monitor-page';

import {
  DivNone,
} from 'global-styled/global-styled';

type PropsGeoobjectData = {
  selectedGeoobjectData: {
    [key: string]: {
      front_add_at: number;
      front_show: boolean;
    };
  };
  serverName: string;
  handleClickOnClose: any;
  centerOn: any;
};

const GeoobjectData: React.FC<PropsGeoobjectData> = ({ selectedGeoobjectData, serverName, ...props }) => (
  !selectedGeoobjectData ?
  (
    <DivNone />
  )
  :
  (
    <div className="data_container geoobjects_info car_info_block tab-data">
      <div>
        <div className="car_info-track_date_title">
          <div className="car_info-gov_number flex_basis_100">
            <span>{`Выбранные ${GEOOBJECTS_OBJ_BY_SERVER_NAME[serverName].label}`}</span>
          </div>
          <div className="car_info-close">
            <div className="car_info_block" onClick={props.handleClickOnClose}>
              <span>x</span>
            </div>
          </div>
        </div>
        <div className="selected_geoobjects-container">
        {
          Object.entries(selectedGeoobjectData).sort(([a_id, a_data], [b_id, b_data]) => a_data.front_add_at - b_data.front_add_at).map(([id, data]) => (
            data.front_show ?
              <GeoDataTemplate key={id} serverName={serverName} data={data} id={id} centerOn={props.centerOn} />
            :
              <div key={id} className="none"></div>
          ))
        }
        </div>
      </div>
    </div>
  )
);

const mapStateToProps = (state, { serverName }) => {
  const selectedGeoobjectData = state.monitorPage.selectedGeoobjects[serverName];
  const hasSomeFrontShow = Object.values(selectedGeoobjectData).some(({ front_show }) => front_show);

  return {
    selectedGeoobjectData: hasSomeFrontShow ? selectedGeoobjectData : null,
  };
};

const mapDispatchToProps = (dispatch, { serverName }) => ({
  handleClickOnClose: () => (
    dispatch(
      monitorPageRemoveFromSelectedGeoobjects(serverName),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(GeoobjectData);
