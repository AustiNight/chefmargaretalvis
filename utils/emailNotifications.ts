import type { FormSubmission } from "@/utils/formSubmissions"
import { getSiteSettings } from "@/utils/siteSettings"

export async function sendMessageNotification(submission: FormSubmission): Promise<boolean> {
  const settings = getSiteSettings()

  // Check if notifications are enabled
  if (!settings.messageNotifications.enabled) {
    return false
  }

  // Get email addresses
  const emailAddresses = parseEmailAddresses(settings.messageNotifications.emailAddresses)

  if (emailAddresses.length === 0) {
    console.warn("No valid email addresses found for message notifications")
    return false
  }

  try {
    // Call our email API endpoint
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    })

    const result = await response.json()

    if (!result.success) {
      console.error("Error sending email notification:", result.message)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending message notification:", error)
    return false
  }
}

// Parse email addresses from string with various delimiters
function parseEmailAddresses(emailString: string): string[] {
  if (!emailString) return []

  // Split by common delimiters: comma, semicolon, space, newline
  const emails = emailString.split(/[,;\s\n]+/)

  // Filter out empty strings and validate email format
  return emails.map((email) => email.trim()).filter((email) => email && isValidEmail(email))
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate email content based on submission type
export function generateEmailContent(submission: FormSubmission): string {
  const timestamp = new Date(submission.timestamp).toLocaleString()

  let content = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New ${submission.type === "contact" ? "Contact Form" : "Gift Certificate"} Submission</h2>
      <p><strong>Date:</strong> ${timestamp}</p>
      <p><strong>Name:</strong> ${submission.name}</p>
      <p><strong>Email:</strong> ${submission.email}</p>
  `

  if (submission.type === "contact") {
    content += `
      <p><strong>Contact Type:</strong> ${submission.contactType === "general" ? "General Inquiry" : "Booking Request"}</p>
    `

    if (submission.contactType === "booking") {
      content += `
        <p><strong>Preferred Date:</strong> ${new Date(submission.date || "").toLocaleDateString()}</p>
        <p><strong>Number of Guests:</strong> ${submission.guests}</p>
        <p><strong>Service Type:</strong> ${submission.serviceType}</p>
      `
    }

    if (submission.message) {
      content += `
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
          ${submission.message.replace(/\n/g, "<br>")}
        </div>
      `
    }
  } else if (submission.type === "gift-certificate") {
    content += `
      <p><strong>Amount:</strong> $${submission.amount === "Custom" ? submission.customAmount : submission.amount}</p>
      <p><strong>Recipient Name:</strong> ${submission.recipientName}</p>
      <p><strong>Recipient Email:</strong> ${submission.recipientEmail}</p>
      <p><strong>Payment App Username:</strong> ${submission.paymentAppUsername}</p>
    `

    if (submission.message) {
      content += `
        <p><strong>Personal Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
          ${submission.message}
        </div>
      `
    }
  }

  content += `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is an automated notification from Chef Margaret Alvis's website.
          <br>
          You can manage notification settings in the admin dashboard.
        </p>
      </div>
    </div>
  `

  return content
}
