"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUpButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4">Sign Up</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Up for Updates</DialogTitle>
            <DialogDescription>
              Join our mailing list to receive updates about upcoming events, special offers, and new recipes.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Input id="address" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="subscribeNewsletter" defaultChecked />
              <Label htmlFor="subscribeNewsletter">Subscribe to our newsletter</Label>
            </div>
            <Button type="submit">Sign Up</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
