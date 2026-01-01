// ---- cálculo de contraste ----
function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(hex1: string, hex2: string) {
  const c1 = hex1.replace("#", "");
  const c2 = hex2.replace("#", "");

  const rgb1 = {
    r: parseInt(c1.substring(0, 2), 16),
    g: parseInt(c1.substring(2, 4), 16),
    b: parseInt(c1.substring(4, 6), 16),
  };

  const rgb2 = {
    r: parseInt(c2.substring(0, 2), 16),
    g: parseInt(c2.substring(2, 4), 16),
    b: parseInt(c2.substring(4, 6), 16),
  };

  const L1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const L2 = luminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(L1, L2);
  const darkest = Math.min(L1, L2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function bestTextColor(
  bg: string,
  preferWhite = false
) {
  const whiteContrast = contrast(bg, "#FFFFFF");
  const blackContrast = contrast(bg, "#000000");

  if (!preferWhite) {
    return whiteContrast >= blackContrast ? "#FFFFFF" : "#000000";
  }

  const MIN_WHITE = 1.1;

  const whiteIsAcceptable = whiteContrast >= MIN_WHITE;
  const whiteNotTerribleComparedToBlack = whiteContrast >= blackContrast * 0.4;

  if (whiteIsAcceptable && whiteNotTerribleComparedToBlack) {
    return "#FFFFFF";
  }

  // se realmente ficar péssimo, cai pra maior contraste
  return whiteContrast >= blackContrast ? "#FFFFFF" : "#000000";
}

export function getTextColorsForBackground(hex: string) {
  return {
    primary: bestTextColor(hex, true), // força branco quando possível
    
    secondary: bestTextColor(hex, false), // mais neutro / mais seguro
  };
}

export function hexToHslTriplet(hex: string) {
  const c = hex.replace("#", "").trim();
  if (c.length !== 6) return "0% 0% 100%";
  const r = parseInt(c.substring(0, 2), 16) / 255;;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const S = Math.round(s * 100);
  const L = Math.round(l * 100);

  return `${h} ${S}% ${L}%`;
    
}