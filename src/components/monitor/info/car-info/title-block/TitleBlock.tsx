import * as React from 'react';
import { connect } from 'react-redux';
import { carInfoSetGpsNumber } from 'components/monitor/info/car-info/redux-main/modules/actions-car-info';

type PropsTitleBlock = {
  gov_number: string;
  gps_code: string;
  handleClickOnClose: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
};

const TitleBlock: React.FC<PropsTitleBlock> = ({ gov_number, ...props }) => (
  <div className="map_info-title_container">
    <div></div>
    <div className="car_info-gov_number">
      <div className="car_info_block">
        <span>{gov_number}</span>
      </div>
    </div>
    <div className="car_info-close">
      <div className="car_info_block" onClick={props.handleClickOnClose}>
        <span>x</span>
      </div>
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  gps_code: state.monitorPage.carInfo.gps_code,
  gov_number: state.monitorPage.carInfo.gov_number,
});
const mapDispatchToProps = (dispatch) => ({
  handleClickOnClose: () => dispatch(carInfoSetGpsNumber(null, null)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TitleBlock);
