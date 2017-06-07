import * as React from 'react';

import MapModal from 'components/reports/MapModal.jsx';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import reportProps, { serviceUrl, renderers } from './reportProps';

interface IStateTrackEventReport {
  mapFormVisibility: boolean;
  coords: number[];
}

@exportable({
  entity: serviceUrl,
})
class TrackEventReport extends React.Component<{}, IStateTrackEventReport> {
  constructor() {
    super();
    this.state = {
      mapFormVisibility: false,
      coords: [],
    };
  }
  handleMapVisibility = data => {
    const [y, x] = data.split(', ');

    this.setState({
      coords: [x, y],
      mapFormVisibility: true,
    });
  }
  onMapFormHide = () => {
    this.setState({
      mapFormVisibility: false,
    });
  }
  render() {
    return (
      <div>
        <ReportContainer
          {...reportProps}
          renderers={renderers(this.handleMapVisibility)}
          {...this.props}
        />
        <MapModal
          coords={this.state.coords}
          showForm={this.state.mapFormVisibility}
          onFormHide={this.onMapFormHide}
        />
      </div>
    );
  }
}

export default TrackEventReport;
