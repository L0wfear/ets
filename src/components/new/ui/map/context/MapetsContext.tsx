import * as React from 'react';
import { StateMapEtsProvider } from 'components/new/ui/map/context/MapetsContext.h';
import { resizeBase64 } from 'utils/functions';

const defaultState: StateMapEtsProvider = {
  mapByKeys: {},
  setMapToContext: (key, map) => null,
  removeMapToContext: (key) => null,
  getMapImageInBase64ByKey: (key) => Promise.reject('no override func'),
};

const MapEtsContext = React.createContext<StateMapEtsProvider>(defaultState);

export const MapEtsConsumer = MapEtsContext.Consumer;

export class MapEtsProvider extends React.Component<{}, StateMapEtsProvider> {
  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
      mapByKeys: {},
      setMapToContext: this.setMapToContext,
      removeMapToContext: this.removeMapToContext,
      getMapImageInBase64ByKey: this.getMapImageInBase64ByKey,
    };
  }

  setMapToContext = (key: string, map: ol.Map) => {
    setTimeout(() => {
      console.log('SET MAP INTO CONTEXT', key); // tslint:disable-line:no-console

      this.setState({
        mapByKeys: {
          ...this.state.mapByKeys,
          [key]: map,
        },
      });
    }, 100);
  }

  removeMapToContext = (key: string) => {
    console.log('REMOVE MAP FROM CONTEXT', key); // tslint:disable-line:no-console

    const { mapByKeys: { ...mapByKeys } } = this.state;

    delete mapByKeys[key];

    this.setState({ mapByKeys });
  }

  getMapImageInBase64ByKey = (key: string) => {
    return new Promise((res, rej) => {
      const { mapByKeys: { [key]: map } } = this.state;

      if (map) {
        map.once('postcompose', (event) => {
          resizeBase64((event as any).context.canvas.toDataURL('image/png'))
            .then((imageObj) => res(imageObj));
        });
        map.render();
      } else {
        rej(new Error(`not gind map by key = ${key}`));
      }
    });
  }

  render() {
    return (
      <MapEtsContext.Provider value={this.state}>
      { this.props.children }
      </MapEtsContext.Provider>
    );
  }
}
