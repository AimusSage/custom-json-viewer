import React, { useState, useEffect } from "react"
import { Box, Button, Typography, IconButton } from "@mui/material"
import { ExpandMore, ExpandLess, ContentCopy } from "@mui/icons-material"
import "./app.css" // Import the CSS file

interface JsonViewerProps {
  data: object
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({})
  const [isTopLevelCollapsed, setIsTopLevelCollapsed] = useState<boolean>(false)

  useEffect(() => {
    // Initialize the collapsed state with first-level keys set to true
    const initialCollapsedState: { [key: string]: boolean } = {}
    Object.keys(data).forEach((key) => {
      initialCollapsedState[key] = true
    })
    setCollapsed(initialCollapsedState)
  }, [data])

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
      .catch((err) => alert(`Failed to copy: ${err}`))
  }

  const renderJson = (data: any, parentKey: string = "") => {
    if (typeof data === "object" && data !== null) {
      return (
        <Box component="ul" sx={{ paddingLeft: 2 }}>
          {Object.entries(data).map(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key
            const isCollapsed = collapsed[fullKey]
            const isObject = typeof value === "object" && value !== null
            const isArray = Array.isArray(value)

            return (
              <Box component="li" key={fullKey} sx={{ marginBottom: 1 }}>
                {isObject ? (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        onClick={() => toggleCollapse(fullKey)}
                        size="small"
                      >
                        {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                      </IconButton>
                      {isCollapsed && (
                        <Box>
                          <Typography
                            variant="body1"
                            component="span"
                            className="json-key"
                          >
                            {key}: {isArray ? "[...]" : isObject ? "{...}" : ""}
                          </Typography>
                          {/* <IconButton
                            onClick={() => copyToClipboard(value)}
                            size="small"
                          >
                            <ContentCopy />
                          </IconButton> */}
                        </Box>
                      )}
                    </Box>
                    {!isCollapsed && (
                      <Box>
                        <Typography
                          variant="body1"
                          component="span"
                          className="json-key"
                        >
                          {key}: {isArray ? "[" : isObject ? "{" : ""}
                        </Typography>
                        <IconButton
                          onClick={() => copyToClipboard(value)}
                          size="small"
                        >
                          <ContentCopy />
                        </IconButton>
                        {renderJson(value, fullKey)}
                        <Typography variant="body1" component="span">
                          {isArray ? "[" : isObject ? "{" : ""}
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body1"
                      component="span"
                      className="json-key"
                    >
                      {key}:{" "}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="span"
                      className="json-value"
                      sx={{ marginLeft: 1 }}
                    >
                      {String(value)}
                    </Typography>
                    <IconButton
                      onClick={() => copyToClipboard(value)}
                      size="small"
                    >
                      <ContentCopy />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
      )
    } else {
      return (
        <Typography variant="body1" component="span" className="json-value">
          {String(data)}
        </Typography>
      )
    }
  }

  return (
    <Box className="json-viewer">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={toggleTopLevelCollapse} size="small">
          {isTopLevelCollapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
        {isTopLevelCollapsed && (
          <Box>
            <Typography variant="h6" component="span" className="json-key">
              {Array.isArray(data) ? "[...]" : "{...}"}
            </Typography>
            {/* <IconButton onClick={() => copyToClipboard(data)} size="small">
              <ContentCopy />
            </IconButton> */}
          </Box>
        )}
        <IconButton onClick={() => copyToClipboard(data)} size="small">
          <ContentCopy />
        </IconButton>
      </Box>
      {!isTopLevelCollapsed && (
        <Box sx={{ paddingLeft: 2 }}>
          <Typography variant="body1" component="span">
            {Array.isArray(data) ? "[" : "{"}
          </Typography>
          {renderJson(data)}
          <Typography variant="body1" component="span">
            {Array.isArray(data) ? "]" : "}"}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default JsonViewer
