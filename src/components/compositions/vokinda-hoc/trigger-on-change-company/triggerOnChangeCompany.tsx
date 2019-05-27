import * as React from 'react';
import PreloadNew from 'components/ui/new/preloader/PreloadNew';

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';

const triggerOnChangeCompany = (Component) => (
  connect<any, any, any, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
  )(
    class extends React.Component<any, any> {
      constructor(props) {
        super(props);

        this.state = {
          company_id: props.userData.company_id,
          loading: false,
        };
      }
      componentDidUpdate() {
        const { userData: { company_id } } = this.props;
        if (company_id !== this.state.company_id) {
          this.changeStatusLoading(true, company_id);
        }
      }

      changeStatusLoading = (loading, company_id) => {
        setTimeout(() =>
          this.setState({
            loading,
            company_id,
          }),
          loading ? 50 : 100,
        );
        if (loading) {
          this.changeStatusLoading(false, company_id);
        }
      }

      render() {
        if (this.state.loading) {
          return <PreloadNew typePreloader="mainpage" />;
        }

        return (
          <Component {...this.props} />
        );
      }
    },
  )
);

export default triggerOnChangeCompany;
