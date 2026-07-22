---
title: "jobnet-lakehouse"
order: 1
featured: true
summary: "An end-to-end medallion lakehouse that turns messy, scattered Myanmar job postings into a clean, queryable view of the hiring market — scraped weekly, governed, and served through a live dashboard."
stack: ["Databricks", "Delta Lake", "dbt-core", "Azure ADF", "AWS Lambda", "Unity Catalog"]
problems:
  - "Job seekers have no single view of what's actually being hired — postings are scattered across dozens of sites."
  - "Recruiters can't see how category and location demand shift over time; there's no trend, only today's noise."
  - "Raw scraped postings are duplicated, inconsistent, and half-structured — unusable for analysis as-is."
  - "Once a posting expires it's gone, so the historical hiring signal is permanently lost."
dataModelImage: "/img/jobnet-star-schema.svg"
dashboardUrl: ""
repoUrl: "https://github.com/plebnyan/jobnet-lakehouse"
quality:
  - "dbt tests & data contracts on every model — not_null, unique, accepted_values, relationships."
  - "Fully functioning DAG: ingest → transform → publish, with retries, scheduling, and failure alerts."
  - "CI on every pull request via GitHub Actions — build, test, and lint before anything merges."
  - "Version-controlled and environment-separated (dev / prod), governed by Unity Catalog."
related: []
draft: false
---
