/*
This component is the main component. It can receive various props as parameters (see the documentation).
It simply displays the different elements of the datepicker and is updated via a useEffect whenever the state changes.
*/
import Calendar from './calendar'
import Header from './header'
import InputDate from './InputDate'
import { useEffect, useReducer } from 'react'
import reducer from './reducer'
import { GlobalType, HeaderConfigType, CalendarConfigType, InputConfigType } from './types'

interface Props {
    date?: Date,
    setChoice: (formatedDate: string) => void,
    userGlobalConfig?: GlobalType,
    userHeaderConfig?: HeaderConfigType,
    userCalendarConfig?: CalendarConfigType,
    userInputConfig?: InputConfigType
}
export function Datepicker({ date = new Date(), setChoice, userGlobalConfig={}, userHeaderConfig={}, userCalendarConfig={}, userInputConfig={} }: Props) {
    const [state, dispatch] = useReducer(reducer, {
        selectedDate: date,
        selectedYear: date.getFullYear(),
        selectedMonth: date.getMonth(),
        selectedDayIndex: date.getDay(),
        selectedDay: date.getDate(),
        /*---------*/
        preSelectedDate: date,
        preSelectedYear: date.getFullYear(),
        preSelectedMonth: date.getMonth(),
        preSelectedDayIndex: date.getDay(),
        preSelectedDay: date.getDate(),
        /*------*/
        calendarStatus: false
    })
    const globalConfig: GlobalType = {
        globalContainerClassName: "datepicker",
        datepickerLang: "FR",
        iconCalendarClassName: "iconCalendar",
        iconCalendar: <button>Toggle Datepicker</button>,
        iconCalendarHidden: false,
        inputAndIconContainerClassName: "inputContainer"
    }
    Object.assign(globalConfig,userGlobalConfig)
    const headerConfig: HeaderConfigType = {
        headerClassName: "datepickerHeader",
        headerPreviousButtonClassName: "previousBtn",
        headerPreviousButtonText: "Précédent",/* Laisser la possibilité de mettre un react node*/
        headerNextButtonText: "Suivant",
        headerNextButtonClassName: "NextBtn",
        headerResetButtonClassName: "resetDatepicker",
        headerResetButtonText: "Reset !",/* Laisser la possibilité de mettre un react node*/
        selectYearClassName: "selectYear",
        selectYearGapBefore: 5,
        selectYearGapAfter: 5,
        selectYearHidden: true,
        resetButtonClassName: "resetBtn",
        resetButtonText: "Reset",/* Laisser la possibilité de mettre un react node*/
        resetButtonHidden: true,
    }
    const calendarConfig: CalendarConfigType = {
        calendarTableClassName: "calendar",
        theadContent: "FL",/* FL : FirstLetter | TL : ThreeLetters | FW : FullWord*/
        calendarPreviousMonthDayClassName: "previousMonth",
        calendarNextMonthDayClassName: "nextMonth",
        calendarCurrentMonthDayClassName: "currentMonth",
    }
    const inputDateConfig: InputConfigType = {
        inputClassName: "inputDatepicker",
        errorFormatMessage: "The date format is incorrect.",
        errorFormatContainerClass: "errorDatePickerDateFormat",
        regexDateFR: /^(0[1-9]|[1-2]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        regexDateUS: /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2]\d|3[01])\/\d{4}$/,
        customRegex: undefined,
        characterSplitDate: "/",
        openCalendar: true,
        labelText: "My custom input"
    }
    const toggleOpen = (e?: React.MouseEvent<HTMLDivElement>) => {
        if (e)
            e.preventDefault()
        dispatch({ type: "toggleCalendar" })
    }
    useEffect(() => {
        setChoice(state.selectedDate.toLocaleDateString())
    }, [state.selectedDate])
    return (
        <div className={globalConfig.globalContainerClassName}>
            <div className={globalConfig.inputAndIconContainerClassName}>
                <InputDate state={state} dispatch={dispatch} globalConfig={Object.assign(globalConfig, userGlobalConfig)} inputDateConfig={Object.assign(inputDateConfig, userInputConfig)} />
                {!globalConfig.iconCalendarHidden && <div className={globalConfig.iconCalendarClassName} onClick={(e) => { toggleOpen(e) }}>{globalConfig.iconCalendar}</div>}
            </div>
            {state.calendarStatus &&
                <>
                    <Header state={state} dispatch={dispatch} headerConfig={Object.assign(headerConfig, userHeaderConfig)} globalConfig={Object.assign(globalConfig, userGlobalConfig)} />
                    <Calendar state={state} dispatch={dispatch} calendarConfig={Object.assign(calendarConfig, userCalendarConfig)} globalConfig={Object.assign(globalConfig, userGlobalConfig)} />
                </>
            }
        </div>
    )
}
