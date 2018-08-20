import * as React from 'react';
import { connect } from 'react-redux';
import { carInfoSetGpsNumber } from 'components/monitor/new/info/car-info/redux/modules/actions-car-info';
import Preloader from 'components/ui/Preloader';

type PropsTitleBlock = {
  carActualGpsNumberIndex: any;
  gov_number: string;
  gps_code: number;
  handleClickOnClose: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
};

const TitleBlock: React.SFC<PropsTitleBlock> = ({ gov_number, ...props }) => (
  <div className="map_info-title_container">
    <div></div>
    <div className=" car_info-gov_number">
      <div className="car_info_block">
      {
        gov_number ?
        (
          <span>{gov_number}</span>
        )
        :
        (
          <Preloader type="field" />
        )
      }
      </div>
    </div>
    <div className="car_info-close">
      <div className="car_info_block" onClick={props.handleClickOnClose}>
        <span>x</span>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
  gov_number: (state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code] || { gov_number: null}).gov_number,
  gps_code: state.monitorPage.carInfo.gps_code,
});
const mapDispatchToProps = dispatch => ({
  handleClickOnClose: () => dispatch(carInfoSetGpsNumber(null)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TitleBlock);
