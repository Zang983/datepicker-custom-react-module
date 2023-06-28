import { useState } from "react"
import { Datepicker } from "./components/datepicker"

function App() {
const [choice,setChoice]= useState("")
  return (
    <>

<Datepicker date={new Date()} setChoice={setChoice}  />
    </>
  )
}

export default App
