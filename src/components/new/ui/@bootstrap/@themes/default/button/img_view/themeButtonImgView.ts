import { darken, lighten } from 'polished';
import ThemeButton from '../../../@types/ThemeButton';

const themeButtonImgView: ThemeButton = {
  backgroundColor: {
    default: 'rgba(0, 0, 0, 0)',
    disabled: 'rgba(0, 0, 0, 0)',
    hover: '#3c763d',
    focus: darken(0.05, '#3c763d'),
    disabledFocus: lighten(0.4, '#3c763d'),
  },
  borderRadius: {
    default: '0px',
  },
  border: {
    default: 'none',
  },
  boxShadow: {
    default: 'none',
  },
  color: {
    default: 'white',
    disabled: '#9b9b9b',
    hover: 'white',
    focus: 'white',
    disabledFocus: darken(0.2, '#9b9b9b'),
  },
  opacity: {
    default: 1,
    disabled: 1,
    disabledFocus: 1,
  },
};

export default themeButtonImgView;
