import * as React from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

@connectToStores(['loading'])
@FluxContext
class LoadingOverlay extends React.Component<any, any> {
  state = {
    show: true,
  };

  static getDerivedStateFromProps(nextProps) {
    const modals = document.getElementsByClassName('modal-body');
    const modalsSmall = document.getElementsByClassName('modal-sm');
    const showLoading
      = !(modals.length - modalsSmall.length) || !nextProps.main;

    return {
      show: showLoading,
    };
  }

  render() {
    const { flux } = this.context;
    const store = flux.getStore('loading');
    const storeIsLoading = store.isLoading();

    if (this.state.show) {
      if (storeIsLoading || this.props.isLoading) {
        return <PreloadNew typePreloader="mainpage" />;
      }
    }

    return <div style={{ display: 'none' }} />;
  }
}

export default LoadingOverlay;
