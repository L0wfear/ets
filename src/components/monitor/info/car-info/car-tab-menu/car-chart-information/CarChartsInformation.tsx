import * as React from 'react';
import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { carInfoSetTrackPoint, carInfoSetFuelEventPoint } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import {
  OwnPropsCarFuelChart,
  OwnPropsCarSpeedChart,
} from 'components/monitor/info/car-info/car-tab-menu/car-chart-information/charts/types.d';
import { CarInfoBlockTabData } from 'components/monitor/styled';

type PropsCarChartsInformation = {
  centerOn: any;
  carInfoSetTrackPoint: any;
  carInfoSetFuelEventPoint: any;
};

type StateCarChartsInformation = {
  selectedTab: number;
};

const CarFuelChart = React.lazy<React.ComponentType<OwnPropsCarFuelChart>>(() => (
  import(/* webpackChunkName: "car_fuel_chart" */ 'components/monitor/info/car-info/car-tab-menu/car-chart-information/charts/CarFuelChart')
));

const CarSpeedChart = React.lazy<React.ComponentType<OwnPropsCarSpeedChart>>(() => (
  import(/* webpackChunkName: "car_speed_Chart" */ 'components/monitor/info/car-info/car-tab-menu/car-chart-information/charts/CarSpeedChart')
));

class CarChartsInformation extends React.Component<PropsCarChartsInformation, StateCarChartsInformation> {
  state = {
    selectedTab: 1,
  };

  handleClick: any = ({ target: { dataset: { number } } }) => {
    const selectedTab = Number(number);

    this.setState({ selectedTab });
  }

  handleChartClick = (trackPoint) => {
    if (trackPoint) {
      const { coords_msk } = trackPoint;

      const extent: [number, number, number, number] = [
        coords_msk[0],
        coords_msk[1],
        coords_msk[0],
        coords_msk[1],
      ];

      if (this.props.centerOn({ extent })) {
        this.props.carInfoSetTrackPoint(trackPoint);
      }
    }
  }

  handleEventClick = (fuelEvent, fuel = false) => {
    if (fuelEvent) {
      let coords_msk = [];

      if (fuel) {
        coords_msk = fuelEvent.start_coords_msk;
      } else {
        coords_msk = fuelEvent.start_point.coords_msk;
      }

      const extent: [number, number, number, number] = [
        coords_msk[0],
        coords_msk[1],
        coords_msk[0],
        coords_msk[1],
      ];

      if (this.props.centerOn({ extent })) {
        this.props.carInfoSetFuelEventPoint(fuelEvent);
      }
    }
  }

  render() {
    const { selectedTab } = this.state;

    return (
      <div className="car_info-charts">
        <div className="car_info-chart_buttons_row">
          <EtsBootstrap.Button data-number="1" active={selectedTab === 1} onClick={this.handleClick} >Датчики топлива</EtsBootstrap.Button>
          <EtsBootstrap.Button data-number="2" active={selectedTab === 2} onClick={this.handleClick} >Датчики скорости</EtsBootstrap.Button>
        </div>
        <CarInfoBlockTabData>
          <React.Suspense fallback={<LoadingComponent />}>
            <EtsBootstrap.ViewCarousel indexShow={selectedTab - 1}>
              <CarFuelChart
                handleChartClick={this.handleChartClick}
                handleEventClick={this.handleEventClick}
              />
              <CarSpeedChart
                handleChartClick={this.handleChartClick}
              />
            </EtsBootstrap.ViewCarousel>
          </React.Suspense>
        </CarInfoBlockTabData>
      </div>
    );
  }
}

const mapDispatchToProsp = (dispatch) => ({
  carInfoSetTrackPoint: (trackPoint) => (
    dispatch(
      carInfoSetTrackPoint(trackPoint),
    )
  ),
  carInfoSetFuelEventPoint: (fuelEventPoint) => (
    dispatch(
      carInfoSetFuelEventPoint(fuelEventPoint),
    )
  ),
});

export default connect(
  null,
  mapDispatchToProsp,
)(CarChartsInformation);
