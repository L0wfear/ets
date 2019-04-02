import * as React from 'react';

import Data from 'components/new/ui/registry/components/data/Data';

import {
  EtsRegistry,
} from 'components/new/ui/registry/components/styled/styled';

type PropsRegistry = {
  registryKey: string;
  components?: any;
  handleClickOnRow?: any;
  handleDoubleClickOnRow?: any;
  formSetFormState?: (object) => void;
};

type StateRegistry = {
};

class Registry extends React.PureComponent<PropsRegistry, StateRegistry> {
  render() {
    const { props } = this;

    const {
      registryKey,
    } = props;

    return (
      <EtsRegistry>
        <Data
          registryKey={registryKey}
          handleClickOnRow={props.handleClickOnRow}
          handleDoubleClickOnRow={props.handleDoubleClickOnRow}
        />
      </EtsRegistry>
    );
  }
}

export default Registry;
