import React, { useState } from "react"

interface JsonViewerProps {
  data: object
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({})
  const [isTopLevelCollapsed, setIsTopLevelCollapsed] = useState<boolean>(false)

  const toggleCollapse = (key: string) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }))
  }

  const toggleTopLevelCollapse = () => {
    setIsTopLevelCollapsed((prevState) => !prevState)
  }

  const copyToClipboard = (value: any) => {
    navigator.clipboard
      .writeText(JSON.stringify(value, null, 2))
      // .then(() => alert("Copied to clipboard!"))
      .catch((err) => alert(`Failed to copy: ${err}`))
  }

  const renderJson = (data: any, parentKey: string = "") => {
    if (typeof data === "object" && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key
            const isCollapsed = collapsed[fullKey]
            const isObject = typeof value === "object" && value !== null

            return (
              <li key={fullKey}>
                {isObject ? (
                  <>
                    <span
                      onClick={() => toggleCollapse(fullKey)}
                      style={{ cursor: "pointer" }}
                    >
                      {isCollapsed ? "▶" : "▼"} <strong>{key}:</strong>
                    </span>
                    <button
                      onClick={() => copyToClipboard(value)}
                      style={{ marginLeft: "10px" }}
                    >
                      Copy
                    </button>
                    {!isCollapsed && renderJson(value, fullKey)}
                  </>
                ) : (
                  <span>
                    <strong>{key}:</strong> {String(value)}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )
    } else {
      return <span>{String(data)}</span>
    }
  }

  return (
    <div className="json-viewer">
      <span onClick={toggleTopLevelCollapse} style={{ cursor: "pointer" }}>
        {isTopLevelCollapsed ? "▶" : "▼"} <strong>JSON Data</strong>
      </span>
      <button
        onClick={() => copyToClipboard(data)}
        style={{ marginLeft: "10px" }}
      >
        Copy All
      </button>
      {!isTopLevelCollapsed && renderJson(data)}
    </div>
  )
}

export default JsonViewer
