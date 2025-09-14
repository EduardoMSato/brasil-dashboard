import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CepService } from './core/services/cep.service';
import { BankService } from './core/services/bank.service';
import { ICepData } from './shared/interfaces/cep-data.interface';
import { IBankData } from './shared/interfaces/bank-data.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = '🇧🇷 Brasil Dashboard';
  cepData: ICepData | null = null;
  banks: IBankData[] = [];
  isLoading = false;
  error = '';

  constructor(
    private cepService: CepService,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    this.testAPIs();
  }

  testAPIs(): void {
    this.isLoading = true;
    this.error = '';

    // Test CEP API
    this.cepService.getCepData('01001000').subscribe({
      next: (data) => {
        this.cepData = data;
        console.log('✅ CEP API working:', data);
      },
      error: (error) => {
        this.error = error.message;
        console.error('❌ CEP API error:', error);
      }
    });

    // Test Banks API
    this.bankService.getBanks().subscribe({
      next: (data) => {
        this.banks = data.slice(0, 5); // Show first 5 banks
        this.isLoading = false;
        console.log('✅ Banks API working:', data.length, 'banks loaded');
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('❌ Banks API error:', error);
      }
    });
  }
}
