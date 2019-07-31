import * as React from 'react';

import { DivNone } from 'global-styled/global-styled';

import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import MissionTemplateCreatingFormLazy from './creating';
import MissionTemplateFormLazy from './template';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

const MissionTemplateFormWrap: React.FC<any> = (props) => {
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
    if (props.type === buttonsTypes.missions_by_templates) {
      return (
        <MissionTemplateCreatingFormLazy
          showForm
          element={props.element}
          onFormHide={props.onFormHide}
          missionTemplates={props.checkedRows}

          page={page}
          path={path}
        />
      );
    }
    if (props.type === buttonsTypes.copy_template) {
      const copyElement = React.useMemo(
        () => {
          const { id, ...elementData } = props.element;

          return elementData;
        },
        [props.element],
      );

      return (
        <MissionTemplateFormLazy
          showForm
          element={copyElement}
          onFormHide={props.onFormHide}

          page={page}
          path={path}
        />
      );
    }

    return (
      <MissionTemplateFormLazy
        showForm
        element={props.element}
        onFormHide={props.onFormHide}

        page={page}
        path={path}
      />
    );
  }

  return <DivNone />;
};

export default compose<any, any>(
  withFormRegistrySearch({}),
  connect<any, any, any, ReduxState>(
    (state, { registryKey }) => ({
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
  ),
)(MissionTemplateFormWrap);
