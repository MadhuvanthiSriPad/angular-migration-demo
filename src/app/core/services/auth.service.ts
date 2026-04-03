import { Injectable, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
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

  currentUser = signal<AuthUser | null>(
    this.storage.get<AuthUser>(this.USER_KEY)
  );

  currentUser$ = toObservable(this.currentUser);

  constructor(private storage: StorageService) {}

  get isLoggedIn(): boolean {
    return this.currentUser() !== null;
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
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.storage.get<string>(this.TOKEN_KEY);
  }

  getCurrentUserRole(): Observable<string | undefined> {
    return this.currentUser$.pipe(map(user => user?.role));
  }
}
