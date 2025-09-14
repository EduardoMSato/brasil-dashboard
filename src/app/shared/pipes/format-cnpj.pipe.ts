import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCnpj',
  standalone: true
})
export class FormatCnpjPipe implements PipeTransform {
  transform(cnpj: string): string {
    if (!cnpj) return '';
    
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      return cnpj;
    }
    
    return cleanCnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
}