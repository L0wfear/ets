import * as React from 'react';
import { getInspectionCarsConditionDataRegistryConfig } from './components/registry/config';
import InspectionData from '../../../common_components/data/InspectionData';
import { get } from 'lodash';
import LineDataCarsConditionConditionLast from './add_to_render_data/LineDataCarsConditionConditionLast';

const makePayloadToCreateInspect = (searchState: object) => {
  const monitoring_kind = get(searchState, 'monitoringKind', null);
  const checks_period = get(searchState, 'checksPeriod', null);
  const checks_type = get(searchState, 'checksType', null);

  const payload: any = {};

  if (monitoring_kind) {
    payload.monitoring_kind = monitoring_kind;
  }
  if (checks_period) {
    payload.checks_period = checks_period;
  }
  if (checks_type) {
    payload.checks_type = checks_type;
  }

  return payload;
};

const InspectionCarsConditionData: React.FC<{ loadingPage: string; }> = (props) => {
  return (
    <InspectionData
      loadingPage={props.loadingPage}
      triggerKey="companyId"
      type="cars_condition"
      makePayloadToCreateInspect={makePayloadToCreateInspect}
      getRegistryFunc={getInspectionCarsConditionDataRegistryConfig}
      LineDataCarsLast={<LineDataCarsConditionConditionLast loadingPage={props.loadingPage} />}
    />
  );
};

export default InspectionCarsConditionData;
