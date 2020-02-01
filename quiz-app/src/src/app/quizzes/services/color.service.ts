import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';


@Injectable()
export class ColorService {
  static getRandomColor(): string {
    return environment.colors[Math.floor(Math.random() * environment.colors.length)];
  }

  static getInvertTextColor(hexColor: string): string {
    if (ColorService._getColorLuminance(hexColor) > 0.55) {
      return environment.darkTextColor;
    } else {
      return environment.brightTextColor;
    }
  }

  private static _hexColorToIntArray(hexColor: string): number[] {
    return [1, 3, 5]
      .map(
        (startIndex: number) => parseInt(hexColor.substring(startIndex, startIndex + 2), 16)
      );
  }

  // https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  static _getColorLuminance(hexColor: string): number {
    const luminanceCoefficients: number[] = [0.2126, 0.7152, 0.0722];
    return ColorService._hexColorToIntArray(hexColor)
      .map((intColorValue: number) => intColorValue / 255)
      .map((floatColorValue: number) => {
        if (floatColorValue <= 0.03928) {
          return floatColorValue / 12.92;
        } else {
          return Math.pow((floatColorValue + 0.055) / 1.055, 2.4);
        }
      })
      .map((adjustedColorValue: number, index: number) => adjustedColorValue * luminanceCoefficients[index])
      .reduce(
        (totalLuminance: number, luminanceValue: number) => totalLuminance + luminanceValue,
        0
      );
  }

  hexToRgba(hexColor: string, alpha: number): string {
    const colorValues: number[] = ColorService._hexColorToIntArray(hexColor);
    return 'rgba(' + colorValues[0] + ', ' + colorValues[1] + ', ' + colorValues[2] + ', ' + alpha + ')';
  }
}
