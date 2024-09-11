import { ContentCopy, ExpandLess, ExpandMore } from "@mui/icons-material"
import {
  Box,
  Grid2,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import "./app.css" // Import the CSS file

const parentCopyHoverStyle = (className: string = "") => ({
  position: "relative",
  [`&:hover .${className}`]: { visibility: "visible" },
})

const copyIconHoverStyle = {
  visibility: "hidden",
}

interface JsonKeyValueProps {
  copyToClipboard: (value: any) => void
  fullKey: string
  keyName: string
  value: any
  renderJson: (data: any, parentKey: string) => JSX.Element
}

const JsonKeyValue: React.FC<JsonKeyValueProps> = ({
  copyToClipboard,
  fullKey,
  keyName,
  value,
  renderJson,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  const isObject = typeof value === "object" && value !== null
  const isArray = Array.isArray(value)
  const copyClassName = `copy-button-${fullKey.replace(/\./g, "-")}`

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <ListItem key={fullKey} sx={{ marginBottom: 0 }}>
      {isObject ? (
        <Grid2 key={fullKey} container>
          {collapsed && (
            <Grid2 sx={parentCopyHoverStyle(copyClassName)}>
              <Box component="span" onClick={toggleCollapse}>
                <Typography
                  variant="body1"
                  component="span"
                  className="json-key"
                >
                  {keyName ? `${keyName} : ` : ""}
                  {isArray ? "[...]" : isObject ? "{...}" : ""}
                </Typography>
                <IconButton size="small">
                  <ExpandMore />
                </IconButton>
              </Box>
              <IconButton
                sx={copyIconHoverStyle}
                className={copyClassName}
                onClick={() => copyToClipboard(value)}
                size="small"
              >
                <ContentCopy />
              </IconButton>
            </Grid2>
          )}
          {!collapsed && (
            <Grid2>
              <Box component="span" sx={parentCopyHoverStyle(copyClassName)}>
                <Box component="span" onClick={toggleCollapse}>
                  <Typography
                    variant="body1"
                    component="span"
                    className="json-key"
                  >
                    {keyName ? `${keyName} : ` : ""}
                    {isArray ? "[" : isObject ? "{" : ""}
                  </Typography>
                  <IconButton size="small">
                    <ExpandLess />
                  </IconButton>
                </Box>
                <IconButton
                  sx={copyIconHoverStyle}
                  className={copyClassName}
                  onClick={() => copyToClipboard(value)}
                  size="small"
                >
                  <ContentCopy />
                </IconButton>
              </Box>
              {renderJson(value, fullKey)}
              <Typography variant="body1" component="span">
                {isArray ? "]" : isObject ? "}" : ""}
              </Typography>
            </Grid2>
          )}
        </Grid2>
      ) : (
        <Grid2 sx={parentCopyHoverStyle(copyClassName)}>
          <Typography variant="body1" component="span" className="json-key">
            {keyName}:{" "}
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
            sx={copyIconHoverStyle}
            className={copyClassName}
            onClick={() => copyToClipboard(value)}
            size="small"
          >
            <ContentCopy />
          </IconButton>
        </Grid2>
      )}
    </ListItem>
  )
}

interface JsonViewerProps {
  data: object
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const copyToClipboard = (value: any) => {
    navigator.clipboard
      .writeText(JSON.stringify(value, null, 2))
      .catch((err) => alert(`Failed to copy: ${err}`))
  }

  const renderJson = (data: any, parentKey: string = "") => {
    if (typeof data === "object" && data !== null) {
      return (
        <List sx={{ paddingLeft: 2 }}>
          {Object.entries(data).map(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key

            return (
              <JsonKeyValue
                copyToClipboard={copyToClipboard}
                fullKey={fullKey}
                keyName={key}
                renderJson={renderJson}
                value={value}
              />
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

  return (
    <Grid2 container className="json-viewer">
      <JsonKeyValue
        copyToClipboard={copyToClipboard}
        fullKey="top-level"
        keyName=""
        value={data}
        renderJson={renderJson}
      />
    </Grid2>
  )
}

export default JsonViewer
