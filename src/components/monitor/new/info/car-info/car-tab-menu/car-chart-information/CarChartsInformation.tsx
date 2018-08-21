import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import CarFuelChart from 'components/monitor/new/info/car-info/car-tab-menu/car-chart-information/charts/CarFuelChart';
import CarSpeedChart from 'components/monitor/new/info/car-info/car-tab-menu/car-chart-information/charts/CarSpeedChart';
import { carInfoSetTrackPoint, carInfoSetFuelEventPoint } from 'components/monitor/new/info/car-info/redux/modules/actions-car-info';

type PropsCarChartsInformation = {
  centerOn: Function;
  carInfoSetTrackPoint: Function;
  carInfoSetFuelEventPoint: Function;
}

type StateCarChartsInformation = {
  selectedTab: number;
}

class CarChartsInformation extends React.Component<PropsCarChartsInformation, StateCarChartsInformation> {
  state = {
    selectedTab: 1,
  }

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

  handleEventClick = (fuelEvent) => {
    if (fuelEvent) {
      const { start_point: { coords_msk } } = fuelEvent;

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
          <Button data-number="1" active={selectedTab === 1} onClick={this.handleClick} >Датчики топлива</Button>
          <Button data-number="2" active={selectedTab === 2} onClick={this.handleClick} >Датчики скорости</Button>
        </div>
        <div className="car_info_block tab-data">
          {
            selectedTab === 1 ?
            (
              <CarFuelChart
                handleChartClick={this.handleChartClick}
                handleEventClick={this.handleEventClick}
              />
            )
            :
            ( <div className="none"></div> )
          }
          {
            selectedTab === 2 ?
            (
              <CarSpeedChart
                handleChartClick={this.handleChartClick}
              />
            )
            :
            ( <div className="none"></div> )
          }
        </div>
      </div>
    )
  }
}

const mapDispatchToProsp = disptach => ({
  carInfoSetTrackPoint: (trackPoint) => (
    disptach(
      carInfoSetTrackPoint(trackPoint),
    )
  ),
  carInfoSetFuelEventPoint: (fuelEventPoint) => (
    disptach(
      carInfoSetFuelEventPoint(fuelEventPoint),
    )
  ),
})

export default connect(
  null,
  mapDispatchToProsp,
)(CarChartsInformation);

