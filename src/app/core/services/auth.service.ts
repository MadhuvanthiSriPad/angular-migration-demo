import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, pluck, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
}

const MOCK_USERS: { email: string; password: string; user: AuthUser }[] = [
  {
    email: 'admin@retailconnect.io',
    password: 'admin123',
    user: { id: 'u1', name: 'Alex Johnson', email: 'admin@retailconnect.io', role: 'admin' }
  },
  {
    email: 'manager@retailconnect.io',
    password: 'manager123',
    user: { id: 'u2', name: 'Sam Rivera', email: 'manager@retailconnect.io', role: 'manager' }
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'rc_auth_token';
  private readonly USER_KEY = 'rc_auth_user';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.storage.get<AuthUser>(this.USER_KEY)
  );

  currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();

  constructor(private storage: StorageService) {}

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthUser> {
    const match = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (!match) {
      return throwError(() => new Error('Invalid credentials'));
    }

    return of(match.user).pipe(
      delay(400),
      tap(user => {
        const token = btoa(`${user.id}:${Date.now()}`);
        this.storage.set(this.TOKEN_KEY, token);
        this.storage.set(this.USER_KEY, user);
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.storage.get<string>(this.TOKEN_KEY);
  }

  /**
   * Returns an observable of the current user's role.
   *
   * MIGRATION NOTE — deprecated RxJS operator:
   *   `pluck` was deprecated in RxJS 7.4 and removed in RxJS 8.
   *   Devin migration fix: replace with map(user => user?.role)
   */
  getCurrentUserRole(): Observable<string | undefined> {
    // @ts-ignore — pluck is deprecated; intentional for migration demo
    return this.currentUser$.pipe(pluck('role'));
  }
}
