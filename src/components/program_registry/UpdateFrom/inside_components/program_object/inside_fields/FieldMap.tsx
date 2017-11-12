import * as React from 'react';

import { FluxContext } from 'utils/decorators';

import PolyMap from 'components/map/PolyMap.jsx';
import DrawMap from 'components/map/DrawMap.jsx';

const PolyMapTSX: any = PolyMap;
const DrawMapTSX: any = DrawMap;

@FluxContext
class MapField extends React.Component<any, any> {
  constructor(props, context) {
    super(props);

    const sessionStore = context.flux.getStore('session');

    this.state = {
      zoom: sessionStore.getCurrentUser().getCompanyMapConfig().zoom,
      center: sessionStore.getCurrentUser().getCompanyMapConfig().coordinates,
    };
  }
  onFeatureClick = () => {
    // click
  }
  onPointAdd = () => {

  }
  onDrawFeatureAdd = () => {

  }
  onDrawFeatureClick = () => {

  }
  removeLastDrawFeature = () => {

  }
  
  render() {
    const {
      state: {
        polys = {},
      },
      manualDraw,
    } = this.props;
    const { manual } = this.state;

    const Map = manual ? DrawMapTSX : PolyMapTSX;

    return (
      <div className="object-tab-plan">
        <Map
          onFeatureClick={this.onFeatureClick}
          zoom={this.state.zoom}
          center={this.state.center}
          polys={polys}
          manualDraw={manualDraw}
          onPointAdd={this.onPointAdd}
          onDrawFeatureAdd={this.onDrawFeatureAdd}
          onDrawFeatureClick={this.onDrawFeatureClick}
          removeLastDrawFeature={this.removeLastDrawFeature}
          object_list={{}}
          draw_object_list={[]}
        />
      </div>
    );
  }
}

export default MapField;
