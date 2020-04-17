import * as React from 'react';

import MissionReportByODH from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByODH';
import MissionReportByDT from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByDT';
import MissionReportByPoints from 'components/new/ui/mission_info_form/form-components/table-continer/table_by_route_type/MissionReportByPoints';
import { MissionReportEntriesWithoutWork } from './table_by_route_type/MissionReportWithoutWork';

export const VALUE_FOR_FIXED = {
  TWO_F: {
    val: 2,
    list: ['кв. м.', 'м.'],
    type: 'floatFixed',
  },
  THREE_F: {
    val: 3,
    list: ['км'],
    type: 'floatFixed',
  },
  TEN_I: {
    val: 10,
    list: ['раз'],
    type: 'intFixed',
    another: {
      val: 2,
      type: 'floatFixed',
    },
  },
  floatFixed: (data, val) => parseFloat(data).toFixed(val),
  intFixed: (data, val) => parseInt(data, val),
};

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

    const selectedReportData = React.useMemo(
      () => missionReport.filter((elem) => !elem.is_without_work),
      [props.missionReport]
    );
    const selectedReportDataWithoutWork = React.useMemo(
      () => missionReport.filter((elem) => elem.is_without_work),
      [props.missionReport]
    );

    return (
      <>
        {
          type === 'mixed' && (
            <React.Fragment>
              <MissionReportByODH
                renderOnly
                enumerated={false}
                selectedReportDataODHS={selectedReportData}
                selectField={'object_id'}
                onElementChange={handleSelectedElementChange}
                normInitialData
              />
            </React.Fragment>
            
          )
        }
        {
          type === 'simple_dt' && (
            <MissionReportByDT
              renderOnly
              enumerated={false}
              selectedReportDataDTS={selectedReportData}
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
              selectedReportDataPoints={selectedReportData}
              selectField={'frontIndex'}
              onElementChange={handleSelectedElementChange}
              normInitialData
            />
          )
        }
        {
          type === 'mixed' || type === 'simple_dt'  && (
            <MissionReportEntriesWithoutWork
              renderOnly
              enumerated={false}
              selectedReportDataWithoutWork={selectedReportDataWithoutWork}
              selectField={'object_id'}
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
