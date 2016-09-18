import React from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import { connect } from 'react-redux';
import Preloader from './Preloader.jsx';

@connect(
  state => state.loading
)
@connectToStores(['loading'])
@FluxContext
export default class LoadingOverlay extends React.Component {
  render() {
    const { flux } = this.context;
    const { isLoading } = this.props;
    const store = flux.getStore('loading');
    const storeIsLoading = store.isLoading();
    const display = storeIsLoading || isLoading ? 'block' : 'none';

    return (
      <div className="gost-loading-overlay" style={{ display }}>
        <Preloader type="mainpage" visible={isLoading} />
      </div>
    );
  }
}
