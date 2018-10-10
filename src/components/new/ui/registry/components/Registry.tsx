import * as React from 'react';

import Data from 'components/new/ui/registry/components/data/Data';

type PropsRegistry = {
  registryKey: string;
};

type StateRegistry = {
};

class Registry extends React.Component<PropsRegistry, StateRegistry> {
  render() {
    const { registryKey } = this.props;

    return (
      <div className="ets_registry">
        <Data registryKey={registryKey} />
      </div>
    );
  }
}

export default Registry;
