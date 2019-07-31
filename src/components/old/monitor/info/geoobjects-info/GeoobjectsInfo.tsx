import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { connect } from 'react-redux';
import GeoobjectData from 'components/monitor/info/geoobjects-info/GeoobjectData';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { monitorPageRemoveAllFromSelectedGeoobjects } from 'components/monitor/redux-main/models/actions-monitor-page';

import { CarInfoBlock, DataContainer, CarInfoTitleSpanContainer, CarInfoClose } from 'components/monitor/styled';
import { ReduxState } from 'redux-main/@types/state';
import { ContainerButtonToggleShowGeoobjectList, GeoobjectListContainer } from './styled';

type PropsGeoobjectsInfo = {
  monitorPageRemoveAllFromSelectedGeoobjects: typeof monitorPageRemoveAllFromSelectedGeoobjects;
  centerOn: any;
};

const GeoobjectsInfo: React.FC<PropsGeoobjectsInfo> = React.memo(
  (props) => {
    const [shortVersion, setShortVersion] = React.useState(false);
    const toggleShortVersion = React.useCallback(
      () => {
        setShortVersion((state) => !state);
      },
      [],
    );

    return (
      <GeoobjectListContainer className="geoobjects_info">
        {
          !shortVersion && (
            <DataContainer className="geoobjects_info">
              <div className="map_info-title_container geoobject_title">
                <CarInfoTitleSpanContainer>
                  <CarInfoBlock>
                    <span>Список выбранных геообъектов</span>
                  </CarInfoBlock>
                </CarInfoTitleSpanContainer>
                <CarInfoClose>
                  <CarInfoBlock onClick={props.monitorPageRemoveAllFromSelectedGeoobjects}>
                    <span>x</span>
                  </CarInfoBlock>
                </CarInfoClose>
              </div>
              <div>
                {
                  Object.values(GEOOBJECTS_OBJ).map(({ serverName }) => (
                    <GeoobjectData key={serverName} serverName={serverName} centerOn={props.centerOn} />
                  ))
                }
              </div>
            </DataContainer>
          )
        }
        <ContainerButtonToggleShowGeoobjectList onClick={toggleShortVersion}>
          <EtsBootstrap.Button title={`${shortVersion ? 'Показать' : 'Скрыть'} выбранные геообъекты`}>{shortVersion ? '<<' : '>>'}</EtsBootstrap.Button>
        </ContainerButtonToggleShowGeoobjectList>
      </GeoobjectListContainer>
    );
  },
);

export default connect<any, any, any, ReduxState>(
  null,
  (dispatch: any) => ({
    monitorPageRemoveAllFromSelectedGeoobjects: (...arg) => (
      dispatch(
        monitorPageRemoveAllFromSelectedGeoobjects(...arg),
      )
    ),
  }),
)
(GeoobjectsInfo);
