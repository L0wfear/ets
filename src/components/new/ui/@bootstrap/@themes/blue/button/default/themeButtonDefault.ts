import { darken, lighten } from 'polished';
import ThemeButton from '../../../@types/ThemeButton';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

const themeButtonDefault: ThemeButton = {
  backgroundColor: {
    default: UiConstants.colorError,
    disabled: '#ddd',
    hover: 'blue',
    focus: darken(0.05, 'blue'),
    disabledFocus: lighten(0.4, 'blue'),
  },
  borderRadius: {
    default: '3px',
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
    disabled: 0.65,
    disabledFocus: 1,
  },
};

export default themeButtonDefault;
