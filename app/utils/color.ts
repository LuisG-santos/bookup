export function isColorDark(hex: string) {
  if (!hex) return false;

  const c = hex.replace("#", "");

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // fórmula de luminância perceptiva
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

  return luminance < 140;
}

export function getTextColorsForBackground(hex: string) {
  const dark = isColorDark(hex);

  return {
    primary: dark ? "#FFFFFF" : "#000000",
    secondary: dark ? "#CCCCCC" : "#333333",
  };
}