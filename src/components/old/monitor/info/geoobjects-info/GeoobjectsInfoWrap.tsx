import * as React from 'react';
import { connect } from 'react-redux';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';

import {
  DivNone,
} from 'global-styled/global-styled';

type PropsGeoobjectsInfo = {
  centerOn: any;
  showSelectedGeoobjects: boolean;
};

type StateGeoobjectsInfo = {
};

const GeoobjectsInfo = React.lazy(() => (
  import(/* webpackChunkName: "geoobjects_info" */ 'components/old/monitor/info/geoobjects-info/GeoobjectsInfo')
));

class GeoobjectsInfoWrap extends React.PureComponent<PropsGeoobjectsInfo, StateGeoobjectsInfo> {
  state = {
    shortVersion: false,
  };
  toggleShortVersion: any = () => {
    this.setState({
      shortVersion: !this.state.shortVersion,
    });
  }
  render() {
    return (
      !this.props.showSelectedGeoobjects
      ? (
        <DivNone />
      )
      : (
        <React.Suspense fallback={<LoadingComponent />}>
          <GeoobjectsInfo
            centerOn={this.props.centerOn}
          />
        </React.Suspense>
      )
    );
  }
}

const mapStateToProps = (state) => ({
  showSelectedGeoobjects: Object.values(state.monitorPage.selectedGeoobjects).some((dataObj) => (
    Object.values(dataObj).some(({ front_show }) => front_show)
  )),
});

export default connect(
  mapStateToProps,
)(GeoobjectsInfoWrap);
