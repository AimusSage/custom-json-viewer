import React from "react"
import "./App.css"
import { JsonViewer } from "./JsonViewer"

const sampleJson = JSON.stringify({
  name: "John Doe",
  age: 30,
  address: {
    street: "dorpstraat 3",
    postalCode: "1234 AB",
    city: "Bovendorp",
    country: "Netherlands",
  },
  hobbies: [
    { reading: { type: "passive", preferenceRating: 2 } },
    { football: { type: "active", preferenceRating: 1 } },
    { traveling: { type: "hybrid", preferenceRating: 3 } },
  ],
  isSmart: false,
  birthDate: new Date("1990-11-30T11:30:00.000Z"),
})

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Custom JSON Viewer</h1>
      <JsonViewer data={JSON.parse(sampleJson)} />
    </div>
  )
}

export default App
