import * as React from 'react';

import { MapEtsConsumer } from 'components/map/context/MapetsContext';

const withMapInConsumer = (namesMapArr: string[] = []) => (Component) => (
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
