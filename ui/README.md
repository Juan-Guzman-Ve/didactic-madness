# UI — Tienda de Armado de PCs (Frontend)

Angular 17+ standalone application built with **Angular Material 3** and TypeScript.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (opens browser at http://localhost:4200)
npm start

# Build for production
npm run build

# Lint
npm run lint
```

---

## Project Structure

```
src/app/
├── app.ts                  # Root component with Material sidenav shell
├── app.html                # App layout (sidenav + toolbar + router-outlet)
├── app.scss                # App shell styles
├── app.config.ts           # Providers: router, animations, HTTP
├── app.routes.ts           # Lazy-loaded routes
│
├── shared/                 # Generic reusable UI components
│   └── components/
│       ├── button/         # UiButtonComponent
│       ├── table/          # UiTableComponent<T> — generic typed data table
│       ├── input/          # UiInputComponent — bound to FormControl
│       ├── select/         # UiSelectComponent
│       ├── card/           # UiCardComponent
│       ├── dialog/         # UiDialogComponent
│       ├── checkbox/       # UiCheckboxComponent
│       ├── chip/           # UiChipComponent
│       ├── spinner/        # UiSpinnerComponent
│       └── empty-state/    # UiEmptyStateComponent
│
├── showcase/               # Component showcase page (for visual testing)
│   ├── showcase.component.ts
│   ├── showcase.component.html
│   └── showcase.component.scss
│
└── features/               # Feature modules (to be built in later phases)
    ├── products/
    ├── cart/
    ├── orders/
    └── auth/
```

---

## Architecture Principles

### 1. **Standalone Components** (Angular 17+)
- No `NgModule` boilerplate
- Components explicitly import what they need
- Lazy-loaded routes via `loadComponent`

### 2. **Generic Component Library**
All components in `shared/components/` are **generic and reusable**. They:
- Accept data via `input()` signals
- Emit events via `output()` signals
- Work with typed data (e.g., `UiTableComponent<T>`)
- Have no business logic or API calls

### 3. **Scoped Components**
Feature-specific components (e.g., `ProductsTableComponent`, `ProductCardComponent`) **import and compose** the generic components with domain-specific logic:

```typescript
// feature: products/products-table.component.ts
import { UiTableComponent, ColumnDef } from '@shared/components/table';

@Component({
  selector: 'products-table',
  imports: [UiTableComponent],
  template: `<ui-table [data]="products()" [columns]="columns" />`
})
export class ProductsTableComponent {
  products = input.required<Product[]>();
  columns: ColumnDef<Product>[] = [
    { key: 'name', header: 'Product', sortable: true },
    { key: 'price', header: 'Price', formatter: (v) => `$${v}` },
  ];
}
```

This keeps:
- Generic components **centralized and testable**
- Feature components **organized and typed**
- No code duplication

---

## Component Showcase

Navigate to `http://localhost:4200/showcase` to view all generic components with example data.

The showcase page is used to:
- Visually verify all components during the build phase
- Test responsive behavior
- Document usage patterns for the team

---

## Material 3 Theme

The app uses **Angular Material 3** with a custom theme defined in [src/styles.scss](src/styles.scss):

```scss
@use '@angular/material' as mat;

$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,
    tertiary: mat.$blue-palette,
  ),
));

:root {
  @include mat.all-component-themes($theme);
}
```

### Utility Classes
Global utility classes for layout are defined in `styles.scss`:

```scss
.flex-row        { display: flex; flex-direction: row; }
.flex-col        { display: flex; flex-direction: column; }
.gap-8           { gap: 8px; }
.gap-16          { gap: 16px; }
.gap-24          { gap: 24px; }
.align-center    { align-items: center; }
.justify-between { justify-content: space-between; }
.full-width      { width: 100%; }
```

---

## Development Guidelines

### Adding a New Shared Component

1. Create the component in `shared/components/<name>/`
2. Make it **generic** — accept typed inputs, no business logic
3. Add it to the showcase page with example data
4. Document its inputs/outputs in the component's JSDoc

### Adding a New Feature Module

1. Create the feature folder in `features/<name>/`
2. Create scoped components that **compose** the shared components
3. Add services for API calls in `features/<name>/services/`
4. Wire the route in [app.routes.ts](src/app/app.routes.ts)

### Form Handling

All form inputs bind to Angular **`FormControl`** instances. Use **Reactive Forms** for validation:

```typescript
import { FormControl, Validators } from '@angular/forms';

nameControl = new FormControl<string>('', [Validators.required]);
```

```html
<ui-input label="Name" [control]="nameControl" />
```

---

## Next Steps

- [ ] Build the **Products** feature module (browse, detail, filter by category)
- [ ] Build the **Cart** feature module (add/remove items, update quantities)
- [ ] Build the **Orders** feature module (place order, view history)
- [ ] Build the **Auth** feature module (login, register)
- [ ] Add `HttpClient` services to consume the NestJS API
- [ ] Add auth guard + HTTP interceptor to attach JWT tokens

---

## Scripts Reference

| Command | Description |
|---|---|
| `npm start` | Start dev server + open browser |
| `npm run build` | Build for production (output: `dist/ui-app/`) |
| `npm run watch` | Build in watch mode |
| `npm run lint` | Run ESLint |

---

## Related Documentation

- [Project Plan (Backend + Frontend)](../docs/PLAN.md)
- [Angular Material 3 Documentation](https://material.angular.io/)
- [Angular Standalone Components](https://angular.dev/guide/components/importing)
