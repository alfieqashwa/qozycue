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
❌ Use `toast.info` to remove the product
❌ Order & Archive Table List (Rollover & Remove All selected columns)
❌ Booking-Schedule
❌ Dashboard

✅ (bug) Fix cafe order menu
✅ Move Button Edit and Delete Product and Packet into row list of table
✅ Restrict to edit and delete enabled product(s) and packet(s)
✅ Restrict to delete enabled poolTable(s)

## Backlog (Future Plan)

❌ Setup Cancelled Feature
❌ Pool Table with the same company must have a unique name
❌ Restrict to disabled the product(s) and packet(s) when they are in OPEN and PENDING order
❌ Update library "react-to-print" version after learn their recent documentation
❌ Relate the Discount Table -> Product Table (So each product can have discount configuration) m2n
❌ Learn Convex Ents: https://labs.convex.dev/convex-ents

### Bugs ASAP

- When Payment, the pooltable endTime is not back to null
  ✅ when creating startTimer in pool table where has/have ordered, the timer not display properly (assuming the bug is on api.orders.findByPoolTable )
  ❌ Button Update Duration: Situation: if set to 4 hours, and the time is clocking 3 hours, it should cannot to update to less than the clocking time (eg. to 2 hrs)
