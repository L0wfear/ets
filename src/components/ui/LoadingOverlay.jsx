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
    const storeIsLazyLoading = store.isLazyLoading();

    if (storeIsLoading) {
      return <Preloader type="mainpage" />
    } else if (!storeIsLoading && (isLoading || storeIsLazyLoading)) {
      return <Preloader type="field" />
    } else {
      return <div style={{display: 'none'}}/>
    }
  }
}
