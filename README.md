# RetailConnect — Store Management Portal

## Project Overview

RetailConnect is a store management portal built with Angular. It provides tools for managing products, tracking orders, and monitoring customer data in a retail environment. It uses localStorage for persistence (no backend required).

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | Angular | `^14.3.0` |
| **UI Library** | Angular Material | `^14.2.7` |
| **Reactive Programming** | RxJS | `~7.5.0` |
| **Build Tool** | Webpack via Angular CLI | `^14.2.13` |
| **Test Runner** | Karma / Jasmine | `~6.4.0` / `~4.2.0` |
| **Language** | TypeScript | `~4.7.2` |
| **Runtime** | Node.js | 16 |

## High-Level Architecture

```mermaid
graph TD
    subgraph "App Module (root, bootstrapped via main.ts)"
        AppModule
    end

    subgraph "Core Module — singleton services, guards, interceptors"
        AuthService
        StorageService
        NotificationService
        AuthGuard
        AuthInterceptor
    end

    subgraph "Shared Module — reusable components, models, pipes"
        Header
        Sidebar
        StatCard
        DateRangePicker
        Models["Models (product, order, customer)"]
        TruncatePipe
    end

    subgraph "Feature Modules (lazy-loaded, protected by AuthGuard)"
        Dashboard
        Products
        Orders
        Customers
        Auth["Auth (login)"]
    end

    AppModule --> CoreModule
    AppModule --> SharedModule
    AppModule -- "lazy loads" --> Dashboard
    AppModule -- "lazy loads" --> Products
    AppModule -- "lazy loads" --> Orders
    AppModule -- "lazy loads" --> Customers
    AppModule -- "lazy loads" --> Auth
    AuthGuard -. "protects" .-> Dashboard
    AuthGuard -. "protects" .-> Products
    AuthGuard -. "protects" .-> Orders
    AuthGuard -. "protects" .-> Customers
```

## Folder Structure

```
src/app/
├── core/
│   ├── guards/auth.guard.ts
│   ├── interceptors/auth.interceptor.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── storage.service.ts
│   │   └── notification.service.ts
│   └── core.module.ts
├── shared/
│   ├── components/ (header, sidebar, stat-card, date-range-picker)
│   ├── models/ (product, order, customer)
│   ├── pipes/truncate.pipe.ts
│   └── shared.module.ts
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── products/ (product-list, product-form, services)
│   ├── orders/ (order-list, order-detail, services)
│   └── customers/ (customer-list, services)
├── app-routing.module.ts
├── app.component.ts/.html
└── app.module.ts
```

## Key Functional Areas

- **Dashboard:** KPI tracking and recent activity summaries (`src/app/features/dashboard/`)
- **Products:** CRUD for inventory with stock alerts; sub-components: product-list, product-form (`src/app/features/products/`)
- **Orders:** Order status management and date-filtered history; sub-components: order-list, order-detail (`src/app/features/orders/`)
- **Customers:** Customer segmentation and spending analytics; sub-component: customer-list (`src/app/features/customers/`)

## Local Development

### Dashboard

Login with `admin@retailconnect.io` / `admin123`
