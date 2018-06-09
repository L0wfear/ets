import * as React from 'react';
import connectToStores from 'flummox/connect';
import Preloader from 'components/ui/Preloader.jsx';

const triggerOnChangeCompany = Component =>
  connectToStores(class extends React.Component<any, any> {
    constructor(props) {
      super(props);

      this.state = {
        company_id: props.currentUser.company_id,
        loading: false,
      };
    }

    componentWillReceiveProps(props) {
      const { currentUser: { company_id } } = props;
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
        return <Preloader type="mainpage" />;;
      }

      return (
        <Component {...this.props} />
      )
    }
  },
  ['session']
)

export default triggerOnChangeCompany;
