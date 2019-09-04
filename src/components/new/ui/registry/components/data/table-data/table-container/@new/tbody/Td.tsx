import * as React from 'react';

import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import CheckboxTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/CheckboxTdTitle';
import EnumeratedTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/EnumeratedTdTitle';
import IsOpenTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/IsOpenTdTitle';
import CloneTireTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/CloneTireTdTitle';
import ShowFileListTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ShowFileListTdTitle';
import ShowEdcCommentsTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ShowEdcCommentsTdTitle';
import ShowMissionInfoTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ShowMissionInfoTdTitle';
import CompanyStructureActionsTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/CompanyStructureActionsTdTitle';
import ServicesActionsOnOffTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ServicesActionsOnOffTdTitle';
import ServiceFilesTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ServiceFilesTdTitle';
import ButtonShowActionLogTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ButtonShowActionLogTdTitle';
import EdcRequestInfoTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/EdcRequestInfoTdTitle';
import DefaultTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/DefaultTdTitle';

type Props = CommontTdTiteProps;

const componentsByKey: Record<string, React.ComponentType<CommontTdTiteProps>> = {
  checkbox: CheckboxTdTitle,
  enumerated: EnumeratedTdTitle,
  is_open: IsOpenTdTitle,
  buttonCloneTire: CloneTireTdTitle,
  show_file_list: ShowFileListTdTitle,
  show_edc_comments: ShowEdcCommentsTdTitle,
  showMissionInfo: ShowMissionInfoTdTitle,
  company_structure_actions: CompanyStructureActionsTdTitle,
  services_actions_on_off: ServicesActionsOnOffTdTitle,
  service_files: ServiceFilesTdTitle,
  button_show_action_log: ButtonShowActionLogTdTitle,
  edc_request_info: EdcRequestInfoTdTitle,
};

const Td: React.FC<Props> = React.memo(
  (props) => {
    const {
      rowData,
      fieldMeta,
    } = props;

    const Component = componentsByKey[fieldMeta.key] || DefaultTdTitle;

    return React.useMemo(
      () => (
        <Component
          key={props.fieldMeta.key}
          registryKey={props.registryKey}
          rowData={props.rowData}
          fieldMeta={props.fieldMeta}
          indexRow={props.indexRow}
        />
      ),
      [props.registryKey, fieldMeta, rowData, props.indexRow],
    );
  },
);

export default Td;
