import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@Pipe({
  name: 'currencyBr',
  standalone: true
})
export class CurrencyBrPipe implements PipeTransform {
  private currencyPipe: CurrencyPipe;

  constructor() {
    this.currencyPipe = new CurrencyPipe('pt-BR');
  }

  transform(value: number | string): string {
    if (value === null || value === undefined || value === '') {
      return 'R$ 0,00';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return 'R$ 0,00';
    }

    return this.currencyPipe.transform(numValue, 'BRL', 'symbol', '1.2-2', 'pt-BR') || 'R$ 0,00';
  }
}