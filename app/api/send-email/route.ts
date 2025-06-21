import { NextResponse } from "next/server"
import { Resend } from "resend"
import { getSiteSettings } from "@/utils/siteSettings"
import type { FormSubmission } from "@/utils/formSubmissions"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Get form submission from request
    const submission: FormSubmission = await request.json()

    // Get notification settings
    const settings = getSiteSettings()

    // Check if notifications are enabled
    if (!settings.messageNotifications.enabled) {
      return NextResponse.json({ success: false, message: "Notifications are disabled" }, { status: 200 })
    }

    // Parse email addresses from settings
    const emailAddresses = parseEmailAddresses(settings.messageNotifications.emailAddresses)

    if (emailAddresses.length === 0) {
      return NextResponse.json({ success: false, message: "No valid email addresses configured" }, { status: 200 })
    }

    // Generate email content
    const { subject, htmlContent } = generateEmailContent(submission)

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Chef Margaret Alvis <notifications@chefmargaretalvis.com>`,
      to: emailAddresses,
      subject: subject,
      html: htmlContent,
      reply_to: submission.email,
    })

    if (error) {
      console.error("Error sending email:", error)
      return NextResponse.json({ success: false, message: "Failed to send email", error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Email sent successfully", id: data?.id }, { status: 200 })
  } catch (error) {
    console.error("Error in email API route:", error)
    return NextResponse.json({ success: false, message: "Internal server error", error }, { status: 500 })
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
function generateEmailContent(submission: FormSubmission): { subject: string; htmlContent: string } {
  const timestamp = new Date(submission.timestamp).toLocaleString()
  let subject = ""

  if (submission.type === "contact") {
    subject = `New Contact Form Submission from ${submission.name}`
  } else if (submission.type === "gift-certificate") {
    subject = `New Gift Certificate Request from ${submission.name}`
  }

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

  return { subject, htmlContent: content }
}
