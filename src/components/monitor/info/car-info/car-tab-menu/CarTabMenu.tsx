import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { connect } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import { fetchTrack, fetchCarInfo } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

import { DivNone } from 'global-styled/global-styled';

type PropsCarTabMenu = {
  fetchMissionsData: Function;
  fetchTrack: Function;
  asuods_id: number | void;
  gps_code: number | void;
  odh_mkad: -1 | null | any[];
  map: ol.Map;

  centerOn: Function;
};

type StateCarTabMenu = {
  selectedTab: number;
};



const CarAttributeInformation = React.lazy(() => (
  import(/* webpackChunkName: "car_attribute_information" */'components/monitor/info/car-info/car-tab-menu/car-attribute-information/CarAttributeInformation')
));

const CarChartsInformation = React.lazy(() => (
  import(/* webpackChunkName: "car_charts_information" */'components/monitor/info/car-info/car-tab-menu/car-chart-information/CarChartsInformation')
));

const CarTrackInformation = React.lazy(() => (
  import(/* webpackChunkName: "car_track_information" */'components/monitor/info/car-info/car-tab-menu/car-track-information/CarTrackInformation')
));


class CarTabMenu extends React.Component<PropsCarTabMenu, StateCarTabMenu> {
  state = {
    selectedTab: 1,
  }

  componentDidMount() {
    if (this.props.asuods_id) {
      this.props.fetchMissionsData({
        asuods_id: this.props.asuods_id,
        gps_code: this.props.gps_code,
      });
      if (this.props.odh_mkad !== -1) {
        this.props.fetchTrack({
          asuods_id: this.props.asuods_id,
          gps_code: this.props.gps_code,
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { asuods_id, odh_mkad, gps_code } = this.props;
    if (asuods_id !== prevProps.asuods_id) {
      this.props.fetchMissionsData({
        asuods_id,
        gps_code,
      });

      if (odh_mkad !== -1) {
        this.props.fetchTrack({
          asuods_id,
          gps_code,
        });
      }
    } else if (odh_mkad !== prevProps.odh_mkad) {
      this.props.fetchTrack({
        asuods_id,
        gps_code,
      });
    }
  }  

  handleClick: any = ({ target: { dataset: { number } } }) => {
    const selectedTab = Number(number);
    if (selectedTab !== this.state.selectedTab) {
      this.setState({ selectedTab });
    }
  }

  render() {
    const { selectedTab } = this.state;

    return (
      <div>
        <div className="car_info-buttons_row">
          <Button data-number="1" active={selectedTab === 1} onClick={this.handleClick} >Информация</Button>
          <Button data-number="2" active={selectedTab === 2} onClick={this.handleClick} >Графики</Button>
          <Button data-number="3" active={selectedTab === 3} onClick={this.handleClick} >Трекинг</Button>
        </div>
        <div>
          {
            selectedTab === 1
            ? ( 
              <React.Suspense fallback={<LoadingComponent />}>
                <CarAttributeInformation map={this.props.map} />
              </React.Suspense>
            )
            : (
              <DivNone />
            )
          }
          {
            selectedTab === 2
            ? (
              <React.Suspense fallback={<LoadingComponent />}>
                <CarChartsInformation centerOn={this.props.centerOn} />
              </React.Suspense>
            )
            : (
              <DivNone />
            )
          }
          {
            selectedTab === 3
            ? (
              <React.Suspense fallback={<LoadingComponent />}>
                <CarTrackInformation map={this.props.map} />
              </React.Suspense>
            )
            : (
              <DivNone />
            )
          }
        </div>
      </div>
    )
  }
};

const mapStateToProps = state => ({
  odh_mkad: state.monitorPage.geoobjects.odh_mkad.data,
  gps_code: state.monitorPage.carInfo.gps_code,
  asuods_id: (state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code] || { asuods_id: null}).asuods_id,
});

const mapDispatchToProps = null;
const mergeProps = ({ asuods_id, odh_mkad, gps_code, ...otherStateProps }, { dispatch }, { map, ...other }) => ({
  asuods_id,
  odh_mkad,
  gps_code,
  map,
  ...other,
  fetchMissionsData: (props) => (
    dispatch(fetchCarInfo({
      asuods_id: props.asuods_id,
      gps_code: props.gps_code,
    }))
  ),
  fetchTrack: (props) => (
    dispatch(fetchTrack(
      {
        asuods_id: props.asuods_id,
        gps_code: props.gps_code,
      },
      odh_mkad,
    ))
  ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CarTabMenu);
