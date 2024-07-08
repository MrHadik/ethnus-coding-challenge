# Ethnus Coding Challenge Project

This is a Next.js project developed for the Ethnus Coding Challenge.

## Installation

To get started with this project, follow these steps:

1. Clone this repository.
2. Navigate to the project directory.
3. Install dependencies using npm:

```bash
npm install
```

## Database Seeding

To seed the database with initial data, run:

```bash
npm run seed
```

## Running locally

```bash
npm run dev
```

## API Summary

| API Name           | Endpoint             | Parameters                              | Response                                 | Description                                                        |
|--------------------|----------------------|------------------------------------------|------------------------------------------|--------------------------------------------------------------------|
| Transactions API   | `/api/transactions`  | `page` (optional)<br>`perPage` (optional)<br>`search` (optional)<br>`month` (optional) | List of transactions with pagination details | Retrieves transactions based on page, search, and month filters.   |
| Statistics API     | `/api/statistics`    | `month` (optional)                       | Total sale amount, sold items, not sold items | Provides statistics for a specific month.                          |
| Bar Chart API      | `/api/barchart`      | `month` (optional)                       | Array of objects with price range and item count | Fetches data for generating a bar chart based on price ranges.     |
|Combined API | `/api/combined`  | GET    | `month` (optional) | Retrieves aggregated data from three separate APIs for the selected month. |
