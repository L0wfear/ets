import * as React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import GeoobjectData from 'components/monitor/new/info/geoobjects-info/GeoobjectData';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { monitorPageRemoveAllFromSelectedGeoobjects } from 'components/monitor/new/redux/models/actions-monitor-page';
import cx from 'classnames';

type PropsGeoobjectsInfo ={
  handleClickOnClose: any;
  centerOn: Function;

  showSelectedGeoobjects: boolean;
};

type StateGeoobjectsInfo = {

};

class GeoobjectsInfo extends React.Component<PropsGeoobjectsInfo, StateGeoobjectsInfo> {
  state = {
    shortVersion: false,
  }
  toggleShortVersion: any = () => {
    this.setState({
      shortVersion: !this.state.shortVersion,
    })
  }
  render() {
    const { shortVersion } = this.state;

    return (
      !this.props.showSelectedGeoobjects ?
      (
        <div className="none"></div>
      )
      :
      (
        <div className={cx('data_container-wrap', 'geoobjects_info', { 'map_info-hidden': shortVersion })}>
          {
            shortVersion ?
            (
              <div className="none"></div>
            )
            :
            (
              <div className="data_container geoobjects_info">
                <div className="map_info-title_container geoobject_title">
                  <div className=" car_info-gov_number">
                    <div className="car_info_block">
                      <span>Список выбранных геообъектов</span>
                    </div>
                  </div>
                  <div className="car_info-close">
                    <div className="car_info_block" onClick={this.props.handleClickOnClose}>
                      <span>x</span>
                    </div>
                  </div>
                </div>
                <div>
                  {
                    Object.values(GEOOBJECTS_OBJ).map(({ serverName }) => (
                      <GeoobjectData key={serverName} serverName={serverName} centerOn={this.props.centerOn} />
                    ))
                  }
                </div>
              </div>
            )
          }
          <div className="data_container-make-small" onClick={this.toggleShortVersion}>
            <Button title={`${shortVersion ? 'Показать' : 'Скрыть'} выбранные геообъекты`}>{shortVersion ? '<<' : '>>'}</Button>
          </div>
        </div>

      )
    )
  }
};

const mapStateToProps = state => ({
  showSelectedGeoobjects: Object.values(state.monitorPage.selectedGeoobjects).some((dataObj) => (
    Object.values(dataObj).some(({ front_show }) => front_show)
  )),
});

const mapDispatchToProps = dispatch => ({
  handleClickOnClose: () => dispatch(
    monitorPageRemoveAllFromSelectedGeoobjects(),
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(GeoobjectsInfo);
