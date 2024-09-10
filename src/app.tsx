import React from "react"
import "./App.css"
import JsonViewer from "./jsonviewer"

const sampleJson = [
  {
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
  },
]

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Custom JSON Viewer</h1>
      <JsonViewer data={sampleJson} />
    </div>
  )
}

export default App
