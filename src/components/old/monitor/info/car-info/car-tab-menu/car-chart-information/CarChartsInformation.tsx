import * as React from 'react';
import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { carInfoSetTrackPoint, carInfoSetFuelEventPoint } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';

import { CarInfoBlockTabData } from 'components/old/monitor/styled';
import CarFuelChart from 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/charts/CarFuelChart';
import CarSpeedChart from 'components/old/monitor/info/car-info/car-tab-menu/car-chart-information/charts/CarSpeedChart';

type PropsCarChartsInformation = {
  centerOn: any;
  carInfoSetTrackPoint: any;
  carInfoSetFuelEventPoint: any;
};

type StateCarChartsInformation = {
  selectedTab: number;
};

class CarChartsInformation extends React.PureComponent<PropsCarChartsInformation, StateCarChartsInformation> {
  state = {
    selectedTab: 1,
  };

  handleClick: any = ({ target: { dataset: { number } } }) => {
    const selectedTab = Number(number);

    this.setState({ selectedTab });
  };

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
  };

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
  };

  render() {
    const { selectedTab } = this.state;

    return (
      <div className="car_info-charts">
        <div className="car_info-chart_buttons_row">
          <EtsBootstrap.Button data-number="1" active={selectedTab === 1} onClick={this.handleClick} >Датчики топлива</EtsBootstrap.Button>
          <EtsBootstrap.Button data-number="2" active={selectedTab === 2} onClick={this.handleClick} >Датчики скорости</EtsBootstrap.Button>
        </div>
        <CarInfoBlockTabData>
          <EtsBootstrap.ViewCarousel indexShow={selectedTab - 1}>
            <CarFuelChart
              handleChartClick={this.handleChartClick}
              handleEventClick={this.handleEventClick}
            />
            <CarSpeedChart
              handleChartClick={this.handleChartClick}
            />
          </EtsBootstrap.ViewCarousel>
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
