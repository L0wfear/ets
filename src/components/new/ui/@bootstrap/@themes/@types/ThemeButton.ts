export type ThemeButtonBackgroundColor = {
  default: string;
  disabled: string;
  hover: string;
  focus: string;
  disabledFocus: string;
};

export type ThemeButtonBorderRadius = {
  default: string;
};

export type ThemeButtonBorder = {
  default: string;
};

export type ThemeButtonBoxShadow = {
  default: string | 'none';
};

export type ThemeButtonColor = {
  default: string;
  disabled: string;
  hover: string;
  focus: string;
  disabledFocus: string;
};

export type ThemeButtonOpacity = {
  default: number,
  disabled: number,
  disabledFocus: number,
};

type ThemeButton = {
  backgroundColor: ThemeButtonBackgroundColor;
  borderRadius: ThemeButtonBorderRadius;
  border: ThemeButtonBorder;
  boxShadow: ThemeButtonBoxShadow;
  color: ThemeButtonColor,
  opacity: ThemeButtonOpacity;
};

export default ThemeButton;
