# Skazka orders 2026

## Summary

This web app is for fetching the list of sales agents' orders, as well as some various reports.

This app relies on the ODATA REST API provided by the centralized 1C instance.

### Features

- User authentication. Users are managed via Pocketbase and are linked to 1C users via 1C user ID.
- Two types of users: Managers and Sales Agents
- Check and verify orders by date of order
- Check and verify orders by delivery date
- Orders are shown with detailed info about the statuses, goods, client, etc.
- Sales report by clients
- Sales report by goods and categories
- Agent tracking (For managers only) – get a map of all the sales agents' locations with filters


### Technologies Used

- Next.js with Mantine UI and SWR – this app
- Pocketbase for user management and minor syncs with 1C
- 1C ODATA REST API - data source