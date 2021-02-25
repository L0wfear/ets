import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import TechInspectionFormLazy from 'components/new/pages/nsi/autobase/pages/tech_inspection/form';
import {
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {};

const registryKey = 'techInspectionArchiveRegistry';

const TechInspectionArchiveList: React.FC<Props> = () => {
  const dispatch = etsUseDispatch();
  React.useEffect(
    () => {
      dispatch(registryAddInitialData(getToConfig(null, true, 'Архив техосмотров', registryKey)));
      return () => {
        dispatch(registryRemoveData(registryKey));
      };
    },
    [],
  );

  return (
    <Registry registryKey={registryKey}>
      <TechInspectionFormLazy registryKey={registryKey} />
    </Registry>
  );
};

export default TechInspectionArchiveList;
