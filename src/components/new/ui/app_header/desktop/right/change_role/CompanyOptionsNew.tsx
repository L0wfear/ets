import * as React from 'react';
import { connect } from 'react-redux';

import {
  sessionCahngeCompanyOnAnother,
} from 'redux-main/reducers/modules/session/actions-session';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';

import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { getSessionState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

class CompanyOptionsNew extends React.Component<any, any> {
  context!: ETSCore.LegacyContext;

  constructor(props) {
    super(props);
    const { userData } = props;

    this.state = {
      companies: userData.companies,
      COMPANY_OPTIONS: [
        ...userData.companies.map(({ asuods_id: value, name: label }) => ({ value, label })),
        { value: -1, label: 'Все организации' },
      ],
    };
  }

  handleChange = async (company_id) => {
    const { userData: { company_id: company_id_old } } = this.props;
    const value = company_id === -1 ? null : company_id;

    if (value !== company_id_old) {
      try {
        const {
          userData,
        } = await this.props.sessionCahngeCompanyOnAnother(value);

        if (!value) {
          if (this.props.location.pathname !== '/change-company') {
            this.props.history.push(userData.stableRedirect);
          }
        } else {
          this.props.history.push(userData.stableRedirect);
        }
      } catch (e) {
        console.warn(e); // tslint:disable-line
      }
    }
  };

  render() {
    const {
      userData: {
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
    );
  }
}

export default compose<any, any>(
  withSearch,
  connect<any, any, any, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      sessionCahngeCompanyOnAnother: (company_id) => (
        dispatch(
          sessionCahngeCompanyOnAnother(
            company_id,
            { page: 'main' },
          ),
        )
      ),
    }),
  ),
)(CompanyOptionsNew);
