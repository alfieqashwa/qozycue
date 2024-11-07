# NOTE FOR TICKETS

### 7th Nov 2024

## Settings Page

[-] Modify Create Discount:

    - User can only input name field
    - InputName must be type as number(), min=5, max=100, but on DB is still string()
    - Calculate InputValue into decimal based on InputName
    - If 100%, meaning it's free (config the UI)

[-] Modify Create Tax:

    - Follow the instruction above but,
    - Input Name type number, min=3, max=30

## Backlog (Future Plan)

[-] Relate the Discount Table -> Product Table (So each product can have discount configuration)
