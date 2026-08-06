---
title: "ထိန်းသိမ်းရလွယ်ကူသော medallion lakehouse တစ်ခု ဒီဇိုင်းဆွဲခြင်း"
excerpt: "အလွှာခွဲခြင်း၊ data contract များနှင့် pipeline ကြီးထွားလာသည်နှင့်အမျှ bronze layer ကို မှန်ကန်စွာ ထိန်းသိမ်းခြင်းအကြောင်း မှတ်စုများ။"
---

Medallion architecture သည် lakehouse ကို bronze, silver, gold ဟူ၍ ခွဲခြားပါသည်။ အမည်သုံးခုက အဓိကမဟုတ်ပါ — raw data နှင့် modelled data ကို မရောနှောစေရန် စည်းကမ်းတကျ ထိန်းသိမ်းခြင်းသည်သာ အရေးကြီးပါသည်။

## အလွှာခွဲခြင်း ဘာကြောင့် အရေးကြီးသလဲ

Bronze သည် raw data ကို အတိအကျ သိမ်းဆည်းသည်။ Silver တွင် သန့်စင်ပြီး ပုံစံချသည်။ Gold တွင် အသုံးပြုရန် အဆင်သင့် mart များ ရှိသည်။

```sql
SELECT category, COUNT(*) AS postings
FROM gold.job_postings
GROUP BY category;
```

ဤနေရာတွင် အမှန်တကယ် ရေးသားချက်များ ထည့်သွင်းသွားပါမည်။
