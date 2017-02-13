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

  componentDidUpdate() {
    const modals = document.getElementsByClassName('modal-body');
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay || !modals.length) return;
    const style = overlay.style;
    const rect = modals[0].getBoundingClientRect();
    style.position = 'fixed';
    style.left = `${rect.left}px`;
    style.right = `${rect.right}px`;
    style.top = `${rect.top}px`;
    style.bottom = `${rect.bottom}px`;
    style.width = `${rect.width}px`;
    style.height = `${rect.height}px`;
  }

  render() {
    const { flux } = this.context;
    const { isLoading } = this.props;
    const store = flux.getStore('loading');
    const storeIsLoading = store.isLoading();
    const storeIsLazyLoading = store.isLazyLoading();

    if (storeIsLoading) {
      return <Preloader type="mainpage" />;
    } else if (!storeIsLoading && (isLoading || storeIsLazyLoading)) {
      return <Preloader type="lazy" />;
    }
    return <div style={{ display: 'none' }} />;
  }
}
