import * as React from 'react';
import { get } from 'lodash';

import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import CheckboxTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/CheckboxTdTitle';
import EnumeratedTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/EnumeratedTdTitle';
import IsOpenTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/IsOpenTdTitle';
import CloneTireTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/CloneTireTdTitle';
import ShowFileListTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ShowFileListTdTitle';
import ShowFileTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ShowFileTdTitle';
import ShowEdcCommentsTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ShowEdcCommentsTdTitle';
import ShowMissionInfoTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ShowMissionInfoTdTitle';
import CompanyStructureActionsTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/CompanyStructureActionsTdTitle';
import ServicesActionsOnOffTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ServicesActionsOnOffTdTitle';
import ServiceFilesTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ServiceFilesTdTitle';
import EdcRequestInfoTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/EdcRequestInfoTdTitle';
import DefaultTdTitle from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/DefaultTdTitle';
import { TypeFieldsAvalibaleKey } from 'components/new/ui/registry/module/@types/registry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import ShowCarOnMap from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/ShowCarOnMap';

type Props = CommontTdTiteProps;

const componentsByKey: Record<TypeFieldsAvalibaleKey<void>, React.ComponentType<CommontTdTiteProps>> = {
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
  edc_request_info: EdcRequestInfoTdTitle,
  showCarOnMap: ShowCarOnMap,
  files: ShowFileTdTitle,
};

const Td: React.FC<Omit<Props, 'id'>> = React.memo(
  (props) => {
    const {
      fieldMeta,
    } = props;

    const Component = componentsByKey[fieldMeta.key] || DefaultTdTitle;
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const uniqKeyForSelect = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForSelect);
    const key = uniqKeyForSelect || uniqKey;
    const groupOpt = get(fieldMeta, 'groupOpt', null);
    const groupColumn = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.groupColumn);
    const isActive = (
      groupOpt
        ? get(groupColumn, `${groupOpt.key}.isActive`, true) || groupOpt.firstElem
        : true
    );

    return (
      isActive
        && <Component
          id={`${props.registryKey}.${props.rowData[key]}.${props.indexRow}.${fieldMeta.key}`}
          key={props.fieldMeta.key}
          registryKey={props.registryKey}
          rowData={props.rowData}
          fieldMeta={props.fieldMeta}
          indexRow={props.indexRow}
        />
    );
  },
);

export default Td;
