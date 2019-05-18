import { darken, lighten } from 'polished';

export const defaultEtsTheme = {
  button: {
    default: {
      backgroundColor: {
        default: '#4c4c4c',
        disabled: '#ddd',
        hover: '#3c763d',
        focus: darken(0.05, '#3c763d'),
        disabledFocus: lighten(0.4, '#3c763d'),
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
    },
    paginator: {
      backgroundColor: {
        default: 'white',
        disabled: '#ddd',
        hover: '#3c763d',
        focus: darken(0.05, '#3c763d'),
        disabledFocus: lighten(0.4, '#3c763d'),
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
        default: '#337ab7',
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
    },
  },
};

const etsThemes = {
  defaultEtsTheme,
};

export default etsThemes;
