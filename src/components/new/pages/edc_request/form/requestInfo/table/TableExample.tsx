import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  // getConfig,
} from 'components/new/pages/edc_request/form/requestInfo/table/_config_data/registry-config';

const TableExample: React.FC<any> = React.memo(
  (props) => {
    /*
      React.useEffect(
        () => {
          props.registryAddInitialData(getConfig(props.edcRequestInfo.missions));

          return () => {
            props.registryRemoveData(registryKey);
          };
        },
        [propa.array],
      );
    */

    return (
      <React.Fragment>
        <div>ещё текст</div>
        <Registry registryKey={`${registryKey}_${props.index}`} ></Registry>
      </React.Fragment>
    );
  },
);

export default TableExample;
