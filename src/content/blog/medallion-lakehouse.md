---
title: "Designing a medallion lakehouse that stays maintainable"
titleMy: "ထိန်းသိမ်းရလွယ်ကူသော medallion lakehouse တစ်ခု ဒီဇိုင်းဆွဲခြင်း"
date: 2026-07-15
excerpt: "Notes on layering, data contracts, and keeping the bronze layer honest as a pipeline grows."
excerptMy: "အလွှာခွဲခြင်း၊ data contract များနှင့် pipeline ကြီးထွားလာသည်နှင့်အမျှ bronze layer ကို မှန်ကန်စွာ ထိန်းသိမ်းခြင်းအကြောင်း မှတ်စုများ။"
tags: ["lakehouse", "databricks", "architecture"]
draft: false
bodyMy: |
  Medallion architecture သည် lakehouse ကို bronze, silver, gold ဟူ၍ ခွဲခြားပါသည်။ အမည်သုံးခုက အဓိကမဟုတ်ပါ — raw data နှင့် modelled data ကို မရောနှောစေရန် စည်းကမ်းတကျ ထိန်းသိမ်းခြင်းသည်သာ အရေးကြီးပါသည်။

  ## အလွှာခွဲခြင်း ဘာကြောင့် အရေးကြီးသလဲ

  Bronze သည် raw data ကို အတိအကျ သိမ်းဆည်းသည်။ Silver တွင် သန့်စင်ပြီး ပုံစံချသည်။ Gold တွင် အသုံးပြုရန် အဆင်သင့် mart များ ရှိသည်။

  ```sql
  SELECT category, COUNT(*) AS postings
  FROM gold.job_postings
  GROUP BY category;
  ```

  ဤနေရာတွင် အမှန်တကယ် ရေးသားချက်များ ထည့်သွင်းသွားပါမည်။
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
