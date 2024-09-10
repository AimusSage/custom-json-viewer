import { ContentCopy, ExpandLess, ExpandMore } from "@mui/icons-material"
import {
  Box,
  Grid2,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import "./app.css" // Import the CSS file

interface JsonViewerProps {
  data: object
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({
    __topLevel__: true,
  })

  useEffect(() => {
    // Initialize the collapsed state with first-level keys set to true
    const initialCollapsedState: { [key: string]: boolean } = {}
    const iterateCollapse = (values: any, parentKey: string = "") => {
      if (typeof values === "object" && values !== null) {
        Object.keys(values).forEach((key) => {
          const fullKey = parentKey ? `${parentKey}.${key}` : key
          initialCollapsedState[fullKey] = true
          return iterateCollapse(values[key], fullKey)
        })
      }
    }
    iterateCollapse(data)
    setCollapsed((prevState) => ({ ...prevState, ...initialCollapsedState }))
  }, [data])

  const toggleCollapse = (key: string) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }))
  }

  const copyToClipboard = (value: any) => {
    navigator.clipboard
      .writeText(JSON.stringify(value, null, 2))
      .catch((err) => alert(`Failed to copy: ${err}`))
  }

  const renderJson = (data: any, parentKey: string = "") => {
    if (typeof data === "object" && data !== null) {
      return (
        <List component="ul" sx={{ paddingLeft: 2 }}>
          {Object.entries(data).map(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key
            const isCollapsed = collapsed[fullKey]
            const isObject = typeof value === "object" && value !== null
            const isArray = Array.isArray(value)

            return (
              <ListItem component="li" key={fullKey} sx={{ marginBottom: 1 }}>
                {isObject ? (
                  <Grid2 container>
                    <Grid2>
                      {isCollapsed && (
                        <Box>
                          <span onClick={() => toggleCollapse(fullKey)}>
                            <Typography
                              variant="body1"
                              component="span"
                              className="json-key"
                            >
                              {key}:{" "}
                              {isArray ? "[...]" : isObject ? "{...}" : ""}
                            </Typography>
                            <IconButton size="small">
                              {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                            </IconButton>
                          </span>
                          <IconButton
                            onClick={() => copyToClipboard(value)}
                            size="small"
                          >
                            <ContentCopy />
                          </IconButton>
                        </Box>
                      )}
                    </Grid2>
                    {!isCollapsed && (
                      <Grid2>
                        <span onClick={() => toggleCollapse(fullKey)}>
                          <Typography
                            variant="body1"
                            component="span"
                            className="json-key"
                          >
                            {key}: {isArray ? "[" : isObject ? "{" : ""}
                          </Typography>
                          <IconButton size="small">
                            {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                          </IconButton>
                        </span>
                        <IconButton
                          onClick={() => copyToClipboard(value)}
                          size="small"
                        >
                          <ContentCopy />
                        </IconButton>
                        {renderJson(value, fullKey)}
                        <Typography variant="body1" component="span">
                          {isArray ? "]" : isObject ? "}" : ""}
                        </Typography>
                      </Grid2>
                    )}
                  </Grid2>
                ) : (
                  <Grid2>
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
                  </Grid2>
                )}
              </ListItem>
            )
          })}
        </List>
      )
    } else {
      return (
        <Typography variant="body1" component="span" className="json-value">
          {String(data)}
        </Typography>
      )
    }
  }
  console.log(collapsed["__topLevel__"])
  return (
    <Grid2 container className="json-viewer">
      {collapsed["__topLevel__"] && (
        <Grid2 sx={{ paddingLeft: 2 }}>
          <Typography
            variant="h6"
            component="span"
            className="json-key"
            onClick={() => toggleCollapse("__topLevel__")}
          >
            {Array.isArray(data) ? "[...]" : "{...}"}
          </Typography>
          <IconButton
            onClick={() => toggleCollapse("__topLevel__")}
            size="small"
          >
            {collapsed["__topLevel__"] ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
          <IconButton onClick={() => copyToClipboard(data)} size="small">
            <ContentCopy />
          </IconButton>
        </Grid2>
      )}

      {!collapsed["__topLevel__"] && (
        <Grid2 sx={{ paddingLeft: 2 }}>
          <Typography
            variant="body1"
            component="span"
            onClick={() => toggleCollapse("__topLevel__")}
          >
            {Array.isArray(data) ? "[" : "{"}
          </Typography>
          <IconButton
            onClick={() => toggleCollapse("__topLevel__")}
            size="small"
          >
            {collapsed["__topLevel__"] ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
          <IconButton onClick={() => copyToClipboard(data)} size="small">
            <ContentCopy />
          </IconButton>
          {renderJson(data)}
          <Typography variant="body1" component="span">
            {Array.isArray(data) ? "]" : "}"}
          </Typography>
        </Grid2>
      )}
    </Grid2>
  )
}

export default JsonViewer
