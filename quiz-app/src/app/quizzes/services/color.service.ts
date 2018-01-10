import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';


@Injectable()
export class ColorService {
  constructor() {}

  static getRandomColor(): string {
    return environment.colors[Math.floor(Math.random() * environment.colors.length)];
  }

  hexToRgba(hexColor, alpha) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }
}
