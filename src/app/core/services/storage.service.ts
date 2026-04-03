import { Injectable } from '@angular/core';

/**
 * Data Persistence Layer — wraps localStorage with typed get/set helpers.
 * Angular 18 migration note: this service is a candidate for replacement
 * with the new @angular/core signal-based state primitives.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
