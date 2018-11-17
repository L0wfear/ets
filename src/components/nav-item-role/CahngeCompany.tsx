import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { connectToStores, FluxContext } from 'utils/decorators';

import CompanyOptions from 'components/nav-item-role/CompanyOptions';
import requireAuth from 'utils/auth';

@connectToStores(['session'])
@FluxContext
class CahngeCompany extends React.Component<any, any> {
  context!: ETSCore.LegacyContext;

  render() {
    if (!this.props.isGlavControl) {
      return <Redirect to={requireAuth(this.context.flux, '/monitor')} />;
    }
    return (
      <div className={'company-switcher-big'}>
        <span className={'company-switcher-big-label'}>Выберите организацию</span>
        <CompanyOptions />
      </div>
    );
  }
}

export default CahngeCompany;
