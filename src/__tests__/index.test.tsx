import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { JsonViewer } from "../JsonViewer"

// Mock the clipboard API
beforeAll(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  })
})

describe("jsonViewer", () => {
  it("renders correctly with a simple JSON object", async () => {
    const data = { myKey: "my-value" }
    render(<JsonViewer data={data} />)

    // not visible by default
    expect(await screen.queryByText(/myKey/)).not.toBeInTheDocument()
    expect(screen.queryByText(/my-value/)).not.toBeInTheDocument()

    // do the toggle
    userEvent.click(screen.getByText("{ ... }"))
    expect(await screen.findByText(/my-value/)).toBeInTheDocument()
    expect(await screen.findByText(/my-value/)).toBeInTheDocument()
    expect(await screen.findByText(/myKey/)).toBeInTheDocument()
  })
  it("renders correctly with different value types", async () => {
    const data = { myNumber: 123, myBoolean: true, myNull: null }
    render(<JsonViewer data={data} />)

    // do the toggle
    userEvent.click(screen.getByText("{ ... }"))
    expect(await screen.findByText(/myNumber/)).toBeInTheDocument()
    expect(await screen.findByText(/123/)).toBeInTheDocument()
    expect(await screen.findByText(/true/)).toBeInTheDocument()
    expect(await screen.findByText(/null/)).toBeInTheDocument()
  })

  it("renders correctly with a nested JSON object", async () => {
    const data = { key: { nestedKey: "nestedValue" } }
    render(<JsonViewer data={data} />)

    userEvent.click(screen.getByText("{ ... }"))
    expect(await screen.findByText(/key/)).toBeInTheDocument()

    // should still be collapsed
    expect(screen.queryByText(/nestedKey/)).not.toBeInTheDocument()
    expect(screen.queryByText(/nestedValue/)).not.toBeInTheDocument()

    // toggle the nested object
    userEvent.click(screen.getByText(/key/))

    expect(await screen.findByText(/nestedKey/)).toBeInTheDocument()
    expect(await screen.findByText(/nestedValue/)).toBeInTheDocument()
  })

  it("renders correctly with a nested array in the JSON", async () => {
    const data = { key: ["nestedvalue1", "nestedValue2"] }
    render(<JsonViewer data={data} />)

    userEvent.click(screen.getByText("{ ... }"))
    expect(await screen.findByText(/key/)).toBeInTheDocument()

    // should still be collapsed
    expect(await screen.findByText(/\[ \.\.\. \]/)).toBeInTheDocument()

    // toggle the nested object
    userEvent.click(screen.getByText(/\[ \.\.\. \]/))

    expect(await screen.findByText(/nestedvalue1/)).toBeInTheDocument()
    expect(await screen.findByText(/nestedValue2/)).toBeInTheDocument()
  })

  it("renders a string value correctly", () => {
    const data = "simple string"
    render(<JsonViewer data={data} />)

    expect(screen.getByText(/simple string/)).toBeInTheDocument()
  })

  it("copies a value to the clipboard", async () => {
    const data = { key: "value" }
    render(<JsonViewer data={data} />)
    userEvent.hover(screen.getByText("{ ... }"))
    const copyButton = await screen.findByLabelText(/copy-button/)
    userEvent.click(copyButton)
    userEvent.unhover(screen.getByText("{ ... }"))

    // Check if the clipboard writeText method was called
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify(data, null, 2),
      ),
    )
  })

  it("copies all values to the clipboard", async () => {
    const nesterData = { nestedKey: "nestedValue" }
    const data = { myKey: nesterData }
    render(<JsonViewer data={data} />)

    // toggle the nested object
    userEvent.click(screen.getByText("{ ... }"))

    userEvent.click(await screen.findByText(/myKey :.*\{ \.\.\. \}/))
    // copy the nested value
    userEvent.hover(await screen.findByText(/nestedKey/))
    const nestedCopyButton = await screen.findByLabelText(
      /copy-button-myKey-nestedKey/,
    )
    userEvent.click(nestedCopyButton)
    userEvent.hover(screen.getByText(/nestedKey/))

    // Check if the clipboard writeText method was called correctly
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify("nestedValue", null, 2),
      ),
    )

    // can also copy the myKey value
    userEvent.hover(await screen.findByText(/myKey/))
    const copyButton = await screen.findByLabelText(/copy-button-myKey$/)
    userEvent.click(copyButton)
    userEvent.hover(screen.getByText(/myKey/))

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify(nesterData, null, 2),
      ),
    )
  })
})
