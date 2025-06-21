import { sql, handleDbError } from "../db"
import type { FormSubmission } from "@/types"

// Get all form submissions
export async function getAllFormSubmissions(): Promise<FormSubmission[]> {
  try {
    const submissions = await sql<FormSubmission[]>`
      SELECT id, type, timestamp, name, email, message, contact_type, event_date, 
             guests, service_type, amount, custom_amount, recipient_name, 
             recipient_email, payment_app_username, is_processed
      FROM form_submissions
      ORDER BY timestamp DESC
    `
    return submissions
  } catch (error) {
    handleDbError(error, "fetch form submissions")
  }
}

// Get form submissions by type
export async function getFormSubmissionsByType(type: "contact" | "gift-certificate"): Promise<FormSubmission[]> {
  try {
    const submissions = await sql<FormSubmission[]>`
      SELECT id, type, timestamp, name, email, message, contact_type, event_date, 
             guests, service_type, amount, custom_amount, recipient_name, 
             recipient_email, payment_app_username, is_processed
      FROM form_submissions
      WHERE type = ${type}
      ORDER BY timestamp DESC
    `
    return submissions
  } catch (error) {
    handleDbError(error, `fetch ${type} submissions`)
  }
}

// Get form submission by ID
export async function getFormSubmissionById(id: string): Promise<FormSubmission | null> {
  try {
    const [submission] = await sql<FormSubmission[]>`
      SELECT id, type, timestamp, name, email, message, contact_type, event_date, 
             guests, service_type, amount, custom_amount, recipient_name, 
             recipient_email, payment_app_username, is_processed
      FROM form_submissions
      WHERE id = ${id}
    `
    return submission || null
  } catch (error) {
    handleDbError(error, "fetch form submission")
  }
}

// Create a new contact form submission
export async function createContactSubmission(submission: {
  name: string
  email: string
  message: string
  contact_type?: "general" | "booking"
  event_date?: Date
  guests?: string
  service_type?: string
}): Promise<FormSubmission> {
  try {
    const [newSubmission] = await sql<FormSubmission[]>`
      INSERT INTO form_submissions (
        type, name, email, message, contact_type, event_date, guests, service_type
      )
      VALUES (
        'contact', ${submission.name}, ${submission.email}, ${submission.message}, 
        ${submission.contact_type || null}, ${submission.event_date || null}, 
        ${submission.guests || null}, ${submission.service_type || null}
      )
      RETURNING id, type, timestamp, name, email, message, contact_type, event_date, 
                guests, service_type, amount, custom_amount, recipient_name, 
                recipient_email, payment_app_username, is_processed
    `
    return newSubmission
  } catch (error) {
    handleDbError(error, "create contact submission")
  }
}

// Create a new gift certificate submission
export async function createGiftCertificateSubmission(submission: {
  name: string
  email: string
  message?: string
  amount?: string
  custom_amount?: string
  recipient_name: string
  recipient_email: string
  payment_app_username: string
}): Promise<FormSubmission> {
  try {
    const [newSubmission] = await sql<FormSubmission[]>`
      INSERT INTO form_submissions (
        type, name, email, message, amount, custom_amount, 
        recipient_name, recipient_email, payment_app_username
      )
      VALUES (
        'gift-certificate', ${submission.name}, ${submission.email}, ${submission.message || null}, 
        ${submission.amount || null}, ${submission.custom_amount || null}, 
        ${submission.recipient_name}, ${submission.recipient_email}, ${submission.payment_app_username}
      )
      RETURNING id, type, timestamp, name, email, message, contact_type, event_date, 
                guests, service_type, amount, custom_amount, recipient_name, 
                recipient_email, payment_app_username, is_processed
    `
    return newSubmission
  } catch (error) {
    handleDbError(error, "create gift certificate submission")
  }
}

// Update a form submission's processed status
export async function updateSubmissionProcessedStatus(id: string, isProcessed: boolean): Promise<FormSubmission> {
  try {
    const [updatedSubmission] = await sql<FormSubmission[]>`
      UPDATE form_submissions
      SET is_processed = ${isProcessed}
      WHERE id = ${id}
      RETURNING id, type, timestamp, name, email, message, contact_type, event_date, 
                guests, service_type, amount, custom_amount, recipient_name, 
                recipient_email, payment_app_username, is_processed
    `
    return updatedSubmission
  } catch (error) {
    handleDbError(error, "update submission processed status")
  }
}

// Delete a form submission
export async function deleteFormSubmission(id: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM form_submissions
      WHERE id = ${id}
    `
    return result.count > 0
  } catch (error) {
    handleDbError(error, "delete form submission")
  }
}
