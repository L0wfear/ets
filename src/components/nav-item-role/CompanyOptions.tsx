import * as React from 'react';
import { connect } from 'react-redux';

import {
  sessionSetData,
} from 'redux-main/reducers/modules/session/actions-session';
import { connectToStores, FluxContext } from 'utils/decorators';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import { withRouter } from 'react-router-dom';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';


/* tslint:disable */
const CompanyOptionsWrap = compose(
  withRouter,
  connect<any, any, any, ReduxState>(
    null,
    dispatch => ({
      sessionSetData: props => dispatch(sessionSetData(props)),
    }),
  )
)(
  @connectToStores(['session'])
  @FluxContext
  class extends React.Component<any, any> {
    context!: ETSCore.LegacyContext;

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
);
/* tslint:enable */

export default CompanyOptionsWrap;
