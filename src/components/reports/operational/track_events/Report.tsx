import * as React from 'react';

import { IPropsMapModal } from 'components/reports/@types/MapModal.h';
import MapModalSCC from 'components/reports/MapModal';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import reportProps, { serviceUrl, renderers } from './reportProps';

const MapModal: React.ComponentClass<IPropsMapModal> = MapModalSCC;

interface IStateTrackEventReport {
  mapFormVisibility: boolean;
  coords: number[];
}

@exportable({
  entity: serviceUrl,
})
class TrackEventReport extends React.Component<{}, IStateTrackEventReport> {
  constructor(props) {
    super(props);
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
