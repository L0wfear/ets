import * as React from 'react';

import { DivNone } from 'global-styled/global-styled';

import DutyMissionTemplateCreatingFormLazy from './creating';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import DutyMissionTemplateFormLazy from './template';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';

const DutyMissionTemplateFormWrap: React.FC<WithFormRegistrySearchAddProps<DutyMissionTemplate>> = (props) => {
  const checkedRows = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.checkedRows);

  React.useEffect(
    () => {
      if (props.type && !buttonsTypes[props.type]) {
        props.handleHide(false);
      }
    },
    [props.type],
  );

  if (props.element) {
    if (props.type === buttonsTypes.duty_missions_by_templates) {
      return (
        <DutyMissionTemplateCreatingFormLazy
          dutyMissionTemplates={checkedRows}
          {...props}
          element={null}
        />
      );
    } else {
      return (
        <DutyMissionTemplateFormLazy
          {...props}
        />
      );
    }
  }

  return <DivNone />;
};

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<DutyMissionTemplate>, DutyMissionTemplate>({
  add_path: 'duty_mission_template',
})(DutyMissionTemplateFormWrap);
