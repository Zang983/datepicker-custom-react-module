/*
This component is responsible for managing the "header" menu of the calendar. It handles the previous, next, and reset buttons.

It converts the names of the months according to the language of the calendar.

Additionally, there is a function that calculates the number of preceding and succeeding years in the dropdown select.
*/
import { useState, useEffect } from 'react'
import { GlobalType, InputConfigType, StateType as State } from './types'

interface Props {
    state: State,
    dispatch: React.Dispatch<{
        type: string,
        payload?: {
            day: number,
            month: number,
            year: number
        }
    }>,
    globalConfig: GlobalType,
    inputDateConfig: InputConfigType
}

function InputDate({ state, dispatch, globalConfig, inputDateConfig }: Props) {
    const [date, setDate] = useState(state.selectedDate.toLocaleDateString())
    const [isValid, setIsValid] = useState(true)

    function checkInput(input?: string) {
        let regex = null
        const value = input ? input : state.selectedDate.toLocaleDateString("fr-FR")
        if (inputDateConfig.customRegex !== undefined)
            regex = inputDateConfig.customRegex
        else
            regex = globalConfig.datepickerLang === "FR" ? inputDateConfig.regexDateFR : inputDateConfig.regexDateUS
        if (regex && regex.test(value)) {
            setIsValid(true)
            return true
        }
        else {
            setIsValid(false)
            return false
        }
    }
    const openCalendar = () => {
        if (inputDateConfig.openCalendar === true && !state.calendarStatus) {
            dispatch({ type: "openCalendar" })
        }
    }
    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = ""
        if (e.target && e.target.value)
            value = e.target.value
        setDate(value)
        checkInput()
        dispatch({ type: "closeCalendar" })
        if (checkInput(value) && inputDateConfig.characterSplitDate) {
            const data = value.split(inputDateConfig.characterSplitDate)
            if (data && globalConfig.datepickerLang === "FR") {
                dispatch({
                    type: "inputDate", payload: {
                        day: parseInt(data[0], 10),
                        month: parseInt(data[1], 10),
                        year: parseInt(data[2], 10)
                    }
                })
            }
            else {
                dispatch({
                    type: "inputDate", payload: {
                        day: parseInt(data[1], 10),
                        month: parseInt(data[0], 10),
                        year: parseInt(data[2], 10)
                    }
                })
            }
        }
    }
    useEffect(() => {
        if (globalConfig.datepickerLang === "FR")
            setDate(state.selectedDate.toLocaleDateString("fr-FR"))
        else
            setDate(state.selectedDate.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }))
    }, [state.selectedDate])

    return (
        <>
            <label>{inputDateConfig.labelText}
                <input className={inputDateConfig.inputClassName} type="text" value={date}
                    onFocus={() => { openCalendar() }}
                    onChange={e => handleChangeDate(e)} />
            </label>
            {!isValid && <p className={inputDateConfig.errorFormatContainerClass}>{inputDateConfig.errorFormatMessage}</p>}

        </>
    )
}

export default InputDate