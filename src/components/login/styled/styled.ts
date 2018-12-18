import styled from 'styled-components';
import * as Button from 'react-bootstrap/lib/Button';

const background = require('components/login/styled/bg.jpg');
const jkh = require('components/login/styled/jkh.png');

export const LoginPageContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

export const LoginPageFormWrap = styled.div`
  display: table;
  width: 100%;
  height: 100%;
`;

export const LoginPageForm = styled.form`
  display: table-cell;
  width: 100%;
  height: 100%;
  vertical-align: middle;
`;

export const LoginPageFormContainer = styled.div`
  margin: 0 auto;
  max-width: 400px;
  padding: 0;
  background: #efefef;
  box-shadow: 0px 0px 80px 0px rgba(0,0,0,0.4);
  user-select: none;

  .form-control {
    position: relative;
    height: auto;
    box-sizing: border-box;
    padding: 10px;
    font-size: 16px;
  }
`;

export const LoginPageFormHeader = styled.div`
  width: 100%;
  height: 90px;
  background: #7fc650;
  color: white;
  padding: 4px;
  text-align: center;
  font-size: 60px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: rgba(255, 255, 255, 0.5) 0 0 1px;
`;

export const LoginPageFormContent = styled.div`
  padding: 30px;
  text-align: center;
`;

export const HrLine = styled.hr`
  border-top: 1px solid #706b77 !important;
`;

export const DitLogo = styled.div`
  background: url(${jkh});
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 77px;
`;

export const LoginPageFormContentLabel = styled.label`
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 25px;
`;

export const LoginPageFormContentInput = styled.input`
  height: 44px;
  background: #fff;
  border: 0;
  margin-bottom: 25px !important;
`;

export const LoginPageFormContentButton = styled(Button)`
  &&& {
    width: 100%;
    background: #706b77;
    color: white;
    text-transform: uppercase;
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    padding: 15px;
    height: 44px;
    letter-spacing: 0.5px;
    font-weight: 500;
    &:hover {
      background: #9994a1 !important;
    }
    &[disabled] {
      background: #a6a6a6 !important;
    }
  }
`;

export const TpMessangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  &>span {
    font-weight: bold;
  }
  &>a {
    color: black;
    cursor: pointer;
  }
`;
