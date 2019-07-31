import * as React from 'react';
import { connect } from 'react-redux';
import { GEOOBJECTS_OBJ_BY_SERVER_NAME } from 'constants/geoobjects-new';

import GeoDataTemplate from 'components/monitor/info/geoobjects-info/geo-data-template/GeoDataTemplate';
import { monitorPageRemoveFromSelectedGeoobjects } from 'components/monitor/redux-main/models/actions-monitor-page';

import { CarInfoBlock, CarInfoClose } from 'components/monitor/styled';
import { CarInfoTrackDateTitle, CarInfoTitleSpanContainerWrapFlexBasic100 } from './styled';

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
  selectedGeoobjectData && (
    <CarInfoBlock>
      <div>
        <CarInfoTrackDateTitle>
          <CarInfoTitleSpanContainerWrapFlexBasic100>
            <span>{`Выбранные ${GEOOBJECTS_OBJ_BY_SERVER_NAME[serverName].label}`}</span>
          </CarInfoTitleSpanContainerWrapFlexBasic100>
          <CarInfoClose>
            <CarInfoBlock onClick={props.handleClickOnClose}>
              <span>x</span>
            </CarInfoBlock>
          </CarInfoClose>
        </CarInfoTrackDateTitle>
        <div className="selected_geoobjects-container">
        {
          Object.entries(selectedGeoobjectData).sort(([a_id, a_data], [b_id, b_data]) => a_data.front_add_at - b_data.front_add_at).map(([id, data]) => (
            data.front_show && (
              <GeoDataTemplate
                key={id}
                serverName={serverName}
                data={data}
                id={id}
                centerOn={props.centerOn}
              />
            )
          ))
        }
        </div>
      </div>
    </CarInfoBlock>
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
