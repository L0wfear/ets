import * as React from 'react';

import { DivNone } from 'global-styled/global-styled';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import ChangeRouteForm from './ChangeRouteForm';

type PropsChangeRouteFormLazy = any;

class ChangeRouteFormLazy extends React.Component<PropsChangeRouteFormLazy, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}car-form`;

    return (
      element
        ? (
          <ChangeRouteForm
            element={element}
            handleHide={props.onFormHide}

            registryKey={props.registryKey}
            page={page}
            path={path}
          />
        )
        : (
          <DivNone />
        )
    );
  }
}

export default withFormRegistrySearch({
  cantCreate: true,
  uniqKeyName: 'asuods_id',
})(ChangeRouteFormLazy);
