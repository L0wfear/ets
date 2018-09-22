import * as React from 'react';

import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { fetchTrack, fetchCarInfo } from 'components/monitor/new/info/car-info/redux-main/modules/actions-car-info';
import { initialState } from 'components/monitor/new/info/car-info/redux-main/modules/car-info';

import CarAttributeInformation from 'components/monitor/new/info/car-info/car-tab-menu/car-attribute-information/CarAttributeInformation';
import CarChartsInformation from 'components/monitor/new/info/car-info/car-tab-menu/car-chart-information/CarChartsInformation';
import CarTrackInformation from 'components/monitor/new/info/car-info/car-tab-menu/car-track-information/CarTrackInformation';

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
  asuods_id: number | void;
  odh_mkad: -1 | null | any[];
};

class CarTabMenu extends React.Component<PropsCarTabMenu, StateCarTabMenu> {
  state = {
    selectedTab: 1,
    asuods_id: this.props.asuods_id,
    odh_mkad: this.props.odh_mkad,
    gps_code: this.props.gps_code,
  }

  componentDidMount() {
    if (this.state.asuods_id) {
      this.props.fetchMissionsData({
        asuods_id: this.state.asuods_id,
        gps_code: this.state.gps_code,
      });
      if (this.state.odh_mkad !== -1) {
        this.props.fetchTrack({
          asuods_id: this.state.asuods_id,
          gps_code: this.state.gps_code,
        });
      }
    }
  }
  
  componentWillReceiveProps({ asuods_id, odh_mkad, gps_code }) {
    if (asuods_id !== this.state.asuods_id) {
      const changeStateObj = {
        asuods_id,
        odh_mkad: this.state.odh_mkad,
      };

      this.props.fetchMissionsData({
        asuods_id,
        gps_code,
      });

      if (this.state.odh_mkad !== -1) {
        this.props.fetchTrack({
          asuods_id,
          gps_code,
        });

        changeStateObj.odh_mkad = odh_mkad;
      }

      this.setState(changeStateObj);
    } else if (odh_mkad !== this.state.odh_mkad) {
      this.props.fetchTrack({
        asuods_id,
        gps_code,
      });

      this.setState({ odh_mkad });
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
            selectedTab === 1 ?
            ( <CarAttributeInformation map={this.props.map} /> )
            :
            ( <div></div> )
          }
          {
            selectedTab === 2 ?
            ( <CarChartsInformation centerOn={this.props.centerOn} /> )
            :
            ( <div></div> )
          }
          {
            selectedTab === 3 ?
            ( <CarTrackInformation map={this.props.map} /> )
            :
            ( <div></div> )
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
      date_start: initialState.date_start,
      date_end: initialState.date_end,
    }))
  ),
  fetchTrack: (props) => (
    dispatch(fetchTrack(
      {
        asuods_id: props.asuods_id,
        gps_code: props.gps_code,
        date_start: initialState.date_start,
        date_end: initialState.date_end,
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
