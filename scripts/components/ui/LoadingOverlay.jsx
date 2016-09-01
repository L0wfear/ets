import React from 'react';
import Preloader from './Preloader.jsx';
import { connectToStores, FluxContext } from 'utils/decorators';
import { connect } from 'react-redux';

@connect(
  state => state.loading
)
@connectToStores(['loading'])
@FluxContext
export default class LoadingOverlay extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { flux } = this.context;
    const { isLoading } = this.props;
    const store = flux.getStore('loading');
    const storeIsLoading = store.isLoading();
    const display = storeIsLoading || isLoading ? 'block' : 'none';

    return (
      <div className="gost-loading-overlay" style={{ display }}>
        <Preloader type="mainpage" visible={isLoading}/>
      </div>
    );
  }

}
