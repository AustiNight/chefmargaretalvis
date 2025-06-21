// Debug utility for troubleshooting

export function logDebug(component: string, message: string, data?: any) {
  const timestamp = new Date().toISOString()
  const logPrefix = `[${timestamp}] [${component}]`

  console.log(`${logPrefix} ${message}`, data || "")

  // Also add to debug element if it exists
  if (typeof window !== "undefined") {
    const debugOutput = document.getElementById("debug-output")
    if (debugOutput) {
      const newEntry = `\n${logPrefix} ${message} ${data ? JSON.stringify(data) : ""}`
      debugOutput.textContent += newEntry

      // Show the debug container
      const container = document.getElementById("debug-container")
      if (container) {
        container.style.display = "block"
      }
    }
  }
}

// Function to create a minimal fallback page
export function createFallbackPage(errorMessage: string) {
  if (typeof document !== "undefined") {
    const mainElement = document.createElement("main")
    mainElement.style.padding = "20px"
    mainElement.style.fontFamily = "system-ui, sans-serif"

    const heading = document.createElement("h1")
    heading.textContent = "Chef Margaret Alvis"
    heading.style.fontSize = "24px"
    heading.style.marginBottom = "10px"

    const errorBox = document.createElement("div")
    errorBox.style.padding = "15px"
    errorBox.style.backgroundColor = "#fff3cd"
    errorBox.style.border = "1px solid #ffeeba"
    errorBox.style.borderRadius = "4px"
    errorBox.style.marginTop = "20px"

    const errorTitle = document.createElement("h2")
    errorTitle.textContent = "Error Loading Page"
    errorTitle.style.fontSize = "18px"
    errorTitle.style.marginBottom = "10px"

    const errorText = document.createElement("p")
    errorText.textContent = errorMessage

    errorBox.appendChild(errorTitle)
    errorBox.appendChild(errorText)

    mainElement.appendChild(heading)
    mainElement.appendChild(errorBox)

    // Clear body and append our fallback
    document.body.innerHTML = ""
    document.body.appendChild(mainElement)
  }
}

// Function to toggle debug panel visibility
export function toggleDebugPanel() {
  if (typeof window !== "undefined") {
    const debugContainer = document.getElementById("debug-container")
    if (debugContainer) {
      const currentDisplay = debugContainer.style.display
      debugContainer.style.display = currentDisplay === "none" ? "block" : "none"
    }
  }
}

// Add a global debug function
if (typeof window !== "undefined") {
  ;(window as any).toggleDebug = toggleDebugPanel
  ;(window as any).logDebug = logDebug

  // Add keyboard shortcut (Ctrl+Shift+D) to toggle debug panel
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      toggleDebugPanel()
    }
  })
}
