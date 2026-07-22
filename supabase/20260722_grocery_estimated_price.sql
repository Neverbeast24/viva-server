-- Grocery line estimates (PHP) so lists can stay within monthly_health_budget.
alter table public.grocery_items
  add column if not exists estimated_price numeric
    check (estimated_price is null or estimated_price >= 0);

comment on column public.grocery_items.estimated_price is
  'Estimated PHP cost for this list line; used for budget-aware shopping.';
