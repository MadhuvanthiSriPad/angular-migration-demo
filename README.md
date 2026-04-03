# RetailConnect — Angular 14 Migration Demo

A store management portal built with **Angular 14** to demonstrate an enterprise Angular 14 → 18 migration.

## Stack

- Angular 14 + Angular Material 14
- RxJS 7.5
- NgModule architecture
- Jasmine / Karma tests
- localStorage for data persistence (no backend required)

## Architecture

```
src/app/
├── core/                          # Singleton services, guards, interceptors
│   ├── services/
│   │   ├── auth.service.ts        # Auth state (BehaviorSubject)
│   │   ├── storage.service.ts     # Data persistence (localStorage)
│   │   └── notification.service.ts
│   ├── guards/auth.guard.ts       # Class-based CanActivate (→ functional in v18)
│   └── interceptors/auth.interceptor.ts
├── shared/                        # Reusable components, models, pipes
│   ├── components/
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── stat-card/
│   ├── models/                    # product.model.ts, order.model.ts, customer.model.ts
│   └── pipes/truncate.pipe.ts
└── features/                      # Lazy-loaded feature modules
    ├── dashboard/
    ├── products/                  # List + form with reactive forms
    ├── orders/                    # List + detail with status workflow
    └── customers/
```

## Running locally

```bash
npm install
npm start          # http://localhost:4200
```

Login with `admin@retailconnect.io` / `admin123`

## Migration targets (Angular 14 → 18)

| Pattern | Current (v14) | Target (v18) |
|---|---|---|
| Module system | `NgModule` | Standalone components |
| Template syntax | `*ngIf`, `*ngFor` | `@if`, `@for` |
| Route guards | `CanActivate` class | Functional guard |
| HTTP interceptors | Class-based | `withInterceptors()` |
| State | `BehaviorSubject` | Signals |
| Build | Webpack | esbuild |
| Tests | Karma / Jasmine | Jest |
