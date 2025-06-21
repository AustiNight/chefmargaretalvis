import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CardFooter } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
// Add this to the existing dashboard cards in app/admin/page.tsx

import { Database } from "lucide-react" // Import the Database component
;<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Database Management</CardTitle>
    <Database className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">PostgreSQL</div>
    <p className="text-xs text-muted-foreground">Manage your database and migrate data</p>
  </CardContent>
  <CardFooter>
    <Link href="/admin/database" className="w-full">
      <Button variant="outline" className="w-full">
        Manage Database
      </Button>
    </Link>
  </CardFooter>
</Card>
