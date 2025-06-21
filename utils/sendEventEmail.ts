import type { Event, User } from "@/types"
import { saveNotification, updateUserContactInfo } from "@/utils/users"

export async function sendEventEmail(
  event: Event,
  recipients: User[],
): Promise<{ success: string[]; failed: string[] }> {
  // In a real application, this would connect to an email service
  // For this demo, we'll simulate sending emails
  console.log("Sending email for event:", event)
  console.log("Recipients:", recipients)

  const successIds: string[] = []
  const failedIds: string[] = []

  // Simulate sending emails with some random successes/failures
  for (const recipient of recipients) {
    try {
      // Simulate API call to email service
      await new Promise((resolve) => setTimeout(resolve, 100))

      // 95% success rate for demo purposes
      const isSuccess = Math.random() > 0.05

      if (isSuccess) {
        // Record successful notification
        saveNotification({
          userId: recipient.id,
          eventId: event.id,
          eventName: event.description,
          sentDate: new Date().toISOString(),
          status: "success",
        })

        // Update user's last contacted info
        updateUserContactInfo(recipient.id, event.id, event.description)

        successIds.push(recipient.id)
      } else {
        // Record failed notification
        saveNotification({
          userId: recipient.id,
          eventId: event.id,
          eventName: event.description,
          sentDate: new Date().toISOString(),
          status: "failed",
        })

        failedIds.push(recipient.id)
      }
    } catch (error) {
      console.error(`Error sending email to ${recipient.email}:`, error)
      failedIds.push(recipient.id)

      // Record failed notification
      saveNotification({
        userId: recipient.id,
        eventId: event.id,
        eventName: event.description,
        sentDate: new Date().toISOString(),
        status: "failed",
      })
    }
  }

  return {
    success: successIds,
    failed: failedIds,
  }
}

export function generateEventEmailContent(event: Event): string {
  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Event from Chef Margaret Alvis</h2>
      
      <div style="margin: 20px 0;">
        <img src="${event.image}" alt="${event.description}" style="max-width: 100%; border-radius: 8px;" />
      </div>
      
      <h3>${event.description}</h3>
      <p><strong>Date:</strong> ${eventDate}</p>
      
      <p>
        I'm excited to invite you to this upcoming event. Save the date and stay tuned for more details!
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          You're receiving this email because you subscribed to updates from Chef Margaret Alvis.
          <br>
          To unsubscribe, please <a href="#" style="color: #666;">click here</a>.
        </p>
      </div>
    </div>
  `
}
