import * as React from 'react';
import { connect } from 'react-redux';
import Preloader from 'components/ui/Preloader';
import { attributeList } from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/attribute-list';
import { PropsCarAttributeInformation } from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/CarAttributeInformation.h';
import {
  CAR_INFO_SET_TRACK_CACHING,
} from 'components/monitor/info/car-info/redux/modules/car-info';
import CarMissions from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/car-missions/CarMissions';

const CarAttributeInformation: React.SFC<PropsCarAttributeInformation> = props => (
  <div>
    <div className="car_info_block tab-data">
      <div className="car_info-attributes" >
        {
          attributeList.map((attr) => {
            const value = attr.value(props);

            return (
              <div key={attr.title}>
                <span className="car_info-attr_title">{`${attr.title}: `}</span>
                {
                  !value && value !== null ?
                    <Preloader type="field" />
                  :
                    <span className="car_info-attr_value">{value || '-'}</span>
                }
              </div>
            )
          })
        }
      </div>
    </div>
    <CarMissions />
  </div>
)

const mapStateToProps = state => ({
  ...attributeList.reduce((newObj, attr) => {
    const { key } = attr;

    if (attr.carActualGpsNumberIndex) {
      newObj[key] = (state.monitorPage.carActualGpsNumberIndex[state.monitorPage.carInfo.gps_code] || { [key]: null})[key];
    }

    return newObj;
  }, {}),
  status: state.monitorPage.carInfo.status,
  lastPoint: state.loading.loadingTypes.includes(CAR_INFO_SET_TRACK_CACHING) || state.monitorPage.carInfo.trackCaching.track === -1 ? false : (state.monitorPage.carInfo.trackCaching.track.slice(-1)[0] || null),
})

export default connect(
  mapStateToProps,
)(CarAttributeInformation);

