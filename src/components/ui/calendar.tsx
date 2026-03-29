"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker } from "react-day-picker"
import type { CalendarMonth } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomMonthCaption({ calendarMonth }: { calendarMonth: CalendarMonth; displayIndex: number }) {
    const { goToMonth, nextMonth, previousMonth, formatters, dayPickerProps } = useDayPicker()
    const locale = dayPickerProps.locale

    return (
        <div className="flex items-center justify-between px-1 py-1">
            <button
                onClick={() => previousMonth && goToMonth(previousMonth)}
                disabled={!previousMonth}
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 bg-white/5 border-white/10 text-white hover:bg-white/15 hover:text-white p-0",
                    !previousMonth && "opacity-30 cursor-not-allowed"
                )}
                aria-label="Önceki ay"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm font-semibold text-white">
                {formatters.formatMonthCaption(calendarMonth.date, { locale: locale as import("date-fns").Locale | undefined })}
            </span>

            <button
                onClick={() => nextMonth && goToMonth(nextMonth)}
                disabled={!nextMonth}
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 bg-white/5 border-white/10 text-white hover:bg-white/15 hover:text-white p-0",
                    !nextMonth && "opacity-30 cursor-not-allowed"
                )}
                aria-label="Sonraki ay"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    )
}

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
            components={{
                MonthCaption: CustomMonthCaption,
                Nav: () => <></>,
            }}
            classNames={{
                root: "w-full",
                months: "flex flex-col sm:flex-row gap-2",
                month: "flex flex-col gap-2 w-full",
                month_caption: "w-full",
                caption_label: "hidden",
                nav: "hidden",
                month_grid: "w-full border-collapse",
                weekdays: "flex w-full",
                weekday: "text-indigo-300/60 rounded-md w-9 font-normal text-[0.75rem] text-center py-1",
                week: "flex w-full mt-1",
                day: "relative p-0 text-center text-sm [&:has([aria-selected])]:rounded-md",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-9 p-0 font-normal text-white aria-selected:opacity-100",
                    "hover:bg-indigo-500/30 hover:text-white",
                    "focus-visible:ring-1 focus-visible:ring-indigo-400"
                ),
                selected: "!bg-indigo-600 !text-white rounded-md",
                today: "bg-white/10 text-white font-semibold rounded-md",
                outside: "opacity-30 [&_button]:text-slate-400",
                disabled: "text-white/20 opacity-40",
                range_start: "aria-selected:bg-indigo-600 aria-selected:text-white rounded-l-md",
                range_end: "aria-selected:bg-indigo-600 aria-selected:text-white rounded-r-md",
                range_middle: "aria-selected:bg-indigo-500/20 aria-selected:text-white",
                hidden: "invisible",
                ...classNames,
            }}
            {...props}
        />
    )
}

export { Calendar }
