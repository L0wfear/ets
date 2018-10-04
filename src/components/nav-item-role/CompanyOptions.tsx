import * as React from 'react';
import { connect } from 'react-redux';

import {
  sessionSetData,
} from 'redux/modules/session/actions-session';
import { connectToStores, FluxContext } from 'utils/decorators';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import { withRouter } from 'react-router-dom';

@withRouter
@connect(
  null,
  dispatch => ({
    sessionSetData: props => dispatch(sessionSetData(props)),
  }),
)
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
    const { currentUser: { company_id_old } } = this.props;

    if (company_id !== company_id_old) {
      this.context.flux.getActions('session').cahngeCompanyOnAnother(company_id)
        .then(({ payload, token }) => {
          this.props.sessionSetData({
            currentUser: payload,
            session: token,
          });

          this.props.history.push(`/${payload.default_path}`);
        });
    }
  }

  render() {
    return (
      <ReactSelect
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
