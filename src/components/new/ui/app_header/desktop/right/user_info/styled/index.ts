import styled, { css } from 'styled-components';
import { DefaultFirstLvlMenu } from 'components/new/ui/app_header/styled';

const defaultAvatar = require('assets/images/avatar-default.png');

const avatars = [];

if (process.env.STAND === 'dev') {
  const av1 = require('assets/images/april/1.jpeg');
  const av2 = require('assets/images/april/2.jpeg');
  const av3 = require('assets/images/april/3.jpeg');
  const av4 = require('assets/images/april/4.jpeg');
  const av5 = require('assets/images/april/5.jpeg');
  const av6 = require('assets/images/april/6.jpeg');
  const av7 = require('assets/images/april/7.jpeg');
  const av8 = require('assets/images/april/8.jpeg');
  const av9 = require('assets/images/april/9.jpeg');
  const av10 = require('assets/images/april/10.jpeg');
  const av11 = require('assets/images/april/11.jpeg');
  const av12 = require('assets/images/april/12.jpeg');

  avatars.push(av1);
  avatars.push(av2);
  avatars.push(av3);
  avatars.push(av4);
  avatars.push(av5);
  avatars.push(av6);
  avatars.push(av7);
  avatars.push(av8);
  avatars.push(av9);
  avatars.push(av10);
  avatars.push(av11);
  avatars.push(av12);
}

export const UserDataMenu = styled(DefaultFirstLvlMenu)`
  text-decoration: none;
`;

export const UserDataContainer = styled.div`
  padding: 0 10px;
`;

export const UserImg = styled.img.attrs({
  src: process.env.STAND === 'dev'
    ? avatars[Math.floor(Math.random() * (avatars.length))]
    : defaultAvatar,
  role: 'presentation',
})`
  width: 43px;
  height: 43px;
`;
export const UserHeaderData = styled.div`
  opacity: 0.5;
  font-size: 11px;
`;

const shortCss = css`
  max-width: 140px;
  font-size: 12px;
  white-space: normal;
`;

export const UserFio = styled(UserHeaderData)<{ short: boolean }>`
  opacity: 1;
  ${({ short }) => short ? shortCss : ''}
`;
