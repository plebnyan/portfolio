---
title: Designing a medallion lakehouse that stays maintainable
date: 2026-07-15
excerpt: Notes on layering, data contracts, and keeping the bronze layer honest as a pipeline grows.
tags:
  - lakehouse
  - databricks
  - architecture
draft: false
---

A medallion architecture splits your lakehouse into **bronze, silver, and gold**. The value isn't the three names — it's the discipline of never letting raw and modelled data mix.

## Why layering matters

Bronze stores raw data exactly as it arrived. Silver cleans and conforms it. Gold holds the ready-to-use marts your analysts and dashboards query.

```sql
SELECT category, COUNT(*) AS postings
FROM gold.job_postings
WHERE posted_at >= DATE_SUB(CURRENT_DATE, 7)
GROUP BY category
ORDER BY postings DESC;
```

Keep the layers honest and everything downstream gets easier: debugging, backfills, and trust.
