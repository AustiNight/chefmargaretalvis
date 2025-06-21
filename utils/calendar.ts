/**
 * Generates an iCalendar (.ics) file for an event
 */
export function generateICalendarFile(
  title: string,
  startDate: Date,
  endDate: Date | null,
  description: string,
  location = "",
): string {
  // Format date to iCalendar format: YYYYMMDDTHHMMSSZ
  const formatDate = (date: Date): string => {
    return date
      .toISOString()
      .replace(/-|:|\.\d+/g, "")
      .replace(/Z$/, "")
  }

  // If no end date is provided, set it to 2 hours after start date
  if (!endDate) {
    endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 2)
  }

  // Create a unique identifier for the event
  const uid = `event-${Date.now()}@chefmargaretalvis.com`

  // Create the iCalendar content
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Chef Margaret Alvis//Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    location ? `LOCATION:${location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n")

  return icsContent
}

/**
 * Generates a Google Calendar URL for an event
 */
export function generateGoogleCalendarUrl(
  title: string,
  startDate: Date,
  endDate: Date | null,
  description: string,
  location = "",
): string {
  // If no end date is provided, set it to 2 hours after start date
  if (!endDate) {
    endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 2)
  }

  // Format dates for Google Calendar
  const formatDateForGoogle = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, "")
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
    details: description,
  })

  if (location) {
    params.append("location", location)
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generates an Outlook Calendar URL for an event
 */
export function generateOutlookCalendarUrl(
  title: string,
  startDate: Date,
  endDate: Date | null,
  description: string,
  location = "",
): string {
  // If no end date is provided, set it to 2 hours after start date
  if (!endDate) {
    endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 2)
  }

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: description,
  })

  if (location) {
    params.append("location", location)
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Triggers a download of an iCalendar file
 */
export function downloadICalendarFile(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
