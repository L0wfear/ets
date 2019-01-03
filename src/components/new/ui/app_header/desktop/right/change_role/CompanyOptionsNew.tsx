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
const CompanyOptionsNewWrap = compose(
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
        COMPANY_OPTIONS: [
          ...currentUser.companies.map(({ asuods_id: value, name: label }) => ({ value, label })),
          { value: -1, label: 'Все организации' },
        ],
      };
    }

    handleChange = (company_id) => {
      const { currentUser: { company_id: company_id_old } } = this.props;
      const value = company_id === -1 ? null : company_id;

      if (value !== company_id_old) {
        this.context.flux.getActions('session').cahngeCompanyOnAnother(value)
          .then(({ payload, token }) => {
            this.props.sessionSetData({
              currentUser: payload,
              session: token,
            });

            if (!value) {
              if (this.props.location.pathname !== '/change-company') {
                this.props.history.push(this.props.currentUser.stableRedirect);
              }
            } else {
              this.props.history.push(`/${payload.default_path}`);
            }
          });
      }
    }

    render() {
      const {
        currentUser: {
          company_id,
        },
      } = this.props;
      const value = company_id === null ? -1 : company_id;

      return (
        <ReactSelect
          options={this.state.COMPANY_OPTIONS}
          value={value}
          onChange={this.handleChange}
          clearable={false}
          placeholder="Выберите организацию..."
        />
      )
    }
  }
);
/* tslint:enable */

export default CompanyOptionsNewWrap;
