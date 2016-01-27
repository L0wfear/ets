import React from 'react';
import connectToStores from 'flummox/connect';
import Preloader from './ui/Preloader.jsx';

class LoadingOverlay extends React.Component {

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

LoadingOverlay.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(LoadingOverlay, ['loading']);
