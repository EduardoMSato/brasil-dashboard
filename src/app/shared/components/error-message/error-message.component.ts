import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="error-card" [class.compact]="compact">
      <mat-card-content class="error-content">
        <div class="error-icon-wrapper">
          <mat-icon class="error-icon" [color]="iconColor">{{ icon }}</mat-icon>
        </div>
        
        <div class="error-text-wrapper">
          <h3 class="error-title" *ngIf="title">{{ title }}</h3>
          <p class="error-message">{{ message }}</p>
          <p class="error-details" *ngIf="details">{{ details }}</p>
        </div>

        <div class="error-actions" *ngIf="showRetry || showClose">
          <button 
            mat-raised-button 
            color="primary" 
            *ngIf="showRetry"
            (click)="onRetry()"
            [disabled]="retryLoading">
            <mat-icon *ngIf="retryLoading">refresh</mat-icon>
            {{ retryText }}
          </button>
          
          <button 
            mat-button 
            *ngIf="showClose"
            (click)="onClose()">
            {{ closeText }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .error-card {
      margin: 16px 0;
      border-left: 4px solid var(--error-color, #e74c3c);
    }

    .error-card.compact {
      margin: 8px 0;
    }

    .error-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px !important;
    }

    .compact .error-content {
      padding: 12px !important;
      gap: 12px;
    }

    .error-icon-wrapper {
      flex-shrink: 0;
    }

    .error-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .compact .error-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .error-text-wrapper {
      flex: 1;
      min-width: 0;
    }

    .error-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--error-color, #e74c3c);
    }

    .compact .error-title {
      font-size: 14px;
      margin-bottom: 4px;
    }

    .error-message {
      margin: 0 0 8px 0;
      color: var(--text-primary, #333);
      line-height: 1.4;
    }

    .compact .error-message {
      font-size: 14px;
      margin-bottom: 4px;
    }

    .error-details {
      margin: 0;
      font-size: 12px;
      color: var(--text-secondary, #666);
      line-height: 1.3;
    }

    .error-actions {
      display: flex;
      gap: 8px;
      flex-direction: column;
    }

    .compact .error-actions {
      gap: 4px;
    }

    @media (min-width: 600px) {
      .error-actions {
        flex-direction: row;
        align-items: center;
      }
    }
  `]
})
export class ErrorMessageComponent {
  @Input() title?: string = '';
  @Input() message: string = 'Ocorreu um erro inesperado';
  @Input() details?: string = '';
  @Input() icon: string = 'error';
  @Input() iconColor: 'primary' | 'accent' | 'warn' = 'warn';
  @Input() showRetry: boolean = true;
  @Input() showClose: boolean = false;
  @Input() retryText: string = 'Tentar Novamente';
  @Input() closeText: string = 'Fechar';
  @Input() retryLoading: boolean = false;
  @Input() compact: boolean = false;

  @Output() retry = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}