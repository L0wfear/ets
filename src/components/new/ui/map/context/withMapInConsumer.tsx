import * as React from 'react';

import { MapEtsConsumer } from 'components/new/ui/map/context/MapetsContext';

const withMapInConsumer = (namesMapArr: Array<string> = []) => (Component) => (
  class MapInConsumerWrap extends React.PureComponent<any, any> {
    render() {
      return (
        <MapEtsConsumer>
          {
            ({ mapByKeys, getMapImageInBase64ByKey }) => (
              <Component
                {...this.props}
                getMapImageInBase64ByKey={getMapImageInBase64ByKey}
                {...namesMapArr.reduce((newObj, name) => {
                  newObj[name] = mapByKeys[name];

                  return newObj;
                }, {})}
              />
            )
          }
        </MapEtsConsumer>
      );
    }
  }
);

export default withMapInConsumer;
