import * as React from 'react';
import { connectToStores, FluxContext } from 'utils/decorators';
import EtsSelect from 'components/ui/input/EtsSelect';
import { withRouter } from 'react-router-dom';

@withRouter
@connectToStores(['session'])
@FluxContext
class CompanyOptions extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const { currentUser } = props;

    this.state = {
      companies: currentUser.companies,
      company_id: currentUser.company_id || -1,
      COMPANY_OPTIONS: [
        ...currentUser.companies.map(({ asuods_id: value, name: label }) => ({ value, label })),
        { value: -1, label: 'Папка' },
      ],
    };
  }

  componentWillReceiveProps(props) {
    const { currentUser: { companies } } = props;

    const changesState: any = {};
    if (this.state.companies !== companies) {
      changesState.companies = companies;
      changesState.COMPANY_OPTIONS = [
        ...companies.map(({ asuods_id: value, name: label }) => ({ value, label })),
        { value: -1, label: 'Папка' },
      ]
    }

    this.setState(changesState);
  }
  handleChange = (company_id) => {
    if (company_id !== this.state.company_id) {
      this.context.flux.getActions('session').cahngeCompanyOnAnother(company_id === -1 ? null : company_id)
        .then(() => this.props.history.push(`/monitor`));
      this.setState({ company_id });
    }
  }

  render() {
    const {
      company_id,
      COMPANY_OPTIONS,
    } = this.state;

    return (
      <EtsSelect
        options={COMPANY_OPTIONS}
        value={company_id}
        onChange={this.handleChange}
        clearable={false}
      />
    )
  }
}

export default CompanyOptions;
