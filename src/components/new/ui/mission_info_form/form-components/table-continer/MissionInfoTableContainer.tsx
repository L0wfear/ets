import * as React from 'react';

import MissionReportByODH from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByODH';
import MissionReportByDT from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByDT';
import MissionReportByPoints from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByPoints';
import { DivNone } from 'global-styled/global-styled';

import { PropsMissionInfoTableContainer } from 'components/new/ui/mission_info_form/form-components/table-continer/MissionInfoTableContainer.h';

class MissionInfoTableContainer extends React.PureComponent<PropsMissionInfoTableContainer, {}> {
  render() {
    const {
      type,
      missionReport,
      handleSelectedElementChange,
    } = this.props;

    return (
      <>
        {
          type !== 'mixed' ?
          ( <DivNone /> )
          :
          (
            <MissionReportByODH
              renderOnly
              enumerated={false}
              selectedReportDataODHS={missionReport}
              selectField={'object_id'}
              onElementChange={handleSelectedElementChange}
              normInitialData
            />
          )
        }
        {
          type !== 'simple_dt' ?
          ( <DivNone /> )
          :
          (
            <MissionReportByDT
              renderOnly
              enumerated={false}
              selectedReportDataDTS={missionReport}
              selectField={'object_id'}
              onElementChange={handleSelectedElementChange}
              normInitialData
            />
          )
        }
        {
          type !== 'points' ?
          ( <DivNone /> )
          :
          (
            <MissionReportByPoints
              renderOnly
              enumerated={false}
              selectedReportDataPoints={missionReport}
              selectField={'frontIndex'}
              onElementChange={handleSelectedElementChange}
              normInitialData
            />
          )
        }
      </>
    );
  }
}

export default MissionInfoTableContainer;
