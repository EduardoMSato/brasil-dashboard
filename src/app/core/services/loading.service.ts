import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoadingState } from '../../shared/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStates = new Map<string, BehaviorSubject<ILoadingState>>();

  getLoadingState(key: string): Observable<ILoadingState> {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, new BehaviorSubject<ILoadingState>({
        isLoading: false,
        error: null,
        lastUpdated: null,
        retryCount: 0
      }));
    }
    return this.loadingStates.get(key)!.asObservable();
  }

  setLoading(key: string, isLoading: boolean): void {
    const currentState = this.getCurrentState(key);
    this.updateState(key, {
      ...currentState,
      isLoading,
      error: isLoading ? null : currentState.error
    });
  }

  setError(key: string, error: string): void {
    const currentState = this.getCurrentState(key);
    this.updateState(key, {
      ...currentState,
      isLoading: false,
      error,
      retryCount: currentState.retryCount + 1
    });
  }

  setSuccess(key: string): void {
    const currentState = this.getCurrentState(key);
    this.updateState(key, {
      ...currentState,
      isLoading: false,
      error: null,
      lastUpdated: new Date(),
      retryCount: 0
    });
  }

  clearError(key: string): void {
    const currentState = this.getCurrentState(key);
    this.updateState(key, {
      ...currentState,
      error: null
    });
  }

  resetState(key: string): void {
    this.updateState(key, {
      isLoading: false,
      error: null,
      lastUpdated: null,
      retryCount: 0
    });
  }

  private getCurrentState(key: string): ILoadingState {
    if (!this.loadingStates.has(key)) {
      return {
        isLoading: false,
        error: null,
        lastUpdated: null,
        retryCount: 0
      };
    }
    return this.loadingStates.get(key)!.value;
  }

  private updateState(key: string, state: ILoadingState): void {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, new BehaviorSubject<ILoadingState>(state));
    } else {
      this.loadingStates.get(key)!.next(state);
    }
  }
}