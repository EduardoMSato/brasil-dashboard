import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCep',
  standalone: true
})
export class FormatCepPipe implements PipeTransform {
  transform(cep: string): string {
    if (!cep) return '';
    
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return cep;
    }
    
    return cleanCep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
}