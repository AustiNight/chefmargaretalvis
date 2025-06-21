import { sendMessageNotification } from "@/utils/emailNotifications"

export type FormSubmission = {
  id: string
  type: "contact" | "gift-certificate"
  timestamp: string
  name: string
  email: string
  message?: string

  // Contact form specific fields
  contactType?: "general" | "booking"
  date?: string
  guests?: string
  serviceType?: string

  // Gift certificate specific fields
  amount?: string
  customAmount?: string
  recipientName?: string
  recipientEmail?: string
  paymentAppUsername?: string
  isProcessed?: boolean
}

// Get all form submissions
export function getFormSubmissions(): FormSubmission[] {
  if (typeof window === "undefined") {
    return []
  }

  const storedSubmissions = localStorage.getItem("formSubmissions")
  if (!storedSubmissions) {
    return []
  }

  try {
    return JSON.parse(storedSubmissions) as FormSubmission[]
  } catch (error) {
    console.error("Error parsing form submissions:", error)
    return []
  }
}

// Save a new form submission
export async function saveFormSubmission(submission: FormSubmission): Promise<void> {
  if (typeof window === "undefined") {
    return
  }

  const submissions = getFormSubmissions()
  submissions.push(submission)
  localStorage.setItem("formSubmissions", JSON.stringify(submissions))

  // Send email notification
  await sendMessageNotification(submission)
}

// Mark a gift certificate submission as processed
export function markGiftCertificateAsProcessed(id: string): void {
  if (typeof window === "undefined") {
    return
  }

  const submissions = getFormSubmissions()
  const updatedSubmissions = submissions.map((submission) => {
    if (submission.id === id && submission.type === "gift-certificate") {
      return { ...submission, isProcessed: true }
    }
    return submission
  })

  localStorage.setItem("formSubmissions", JSON.stringify(updatedSubmissions))
}

// Delete a form submission
export function deleteFormSubmission(id: string): void {
  if (typeof window === "undefined") {
    return
  }

  const submissions = getFormSubmissions()
  const updatedSubmissions = submissions.filter((submission) => submission.id !== id)
  localStorage.setItem("formSubmissions", JSON.stringify(updatedSubmissions))
}
