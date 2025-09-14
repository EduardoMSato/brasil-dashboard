import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface IConfirmationDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'confirm' | 'warning' | 'danger';
  icon?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirmation-dialog">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon [class]="'dialog-icon ' + data.type" *ngIf="data.icon">{{ data.icon }}</mat-icon>
        {{ data.title || 'Confirmação' }}
      </h2>
      
      <mat-dialog-content class="dialog-content">
        <p [innerHTML]="data.message"></p>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button 
          mat-button 
          (click)="onCancel()"
          tabindex="2">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        
        <button 
          mat-raised-button 
          [color]="getConfirmButtonColor()"
          (click)="onConfirm()"
          tabindex="1"
          cdkFocusInitial>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      min-width: 300px;
      max-width: 500px;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 24px 24px 16px 24px;
      font-size: 20px;
      font-weight: 500;
    }

    .dialog-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .dialog-icon.confirm {
      color: var(--primary-color, #1976d2);
    }

    .dialog-icon.warning {
      color: var(--warning-color, #ff9800);
    }

    .dialog-icon.danger {
      color: var(--error-color, #f44336);
    }

    .dialog-content {
      padding: 0 24px;
      margin: 0;
    }

    .dialog-content p {
      margin: 0;
      line-height: 1.5;
      color: var(--text-primary, #333);
    }

    .dialog-actions {
      padding: 24px;
      margin: 0;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    @media (max-width: 600px) {
      .confirmation-dialog {
        min-width: 280px;
      }
      
      .dialog-title {
        font-size: 18px;
        padding: 20px 20px 12px 20px;
      }
      
      .dialog-content {
        padding: 0 20px;
      }
      
      .dialog-actions {
        padding: 20px;
        flex-direction: column-reverse;
        gap: 12px;
      }
      
      .dialog-actions button {
        width: 100%;
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmationDialogData
  ) {
    // Set defaults
    this.data = {
      type: 'confirm',
      icon: this.getDefaultIcon(data.type || 'confirm'),
      ...data
    };
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getConfirmButtonColor(): 'primary' | 'accent' | 'warn' {
    switch (this.data.type) {
      case 'danger':
        return 'warn';
      case 'warning':
        return 'accent';
      default:
        return 'primary';
    }
  }

  private getDefaultIcon(type: string): string {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      default:
        return 'help';
    }
  }
}