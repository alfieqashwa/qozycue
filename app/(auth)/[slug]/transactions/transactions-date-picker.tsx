import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { Button } from "@/components/ui/button"

export function TransactionDatePicker({
  date,
  setDate,
}: {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}) {
  return (
    <div className="hidden md:absolute md:-top-14 md:right-0 md:block">
      <div className="flex w-full flex-col items-end space-y-2 md:w-auto md:flex-row md:justify-end md:space-x-2 md:space-y-0">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              setDate({
                from: addDays(new Date(new Date().setHours(0, 0, 0, 0)), -30),
                to: new Date(new Date().setHours(23, 59, 59, 0)),
              })
            }
          >
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setDate({
                from: new Date(2024, 0, 1),
                to: new Date(new Date().setHours(23, 59, 59, 0)),
              })
            }
          >
            All
          </Button>
        </div>
        <DatePickerWithRange date={date} setDate={setDate} align="end" />
      </div>
    </div>
  )
}
