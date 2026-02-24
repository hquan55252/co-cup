"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-white",
        nav: "space-x-1 flex items-center absolute w-full justify-between z-10",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-0 rounded-md border border-slate-700 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-0 rounded-md border border-slate-700 absolute right-1"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-slate-500 rounded-md w-9 font-medium text-[0.75rem] uppercase tracking-wider",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].outside)]:bg-yellow-500/10 [&:has([aria-selected])]:bg-yellow-500/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-slate-300 hover:bg-slate-700 hover:text-white rounded-md aria-selected:opacity-100 transition-colors"
        ),
        range_end: "day-range-end",
        selected: "bg-yellow-500 text-slate-950 font-bold hover:bg-yellow-400 hover:text-slate-950 focus:bg-yellow-500 focus:text-slate-950 rounded-md",
        today: "bg-slate-700 text-white font-semibold rounded-md",
        outside: "outside text-slate-600 opacity-50 aria-selected:bg-yellow-500/10 aria-selected:text-slate-400 aria-selected:opacity-30",
        disabled: "text-slate-700 opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-700",
        range_middle: "aria-selected:bg-yellow-500/10 aria-selected:text-yellow-300",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
