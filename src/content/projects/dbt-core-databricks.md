---
title: "dbt Core on Databricks"
summary: "A medallion-architecture e-commerce pipeline built with dbt Core against a Databricks SQL Warehouse — raw orders, products, users and reviews pushed through bronze, silver and gold, with tests and SCD2 history along the way."
tags: ["dbt", "databricks", "lakehouse", "architecture"]
stack: ["dbt Core", "Databricks SQL Warehouse", "SQL"]
status: "active"
order: 2
featured: false
problems:
  - "Raw e-commerce tables answer no business question on their own — sales trends and product ratings have to be modelled before anyone can read them."
  - "Product attributes change over time, and overwriting them destroys the history needed to understand past orders."
  - "Nothing guarantees the landing data is trustworthy: duplicates, nulls and broken references all arrive silently."
  - "PII sits in the raw layer and needs to be identifiable rather than scattered anonymously through the warehouse."
quality:
  - "Source tests on the landing tables — uniqueness, nullability, referential integrity, and accepted values."
  - "A custom singular test catching line items where quantity × unit_price is zero or negative."
  - "SCD Type 2 snapshots preserving slowly changing product attributes instead of overwriting them."
  - "Separate dev and prod catalogs, with credentials supplied by environment variables rather than hardcoded in profiles.yml."
  - "Bronze models tagged contain_pii, so sensitive columns are traceable from the first layer onward."
repoUrl: "https://github.com/plebnyan/dbt_core_databricks"
draft: false
---

A portfolio build of the pattern I keep coming back to: [[medallion-lakehouse|medallion layering]], applied end to end with dbt Core against a Databricks SQL Warehouse.

## The shape of it

Four layers, each with one job.

**Sources** declare the landing tables and carry the first round of tests, so bad data is caught at the door rather than three models downstream.

**Bronze** is a 1:1 copy of the raw tables, tagged `contain_pii`. No cleaning, no reshaping — the point is a layer that always matches what arrived.

**Silver** cleans, types and conforms. This is where the real modelling decisions live.

**Gold** holds the business aggregates: `gold_daily_sales` and `gold_avg_ratings`.

```
models/
├── sources/    # landing declarations + source tests
├── bronze/     # raw 1:1, tagged contain_pii
├── silver/     # cleaned, typed, conformed
└── gold/       # business aggregates
snapshots/      # SCD2 history
tests/          # singular SQL tests
macros/         # custom schema naming
```

## Testing as part of the pipeline

The generic tests cover the usual ground — uniqueness, not-null, relationships, accepted values. The one worth calling out is a singular test asserting that `quantity * unit_price` is never zero or negative, because that's the kind of error that passes every schema check and still produces nonsense revenue.

## Keeping history

Product attributes change. A snapshot tracks them as SCD Type 2, so an order from six months ago can still be read against the product as it was then, rather than as it is now.
