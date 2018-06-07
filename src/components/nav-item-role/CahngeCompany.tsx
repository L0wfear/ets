import * as React from 'react';
import { connectToStores } from 'utils/decorators';
import CompanyOptions from 'components/nav-item-role/CompanyOptions';

@connectToStores(['session'])
class CahngeCompany extends React.Component<any, any> {
  render() {
    return (
      <div className={'company-switcher-big'}>
        <span className={'company-switcher-big-label'}>Выберите организацию</span>
        <CompanyOptions {...this.props} />
      </div>
    )
  }
}

export default CahngeCompany;
