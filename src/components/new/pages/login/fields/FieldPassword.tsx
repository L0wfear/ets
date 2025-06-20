import * as React from 'react';
import { get } from 'lodash';
import {
  LoginPageFormContentInput,
} from 'components/new/pages/login/styled/styled';

type LoginPageProps = {
  password: string;
  handleChange: (arg: object) => any;
  disabled: boolean;
};

const FieldPassword: React.FC<LoginPageProps> = React.memo(
  (props) => {
    const handleChange = React.useCallback(
      (event) => {
        props.handleChange({
          password: get(event, 'target.value', event),
        });
      },
      [props.handleChange],
    );
    return (
      <LoginPageFormContentInput
        id="password"
        type="password"
        className="form-control"
        placeholder="Пароль"
        value={props.password}
        onChange={handleChange}
        disabled={props.disabled}
      />
    );
  },
);

export default FieldPassword;
