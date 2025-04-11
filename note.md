# NOTE FOR TICKETS

### 7th Nov 2024

## Settings Page

✅ Modify Create Tax

✅ Modify Create Discount:

    - User can only input name field
    - Calculate InputValue into decimal based on InputName
    - If 100%, meaning it's free (config the UI only for Discount Table)

✅ Cafe-Only
✅ Pending-Payment
✅ Transfer-Table
✅ Update Duration (Hourly)
✅ Use `toast.info` to remove the product
✅ Update SelectedOrders status payment from & to "ARCHIVE" <-> "PAID" (Rollback Button & ArchiveSelected Button, MANAGER ONLY)
✅ Remove Archive Order (Manager Only): Remove Order and its relation-tables (customer, poolRentals, & list of orderlines if any)

✅ Remove All Archive SelectedOrders (Make sure all the related table also remove, ADMIN ONLY)
✅ Button Update Duration: Situation: if set to 4 hours, and the time is clocking 3 hours, it should cannot to update to less than the clocking time (eg. to 2 hrs)

✅ Setup custom toast for order, re-order, and remove cafe-menu from cart
✅ Booking-Schedule
✅ Dashboard
✅ Client's Home Page
✅ Home Page
✅ New registered user create company/tenant

✅ (bug) Fix cafe order menu
✅ Move Button Edit and Delete Product and Packet into row list of table
✅ Restrict to edit and delete enabled product(s) and packet(s)
✅ Restrict to delete enabled poolTable(s)
✅ When creating startTimer in pool table where has/have ordered, the timer not display properly (assuming the bug is on api.orders.findByPoolTable )
✅ Setup Pdf Download Transactions based on Date Range
✅ New Feature: Free Orderline (Manager Access Level)
✅ Avoid Delete Product if it has already on orderline(s)
✅ Avoid Delete Packet if it has already on poolRental(s)
✅ Bug: Detail on Transaction Row Action: If Cafe-Only, order is undefined
✅ Bug: Remove NaN on Receipt
✅ Reconfig Bill Printed (Tax included)

## Version 1.0.0

✅ Production Deployment Testing
✅ Bug: Payment for PendingOrder should not modify PoolTable startTime, endTime, and isActive
✅ Bug: Manager now has access to CRUD Booking
✅ Bug: Make the API for Booking list as public
✅ Create small WhatsApp icon if the table is active, so the potential customer knows he/she can also the booking table table althought it's in active
✅ CreatedBy should not from the session user
✅ Feat: Add fn isTimeOverlap() to avoid transfer table create potential collision schedule

    - Avoid to transfer table to the table where has any booking order if the rate is "MINUTE"
    - Avoid to transfer table to the table where has any booking order if the rate is "HOUR" and the time is overlap

✅ Style the Star Icon on Table Column for isBooking Order on Transactions Tab Orders & Tab Rentals
✅ Add new field called updatedBy on ordersSchema && retrieve on orders.payment API
✅ Configure updatedByName & updatedByRole on Table Transactions & Archives
✅ Add Tooltip Total Transactions of Revenue By Payment Method on Dashboard
✅ Setup Cafe-Only Graphic on Dashboard
✅ Setup Customer Graphic on Dashboard

## Issue

- avoid IPv6 wifi, sometimes failed to fetch server

  - npm --node-options "--dns-result-order=ipv4first" run dev

## Backlog (Future Plan)

✅ Pool Table with the same company must have a unique name
✅ Product with the same company must have a unique name
✅ Packet with the same company and the same rate must have a unique name
✅ Tax with the same company must have a unique name
✅ Discount with the same company must have a unique name
❌ Setup Cancelled Feature (Refund use case)
❌ Reconfig Sidebar -> https://ui.shadcn.com/blocks
❌ "react-to-print" version after learn their recent documentation
❌ Relate the Discount Table -> Product Table (So each product can have discount configuration) m2n
❌ Learn Convex Ents: https://labs.convex.dev/convex-ents

### Bugs ASAP

## Feature Stockable Products (Current Plan)

✅ Add isStockable field on Table Companies
✅ Add field on countIsStock on Table Products
❌ Implement Stock Column on Product Table
❌ Setup default stcokable when user create a product (set to 0)
❌ Only Manager Access Level to CRUD the Product Stock
❌ Add stock field on Edit Product
❌ Add stock on Cafe Dialog
❌ Add stock on Cafe Dialog
❌ Cafe Cart Configuration related to add/update/remove product
❌ Admin Access Level to toggle isStockable feature on Profile Page

## Update Packages (Current Plan)

✅ Update TailwindCss & Shadcn
❌ Update Nextjs
❌ Update others (optional)
❌ Optimizing Portal Page
❌ Optimizing (tweak between loading.tsx with <Suspense />) Configuration on all pages.
