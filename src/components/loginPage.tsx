import * as React from 'react';
import LoginPage from './login/LoginPage';

const getLoginPage: React.SFC<any> = props => (
  <div className="loginpage">
    <div className="wrap">
      <LoginPage {...props}/>
    </div>
  </div>
);

export default getLoginPage;
