import * as React from 'react';
import { get } from 'lodash';
import {
  LoginPageFormContentInput,
} from 'components/new/pages/login/styled/styled';

type LoginPageProps = {
  login: string;
  handleChange: (arg: object) => any;
  disabled: boolean;
};

const FieldLogin: React.FC<LoginPageProps> = React.memo(
  (props) => {
    const handleChange = React.useCallback(
      (event) => {
        props.handleChange({
          login: get(event, 'target.value', event),
        });
      },
      [props.handleChange],
    );
    return (
      <LoginPageFormContentInput
        id="login"
        type="text"
        className="form-control"
        placeholder="Логин"
        value={props.login}
        onChange={handleChange}
        disabled={props.disabled}
      />
    );
  },
);

export default FieldLogin;
