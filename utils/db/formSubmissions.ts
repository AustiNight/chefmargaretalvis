import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import type { FormSubmission } from "@/utils/formSubmissions"

// Get all form submissions
export async function getFormSubmissionsFromDB(): Promise<FormSubmission[]> {
  try {
    const submissions = await sql<FormSubmission[]>`
      SELECT 
        id, 
        type, 
        timestamp::text, 
        name, 
        email, 
        message, 
        contact_type as "contactType", 
        event_date::text as "date", 
        guests, 
        service_type as "serviceType", 
        amount, 
        custom_amount as "customAmount", 
        recipient_name as "recipientName", 
        recipient_email as "recipientEmail", 
        payment_app_username as "paymentAppUsername", 
        is_processed as "isProcessed"
      FROM form_submissions
      ORDER BY timestamp DESC
    `
    return submissions
  } catch (error) {
    console.error("Error fetching form submissions from database:", error)
    return []
  }
}

// Save a new form submission
export async function saveFormSubmissionToDB(submission: Omit<FormSubmission, "id">): Promise<FormSubmission> {
  try {
    const id = uuidv4()
    const [newSubmission] = await sql<FormSubmission[]>`
      INSERT INTO form_submissions (
        id, 
        type, 
        name, 
        email, 
        message, 
        contact_type, 
        event_date, 
        guests, 
        service_type, 
        amount, 
        custom_amount, 
        recipient_name, 
        recipient_email, 
        payment_app_username, 
        is_processed
      )
      VALUES (
        ${id}, 
        ${submission.type}, 
        ${submission.name}, 
        ${submission.email}, 
        ${submission.message}, 
        ${submission.contactType}, 
        ${submission.date}, 
        ${submission.guests}, 
        ${submission.serviceType}, 
        ${submission.amount}, 
        ${submission.customAmount}, 
        ${submission.recipientName}, 
        ${submission.recipientEmail}, 
        ${submission.paymentAppUsername}, 
        ${submission.isProcessed || false}
      )
      RETURNING 
        id, 
        type, 
        timestamp::text, 
        name, 
        email, 
        message, 
        contact_type as "contactType", 
        event_date::text as "date", 
        guests, 
        service_type as "serviceType", 
        amount, 
        custom_amount as "customAmount", 
        recipient_name as "recipientName", 
        recipient_email as "recipientEmail", 
        payment_app_username as "paymentAppUsername", 
        is_processed as "isProcessed"
    `
    return newSubmission
  } catch (error) {
    console.error("Error saving form submission to database:", error)
    throw error
  }
}

// Mark a gift certificate submission as processed
export async function markGiftCertificateAsProcessedInDB(id: string): Promise<boolean> {
  try {
    await sql`
      UPDATE form_submissions
      SET is_processed = true
      WHERE id = ${id} AND type = 'gift-certificate'
    `
    return true
  } catch (error) {
    console.error("Error marking gift certificate as processed in database:", error)
    return false
  }
}

// Delete a form submission
export async function deleteFormSubmissionFromDB(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM form_submissions
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error("Error deleting form submission from database:", error)
    return false
  }
}
