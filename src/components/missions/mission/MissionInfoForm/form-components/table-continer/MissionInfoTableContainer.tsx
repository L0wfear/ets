import * as React from 'react';

import MissionReportByODH from 'components/reports/operational/mission/MissionReportByODH';
import MissionReportByDT from 'components/reports/operational/mission/MissionReportByDT';
import MissionReportByPoints from 'components/reports/operational/mission/MissionReportByPoints';
import { DivNone } from 'global-styled/global-styled';

import { PropsMissionInfoTableContainer } from 'components/missions/mission/MissionInfoForm/form-components/table-continer/MissionInfoTableContainer.h';

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
