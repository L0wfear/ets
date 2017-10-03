import * as React from 'react';

let VERSION_DESCRIPTION;
try {
  const VERSION = process.env.VERSION;
  VERSION_DESCRIPTION = `Версия ${VERSION}`;
} catch (e) {
  VERSION_DESCRIPTION = '';
}

const getLoginPage: React.SFC<any> = props => (
  <div className="loginpage">
    <div className="wrap">
      {props.children}
    </div>
    <span style={{ position: 'absolute', right: 8, bottom: 5, opacity: 0.2 }}>
      {VERSION_DESCRIPTION}
    </span>
  </div>
);

export default getLoginPage;
