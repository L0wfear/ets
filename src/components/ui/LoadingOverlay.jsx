import React from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import { connect } from 'react-redux';
import Preloader from 'components/ui/new/preloader/Preloader';

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
  (state) => state.loading
)
@connectToStores(['loading'])
@FluxContext
class LoadingOverlay extends React.Component {
  state = {
    show: true,
  };

  static getDerivedStateFromProps(nextProps) {
    const modals = document.getElementsByClassName('modal-body');
    const modalsSmall = document.getElementsByClassName('modal-sm');
    const showLoading = !(modals.length - modalsSmall.length) || !nextProps.main;

    return {
      show: showLoading,
    };
  }

  render() {
    const { flux } = this.context;
    const { isLoading } = this.props;
    const store = flux.getStore('loading');
    const storeIsLoading = store.isLoading();
    const storeIsLazyLoading = store.isLazyLoading();

    if (this.state.show) {
      if (storeIsLoading) {
        return <Preloader typePreloader="mainpage" />;
      } else if (!storeIsLoading && (isLoading || storeIsLazyLoading)) {
        return <Preloader typePreloader="lazy" />;
      }
    }

    return <div style={{ display: 'none' }} />;
  }
};

export default LoadingOverlay;
