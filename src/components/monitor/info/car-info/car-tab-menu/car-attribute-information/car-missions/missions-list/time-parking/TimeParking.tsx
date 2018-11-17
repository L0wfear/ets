import * as React from 'react';
import { makeUnixTime, secondsToTime } from 'utils/dates';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';

type PropsTimeParking = {
  date_start: number;
  date_end: number;
  parkings: any[];
};

class TimeParking extends React.PureComponent<PropsTimeParking, {}> {
  render() {
    const { props } = this;

    const missionStart = makeUnixTime(props.date_start);
    const missionEnd = makeUnixTime(props.date_end);

    const parkingTime = props.parkings.map(({ start_point, end_point }) => {
      const start = Math.max(start_point.timestamp, missionStart);
      const end = Math.min(end_point.timestamp, missionEnd);

      if (end < start) {
        return 0;
      }
      return end - start;
    }).reduce((a, b) => a + b, 0);

    return (
      <span>{secondsToTime(parkingTime)}</span>
    );
  }
}

const mapStateToProps = (state) => ({
  parkings: state.monitorPage.carInfo.trackCaching.parkings,
});

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'parkings'],
    type: 'small-loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'trackCaching', 'error'],
  }),
  connect(
    mapStateToProps,
  ),
)(TimeParking);
