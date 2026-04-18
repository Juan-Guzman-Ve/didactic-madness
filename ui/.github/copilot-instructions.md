# UI-Specific Copilot Instructions

**Context:** Working in `ui/` folder (Angular 17+ standalone app)

---

## Quick Rules

1. **Every component:** separate `.ts`, `.html`, `.scss` files
2. **Use path aliases:** `@app/*`, `@shared/*` (never `../../../`)
3. **DI pattern:** `inject()` function, not constructor injection
4. **Naming:** kebab-case for files/folders
5. **Max 20-30 lines per function**

---

## Component Creation Checklist

When creating a new component:

```typescript
// ✅ CORRECT
@Component({
  selector: 'feature-name',
  standalone: true,
  imports: [...],
  templateUrl: './feature-name.component.html',
  styleUrl: './feature-name.component.scss',
})
export class FeatureNameComponent {
  private readonly service = inject(MyService);
  
  // Use signals for state
  data = signal<Product[]>([]);
  loading = signal(false);
}
```

### ❌ AVOID:
- Inline templates or styles
- Constructor injection (`constructor(private service: MyService)`)
- Relative imports (`../../../shared/...`)
- Functions > 30 lines (extract to private methods)

---

## Generic vs Scoped Components

### Generic Components (`ui/src/app/shared/components/`)
- **Reusable across features**
- No business logic
- Accept inputs, emit outputs
- Use generics when needed (`UiTableComponent<T>`)

Example:
```typescript
// shared/components/button/ui-button.component.ts
export class UiButtonComponent {
  variant = input<ButtonVariant>('primary');
  label = input<string>('');
  clicked = output<void>();
}
```

### Scoped Components (`ui/src/app/features/`)
- **Feature-specific logic**
- Compose generic components
- Handle state management
- Call services

Example:
```typescript
// features/products/product-card/product-card.component.ts
export class ProductCardComponent {
  product = input.required<Product>();
  
  // Composes generic component with scoped data
  // <ui-button label="Add to Cart" (clicked)="addToCart()" />
}
```

---

## State Management

**Local state:** Signals in component
```typescript
count = signal(0);
doubled = computed(() => this.count() * 2);
```

**Shared state:** Service with signals
```typescript
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private productsSignal = signal<Product[]>([]);
  readonly products = this.productsSignal.asReadonly();
}
```

**Forms:** Reactive forms with `FormControl`
```typescript
nameControl = new FormControl<string>('', [Validators.required]);
```

---

## Import Order (for readability)

```typescript
// 1. Angular core
import { Component, signal, inject } from '@angular/core';

// 2. Angular modules (forms, router, etc.)
import { FormControl, Validators } from '@angular/forms';

// 3. Angular Material
import { MatButtonModule } from '@angular/material/button';

// 4. Project imports (use aliases)
import { ProductsService } from '@app/features/products/products.service';
import { UiButtonComponent } from '@shared/components/button/ui-button.component';
```

---

## Validation Pattern

**Simple validation:** Guard clauses in methods
```typescript
async addToCart(productId: string) {
  if (!productId) return;
  if (!this.user()) throw new Error('Not logged in');
  
  // Happy path
  await this.cartService.addItem(productId, 1);
}
```

**Complex validation:** Extract to validator service (when needed)

---

## Testing (Integration-first)

Prefer integration tests with real services:

```typescript
describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, HttpClientTestingModule]
    }).compileComponents();
  });
  
  it('should add product to cart', async () => {
    // Test real user interactions
  });
});
```

---

## When to Create New Components

**Create a new component when:**
- Logic exceeds 30 lines
- Template exceeds 50 lines
- Reused 2+ times (DRY principle)
- Clear single responsibility

**Keep in one component when:**
- Tightly coupled logic
- Only used once
- Still under complexity limits

---

## File Structure Example

```
features/
  products/
    ├── products.component.ts          # Container (loads data, manages state)
    ├── products.component.html
    ├── products.component.scss
    ├── products.service.ts            # API calls, shared state
    ├── product-card/                  # Presentational component
    │   ├── product-card.component.ts
    │   ├── product-card.component.html
    │   └── product-card.component.scss
    └── product-filter/                # Scoped feature component
        ├── product-filter.component.ts
        ├── product-filter.component.html
        └── product-filter.component.scss
```

---

## Navigation — Use AppRoutes Constants

**Never use string literals for route navigation.** Always import from `@app/app.routes.constants`.

```typescript
// ❌ BAD — hardcoded string
this.router.navigate(['/auth/login']);

// ✅ GOOD — named constant
import { AppRoutes } from '@app/app.routes.constants';
this.router.navigate([AppRoutes.AUTH_LOGIN]);
```

When adding a new route, add it to `app.routes.constants.ts` and `app.routes.ts` together.

---

## Simplicity Rules

**Only extract a method when the logic is reused or genuinely complex.** Do not extract single-use inline expressions into helper methods — it adds indirection without benefit.

```typescript
// ❌ BAD — unnecessary extraction for a one-liner
private buildRequest(): RegisterRequest {
  return this.form.getRawValue();
}
async onSubmit() {
  await this.service.register(this.buildRequest());
}

// ✅ GOOD — inline it directly
async onSubmit() {
  await this.service.register(this.form.getRawValue());
}
```

**Prefer direct, obvious code over clever abstractions.** If a method is used once and its body is 1-3 lines, keep it inline.

---

## Common Mistakes to Avoid

1. ❌ Using `any` without justification comment
2. ❌ Nested `if` statements (use guard clauses)
3. ❌ Magic numbers or strings (use named constants)
4. ❌ Hardcoded route strings (use `AppRoutes`)
5. ❌ Long template files (extract to child components)
6. ❌ Mixing business logic in generic components
7. ❌ Constructor injection (use `inject()`)
8. ❌ Relative imports (use `@app`, `@shared`)
9. ❌ Extracting single-use trivial logic into helper methods

---

## Quick Reference: Angular Signals API

```typescript
// Writable signal
count = signal(0);
count.set(5);           // Replace value
count.update(n => n+1); // Update based on current

// Computed signal (readonly, auto-updates)
doubled = computed(() => this.count() * 2);

// Effect (side effects when signal changes)
effect(() => {
  console.log('Count changed:', this.count());
});
```

---

**Remember:** Code should read like a story. If you need to backtrack to understand logic, refactor it.
