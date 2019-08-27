import * as React from 'react';
import Map from 'ol/Map';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';

type PropsCarTabMenu = {
  map: Map;
  centerOn: any;
};

const CarAttributeInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_attribute_information" */ 'components/old/monitor/info/car-info/car-tab-menu/car-attribute-information/CarAttributeInformation'),
);

const CarChartsInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_charts_information" */ 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/CarChartsInformation'),
);

const CarTrackInformation = React.lazy(() =>
  import(/* webpackChunkName: "car_track_information" */ 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/CarTrackInformation'),
);

const CarTabMenu: React.FC<PropsCarTabMenu> = React.memo(
  (props) => {
    const [tabNum, setTabNum] = React.useState(1);

    const handleSelectInfo = React.useCallback(
      () => setTabNum(1),
      [],
    );
    const handleSelectChart = React.useCallback(
      () => setTabNum(2),
      [],
    );
    const handleSelectTrack = React.useCallback(
      () => setTabNum(3),
      [],
    );

    return (
      <div>
        <EtsButtonsContainer sameBtn={true}>
          <EtsBootstrap.Button active={tabNum === 1} onClick={handleSelectInfo}>
            Информация
          </EtsBootstrap.Button>
          <EtsBootstrap.Button active={tabNum === 2} onClick={handleSelectChart}>
            Графики
          </EtsBootstrap.Button>
          <EtsBootstrap.Button active={tabNum === 3} onClick={handleSelectTrack}>
            Трекинг
          </EtsBootstrap.Button>
        </EtsButtonsContainer>
        <React.Suspense fallback={<LoadingComponent />}>
          <EtsBootstrap.ViewCarousel indexShow={tabNum - 1}>
            <CarAttributeInformation map={props.map} />
            <CarChartsInformation centerOn={props.centerOn} />
            <CarTrackInformation map={props.map} />
          </EtsBootstrap.ViewCarousel>
        </React.Suspense>
      </div>
    );
  },
);

export default CarTabMenu;
