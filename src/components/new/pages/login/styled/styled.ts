import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const background = require('components/new/pages/login/styled/bg.jpg');
const jkh = require('components/new/pages/login/styled/jkh.png');

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
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const LoginPageFormContentInput = styled.input`
  height: 44px;
  background: #fff;
  border: 0;
  box-shadow: none!important;
`;

export const LoginPageForm = styled.form`
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  user-select: none;
  border-radius: 3px;
  ${LoginPageFormContentInput} {
    margin-bottom: 10px;
  }
  >*:first-child {
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
  }
  >*:last-child {
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }

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

export const HrLineWaybill = styled.hr`
  border-top: 1px dashed #394349 !important;
  margin: 20px -15px;
`;

export const DitLogo = styled.div`
  background: url(${jkh});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 100px;
`;

export const LoginPageFormContentLabel = styled.label`
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 25px;
`;

export const LoginPageFormContentButton = styled(EtsBootstrap.Button)`
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  padding: 15px;
  height: 44px;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

export const TpMessangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  &>span {
    font-weight: bold;
  }
  &>a {
    color: black;
    cursor: pointer;
  }
`;
