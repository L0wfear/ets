import React from 'react';
import Preloader from './Preloader.jsx';
import { connectToStores, FluxContext } from 'utils/decorators';

@connectToStores(['loading'])
@FluxContext
export default class LoadingOverlay extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { flux } = this.context;
    const store = flux.getStore('loading');
    const isLoading = store.isLoading();
    const display = isLoading ? 'block' : 'none';

    return (
      <div className="gost-loading-overlay" style={{ display }}>
        <Preloader type="mainpage" visible={isLoading}/>
      </div>
    );
  }

}
