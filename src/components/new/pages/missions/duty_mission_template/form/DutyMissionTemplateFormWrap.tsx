import * as React from 'react';

import { DivNone } from 'global-styled/global-styled';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import DutyMissionTemplateCreatingFormLazy from './creating';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import DutyMissionTemplateFormLazy from './template';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

const DutyMissionTemplateFormWrap: React.FC<any> = (props) => {
  const page = props.registryKey;
  const path = `${props.path ? `${props.path}-` : ''}odh-form`;

  React.useEffect(
    () => {
      if (props.type && !buttonsTypes[props.type]) {
        props.onFormHide(false);
      }
    },
    [props.type],
  );

  if (props.element) {
    if (props.type === buttonsTypes.duty_missions_by_templates) {
      return (
        <DutyMissionTemplateCreatingFormLazy
          showForm
          element={props.element}
          onFormHide={props.onFormHide}
          dutyMissionTemplates={props.checkedRows}

          page={page}
          path={path}
        />
      );
    } else {
      return (
        <DutyMissionTemplateFormLazy
          showForm
          element={props.element}
          onFormHide={props.onFormHide}

          page={page}
          path={path}
        />
      );
    }
  }

  return <DivNone />;
};

export default compose<any, any>(
  connect<any, any, any, any, ReduxState>(
    (state, { registryKey }) => ({
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    null,
    null,
    {
      pure: false,
    },
  ),
  withFormRegistrySearch,
)(DutyMissionTemplateFormWrap);
