import * as React from 'react';
import { connectToStores, FluxContext, HistoryContext } from 'utils/decorators';
import EtsSelect from 'components/ui/input/EtsSelect';

@HistoryContext
@connectToStores(['session'])
@FluxContext
class CompanyOptions extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const { currentUser } = props;

    this.state = {
      companies: currentUser.companies,
      COMPANY_OPTIONS: currentUser.companies.map(({ asuods_id: value, name: label }) => ({ value, label })),
    };
  }

  handleChange = (company_id) => {
    const {
      currentUser: { company_id_old },
      location: { pathname },
    } = this.props;

    if (company_id !== company_id_old) {
      this.props.history.pushState(null, '/change-company');

      this.context.flux.getActions('session').cahngeCompanyOnAnother(company_id)
        .then(() => this.props.history.pushState(null, pathname))
    }
  }

  render() {
    return (
      <EtsSelect
        options={this.state.COMPANY_OPTIONS}
        value={this.props.currentUser.company_id}
        onChange={this.handleChange}
        clearable={false}
        placeholder="Выберите организацию..."
      />
    )
  }
}

export default CompanyOptions;
