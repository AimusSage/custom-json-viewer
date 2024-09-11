import { ContentCopy, ExpandLess } from "@mui/icons-material"
import {
  Box,
  Grid2,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material"
import React, { useState } from "react"

const valueFormatter = (value: unknown) => {
  // const color = typeof value === 'string' ? 'red' : 'blue'
  const parsedValue = typeof value === "string" ? `"${value}"` : String(value)

  return (
    <Typography variant="body1" component="span" sx={{ marginLeft: 1 }}>
      {parsedValue}
    </Typography>
  )
}
const parentCopyHoverStyle = (className: string) => ({
  position: "relative",
  [`&:hover .${className}`]: { visibility: "visible" },
})

const copyIconHoverStyle = {
  visibility: "hidden",
}

interface JsonKeyValueProps {
  copyToClipboard: (value: unknown) => void
  fullKey: string
  keyName: string
  value: unknown
  renderJson: (renderData: object, parentKey: string) => JSX.Element
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
    <ListItem dense key={fullKey} sx={{ marginBottom: 0 }}>
      {isObject ? (
        <Grid2 key={fullKey} container>
          {collapsed && (
            <Grid2 sx={parentCopyHoverStyle(copyClassName)}>
              <Box component="span" onClick={toggleCollapse}>
                <Typography
                  sx={{ cursor: "pointer" }}
                  variant="body1"
                  component="span"
                  className="json-key"
                >
                  {keyName ? `${keyName} : ` : ""}
                  {isArray && "[ ... ]"}
                  {isObject && !isArray && "{ ... }"}
                </Typography>
              </Box>
              <IconButton
                sx={{ ...copyIconHoverStyle, fontSize: "0.8rem" }}
                aria-label={copyClassName}
                className={copyClassName}
                onClick={() => copyToClipboard(value)}
                size="small"
              >
                <ContentCopy sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Grid2>
          )}
          {!collapsed && (
            <Grid2>
              <Box component="span" sx={parentCopyHoverStyle(copyClassName)}>
                <Box component="span" onClick={toggleCollapse}>
                  <Typography
                    sx={{ cursor: "pointer" }}
                    variant="body1"
                    component="span"
                    className="json-key"
                  >
                    {keyName ? `${keyName} : ` : ""}
                    {isArray && "["}
                    {!isArray && isObject && "{"}
                  </Typography>
                  <IconButton sx={{ fontSize: "0.8rem" }} size="small">
                    <ExpandLess sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </Box>
                <IconButton
                  aria-label={copyClassName}
                  sx={{ ...copyIconHoverStyle, fontSize: "0.8rem" }}
                  className={copyClassName}
                  onClick={() => copyToClipboard(value)}
                  size="small"
                >
                  <ContentCopy sx={{ fontSize: "1rem" }} />
                </IconButton>
              </Box>
              {renderJson(value, fullKey)}
              <Typography variant="body1" component="span">
                {isArray && "]"}
                {!isArray && isObject && "}"}
              </Typography>
            </Grid2>
          )}
        </Grid2>
      ) : (
        <Grid2 key={fullKey} container sx={parentCopyHoverStyle(copyClassName)}>
          <Grid2>
            <Typography variant="body1" component="span">
              {keyName}:{" "}
            </Typography>
            {valueFormatter(value)}
            <IconButton
              sx={{ ...copyIconHoverStyle, fontSize: "0.8rem" }}
              aria-label={copyClassName}
              className={copyClassName}
              onClick={() => copyToClipboard(value)}
              size="small"
            >
              <ContentCopy sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Grid2>
        </Grid2>
      )}
    </ListItem>
  )
}

interface JsonViewerProps {
  data: unknown
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const copyToClipboard = (value: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2))
  }

  const renderJson = (renderData: object, parentKey: string) => (
    <List sx={{ paddingLeft: 2 }}>
      {Object.entries(renderData).map(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key
        return (
          <JsonKeyValue
            key={fullKey}
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

  return (
    <Grid2
      container
      sx={{
        "font-family": "monospace",
        padding: "10px",
        "border-radius": "5px",
      }}
    >
      <JsonKeyValue
        copyToClipboard={copyToClipboard}
        fullKey=""
        keyName=""
        value={data}
        renderJson={renderJson}
      />
    </Grid2>
  )
}
