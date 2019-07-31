import * as React from 'react';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import reportProps, { serviceUrl, renderers } from 'components/old/reports/operational/track_events/reportProps';

import ReportFormWrap from 'components/old/reports/operational/track_events/form/ReportFormWrap';

interface IStateTrackEventReport {
  mapFormVisibility: boolean;
  coords: [number, number];
}
const exportableTSX: any = exportable;

@exportableTSX({
  entity: serviceUrl,
})
class TrackEventReport extends React.Component<{}, IStateTrackEventReport> {
  constructor(props) {
    super(props);
    this.state = {
      mapFormVisibility: false,
      coords: [0, 0],
    };
  }
  handleMapVisibility = (data) => {
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
        <ReportFormWrap
          showForm={this.state.mapFormVisibility}
          onFormHide={this.onMapFormHide}
          coords={this.state.coords}
        />
      </div>
    );
  }
}

export default TrackEventReport;
