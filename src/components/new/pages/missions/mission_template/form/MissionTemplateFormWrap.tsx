import * as React from 'react';

import { DivNone } from 'global-styled/global-styled';

import MissionTemplateCreatingFormLazy from './creating';
import MissionTemplateFormLazy from './template';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { WithFormRegistrySearchProps, withFormRegistrySearchNew, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

const MissionTemplateFormWrap: React.FC<WithFormRegistrySearchAddProps<MissionTemplate>> = React.memo(
  (props) => {
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
      if (props.type === buttonsTypes.missions_by_templates) {
        return (
          <MissionTemplateCreatingFormLazy
            missionTemplates={checkedRows}
            {...props}
            element={null}
          />
        );
      }
      const copyElement = React.useMemo(
        () => {
          if (props.type === buttonsTypes.create) {
            return {
              ...props.element,
              id: null,
            };
          }
          return props.element;
        },
        [props.element],
      );

      return (
        <MissionTemplateFormLazy
          {...props}
          element={copyElement}
        />
      );
    }

    return <DivNone />;
  },
);

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<MissionTemplate>, MissionTemplate>({
  add_path: 'mission_template',
})(MissionTemplateFormWrap);
