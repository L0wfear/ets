export type ThemeModalBackgroundColorParams = {
  default: string;
};
export type ThemeModalPaddingParams = {
  default: string;
};

export type ThemeModalBackgroundColor = {
  header: ThemeModalBackgroundColorParams;
  body: ThemeModalBackgroundColorParams;
  footer: ThemeModalBackgroundColorParams;
};

export type ThemeModalPadding = {
  header: ThemeModalPaddingParams;
  body: ThemeModalPaddingParams;
  footer: ThemeModalPaddingParams;
};

export type ThemeModalBorderRadiusParams = {
  default: string | 'none';
};

export type ThemeModalBorderRadius = {
  header: ThemeModalBorderRadiusParams;
  footer: ThemeModalBorderRadiusParams;
};

type ThemeModal = {
  backgroundColor: ThemeModalBackgroundColor;
  padding: ThemeModalPadding;
  borderRadius: ThemeModalBorderRadius;
};

export default ThemeModal;
