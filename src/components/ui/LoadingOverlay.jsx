import React from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import { connect } from 'react-redux';
import Preloader from './Preloader.jsx';

export const loadingOverlay = Cmp => @FluxContext class LoadingOverlayHOC extends React.Component {
  handleOverlayLoading = (isLoading) => {
    const loadingStore = this.context.flux.getStore('loading');

    if (isLoading) {
      loadingStore.inc();
    } else {
      loadingStore.dec();
    }
  }
  render() {
    return (
      <Cmp
        {...this.props}
        onOverlayLoading={this.handleOverlayLoading}
      >
        {this.props.children}
      </Cmp>
    );
  }
};

@connect(
  state => state.loading
)
@connectToStores(['loading'])
@FluxContext
export default class LoadingOverlay extends React.Component {

  state = {
    show: true,
  }

  componentWillReceiveProps(nextProps) {
    const modals = document.getElementsByClassName('modal-body');
    this.setState({ show: !modals.length || !nextProps.main });
  }

  render() {
    const { flux } = this.context;
    const { isLoading } = this.props;
    const { show } = this.state;
    const store = flux.getStore('loading');
    const storeIsLoading = store.isLoading();
    const storeIsLazyLoading = store.isLazyLoading();
    if (storeIsLoading && show) {
      return <Preloader type="mainpage" />;
    } else if (!storeIsLoading && (isLoading || storeIsLazyLoading) && show) {
      return <Preloader type="lazy" />;
    }
    return <div style={{ display: 'none' }} />;
  }
}
