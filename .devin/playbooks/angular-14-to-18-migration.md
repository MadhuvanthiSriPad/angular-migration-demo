# Angular 14 to 18 Migration Playbook

This playbook covers all migration targets for upgrading the RetailConnect codebase from Angular 14 to Angular 18.

---

## 1. NgModule to Standalone Components

**What to change:** Convert the NgModule-based architecture to standalone components, removing the need for `NgModule` declarations.

**Code pointers:**
- `src/app/app.module.ts` — Root module to be replaced with standalone bootstrap
- `src/app/app-routing.module.ts` — Routing module to be converted to standalone route configuration

**Steps:**
1. Add `standalone: true` to all component/directive/pipe decorators.
2. Move `imports` from NgModules into each standalone component's `imports` array.
3. Replace `bootstrapModule(AppModule)` in `main.ts` with `bootstrapApplication(AppComponent, { providers: [...] })`.
4. Convert `AppRoutingModule` to a `provideRouter(routes)` call.
5. Remove all `*.module.ts` files once components are standalone.
6. Update lazy-loaded routes to use `loadComponent` instead of `loadChildren` with NgModule.

---

## 2. Template Syntax: `*ngIf`/`*ngFor` to `@if`/`@for`

**What to change:** Replace structural directive syntax with the new built-in control flow syntax introduced in Angular 17.

**Code pointer:**
- `src/app/features/products/components/product-list/product-list.component.html`

**Steps:**
1. Replace `*ngIf="condition"` with `@if (condition) { ... }`.
2. Replace `*ngIf="condition; else elseBlock"` with `@if (condition) { ... } @else { ... }`.
3. Replace `*ngFor="let item of items"` with `@for (item of items; track item.id) { ... }`.
4. Add a `track` expression to every `@for` block (required in Angular 17+).
5. Apply these changes across all component templates in the project, not just the product list.

---

## 3. Class-based Guards to Functional Guards

**What to change:** Replace the class-based `CanActivate` guard with a functional guard using `inject()`.

**Code pointer:**
- `src/app/core/guards/auth.guard.ts`

**Steps:**
1. Replace the `AuthGuard` class implementing `CanActivate` with an exported `const authGuard: CanActivateFn = () => { ... }` function.
2. Use `inject(AuthService)` and `inject(Router)` inside the function body.
3. Update all route definitions referencing `AuthGuard` to use `authGuard` (the function).
4. Remove the guard from any NgModule `providers` arrays.

---

## 4. Class-based Interceptors to `withInterceptors()`

**What to change:** Replace the class-based `HttpInterceptor` with a functional interceptor using `withInterceptors()`.

**Code pointer:**
- `src/app/core/interceptors/auth.interceptor.ts`

**Steps:**
1. Replace the `AuthInterceptor` class implementing `HttpInterceptor` with an exported `const authInterceptor: HttpInterceptorFn = (req, next) => { ... }` function.
2. Use `inject(AuthService)` inside the function body.
3. Remove `HTTP_INTERCEPTORS` provider registration from `CoreModule`.
4. Register the interceptor via `provideHttpClient(withInterceptors([authInterceptor]))` in the application bootstrap config.

---

## 5. BehaviorSubject to Signals

**What to change:** Migrate reactive state from RxJS `BehaviorSubject` to Angular Signals for simpler, synchronous state management.

**Code pointers:**
- `src/app/features/products/services/product.service.ts`
- `src/app/features/orders/services/order.service.ts`

**Steps:**
1. Replace `private subject = new BehaviorSubject<T>(initialValue)` with `private state = signal<T>(initialValue)`.
2. Replace `subject.asObservable()` exposures with `computed()` or direct signal reads.
3. Replace `subject.next(newValue)` calls with `this.state.set(newValue)` or `this.state.update(fn)`.
4. Update consuming components to use signal reads (e.g., `this.service.items()`) instead of `| async` pipes.
5. Where RxJS interop is still needed, use `toObservable()` and `toSignal()` from `@angular/core/rxjs-interop`.

---

## 6. Deprecated RxJS Operators

### 6a. `pluck` to `map`

**What to change:** Replace the deprecated `pluck` operator with `map` and property access.

**Code pointer:**
- `src/app/core/services/auth.service.ts`

**Steps:**
1. Replace `pluck('propertyName')` with `map(value => value.propertyName)`.
2. Remove `pluck` from RxJS imports.

### 6b. `toPromise()` to `lastValueFrom()`

**What to change:** Replace the deprecated `.toPromise()` method with `lastValueFrom()` from `rxjs`.

**Code pointer:**
- `src/app/features/orders/services/order.service.ts`

**Steps:**
1. Replace `observable.toPromise()` with `lastValueFrom(observable)`.
2. Add `import { lastValueFrom } from 'rxjs'`.
3. Ensure the observable completes; add `take(1)` or `first()` if needed.

---

## 7. Webpack to esbuild

**What to change:** Switch the build system from Webpack (via `@angular-devkit/build-angular:browser`) to the esbuild-based builder.

**Code pointer:**
- `angular.json`

**Steps:**
1. Update Angular CLI and dependencies to v17+.
2. Change the builder in `angular.json` from `@angular-devkit/build-angular:browser` to `@angular-devkit/build-angular:application`.
3. Rename the `main` option to `browser` in the build target.
4. Remove or migrate any custom Webpack configuration.
5. Test the build with `ng build` and verify output.

---

## 8. Karma/Jasmine to Jest

**What to change:** Replace the Karma/Jasmine test runner with Jest for faster, simpler unit testing.

**Code pointers:**
- `karma.conf.js`
- `src/test.ts`

**Steps:**
1. Install Jest and Angular Jest preset: `npm install --save-dev jest @angular-builders/jest @types/jest`.
2. Create `jest.config.ts` with the Angular preset.
3. Update `tsconfig.spec.json` to use Jest types instead of Jasmine.
4. Migrate test files: replace `jasmine.SpyObj` with `jest.mocked()`, `jasmine.createSpyObj` with `jest.fn()`, etc.
5. Update `package.json` test script from `ng test` to `jest`.
6. Remove Karma dependencies: `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`.
7. Delete `karma.conf.js` and `src/test.ts`.

---

## 9. SCSS `@import` to `@use` with Token API

**What to change:** Replace deprecated Sass `@import` statements with the modern `@use` module system and Angular Material's token-based theming API.

**Code pointer:**
- `src/styles.scss`

**Steps:**
1. Replace `@import '~@angular/material/theming'` with `@use '@angular/material' as mat`.
2. Replace `mat-palette()` calls with `mat.define-palette()`.
3. Replace `mat-light-theme()` with `mat.define-light-theme()` using the new config map format.
4. Replace `@include mat.core()` and `@include mat.all-component-themes()` with their `@use`-based equivalents.
5. Update any component-level SCSS files that use `@import` for Material theming.
6. Test that the Indigo/Amber/Red retail theme renders correctly after migration.

---

## Migration Order (Recommended)

1. **Update Angular CLI and core packages** to v18 using `ng update`.
2. **NgModule to Standalone** (Task 1) — foundational change that enables other modernizations.
3. **Functional Guards and Interceptors** (Tasks 3, 4) — can be done alongside standalone migration.
4. **Template Syntax** (Task 2) — use the Angular CLI schematic: `ng generate @angular/core:control-flow`.
5. **RxJS Operator Cleanup** (Task 6) — quick wins, no architectural changes.
6. **BehaviorSubject to Signals** (Task 5) — significant refactor, do per-service.
7. **Build System** (Task 7) — switch to esbuild after code changes stabilize.
8. **Test Runner** (Task 8) — migrate to Jest.
9. **SCSS Modernization** (Task 9) — update theming last to avoid style regressions during migration.
