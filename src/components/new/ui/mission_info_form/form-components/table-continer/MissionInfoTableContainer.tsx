import * as React from 'react';

import MissionReportByODH from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByODH';
import MissionReportByDT from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByDT';
import MissionReportByPoints from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByPoints';

type PropsMissionInfoTableContainer = {
  type: 'mixed' | 'simple_dt' | 'points';
  missionReport: Array<any>;
  handleSelectedElementChange: (id: number) => any;
};

const MissionInfoTableContainer: React.FC<PropsMissionInfoTableContainer> = React.memo(
  (props) => {
    const {
      type,
      missionReport,
      handleSelectedElementChange,
    } = props;

    return (
      <>
        {
          type === 'mixed' && (
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
          type === 'simple_dt' && (
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
          type === 'points' && (
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
  },
);

export default MissionInfoTableContainer;
