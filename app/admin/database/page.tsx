"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { migrateDataFromLocalStorage } from "@/app/actions/migration"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, AlertCircle, Database, ArrowUpFromLine } from "lucide-react"

export default function DatabaseAdminPage() {
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<any>(null)
  const { toast } = useToast()

  const handleMigration = async () => {
    setIsMigrating(true)
    try {
      const result = await migrateDataFromLocalStorage()
      setMigrationResult(result)

      if (result.success) {
        toast({
          title: "Migration Successful",
          description: "Your data has been successfully migrated to the database.",
          variant: "default",
        })
      } else {
        toast({
          title: "Migration Failed",
          description: result.error || "There was an error during migration.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during migration:", error)
      toast({
        title: "Migration Failed",
        description: "There was an unexpected error during migration.",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Database Management</h1>

      <Tabs defaultValue="migration">
        <TabsList className="mb-6">
          <TabsTrigger value="migration">Data Migration</TabsTrigger>
          <TabsTrigger value="stats">Database Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="migration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpFromLine className="mr-2 h-5 w-5" />
                Migrate Data from Local Storage
              </CardTitle>
              <CardDescription>
                Transfer your data from browser local storage to the PostgreSQL database. This is a one-time operation
                to move from client-side to server-side storage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h3 className="font-medium text-amber-800">Important Information</h3>
                  <ul className="list-disc list-inside text-amber-700 mt-2 space-y-1">
                    <li>This process will migrate all your existing data from local storage to the database.</li>
                    <li>The migration will not delete data from local storage.</li>
                    <li>If you have data in both local storage and the database, duplicates may occur.</li>
                    <li>This process may take some time depending on the amount of data.</li>
                  </ul>
                </div>

                {migrationResult && migrationResult.success && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
                    <h3 className="font-medium text-green-800 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Migration Successful
                    </h3>
                    <div className="mt-2 space-y-1 text-green-700">
                      <p>The following data was migrated:</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>Events: {migrationResult.result.events.count} records</li>
                        <li>Users: {migrationResult.result.users.count} records</li>
                        <li>Form Submissions: {migrationResult.result.formSubmissions.count} records</li>
                        <li>Recipes: {migrationResult.result.recipes.count} records</li>
                        <li>Blog Posts: {migrationResult.result.blogPosts.count} records</li>
                        <li>
                          Site Settings: {migrationResult.result.siteSettings.success ? "Migrated" : "Not migrated"}
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {migrationResult && !migrationResult.success && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                    <h3 className="font-medium text-red-800 flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Migration Failed
                    </h3>
                    <p className="mt-2 text-red-700">
                      {migrationResult.error || "There was an error during migration. Please try again."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleMigration} disabled={isMigrating} className="w-full sm:w-auto">
                {isMigrating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Migrating Data...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Start Migration
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Database Statistics</CardTitle>
              <CardDescription>Overview of your database tables and record counts.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This feature will be available after implementing the database statistics API.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Users" description="User accounts" count={0} />
                <StatCard title="Events" description="Upcoming and past events" count={0} />
                <StatCard title="Form Submissions" description="Contact and gift certificate requests" count={0} />
                <StatCard title="Recipes" description="Cooking recipes" count={0} />
                <StatCard title="Blog Posts" description="Articles and posts" count={0} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, description, count }: { title: string; description: string; count: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{count}</p>
      </CardContent>
    </Card>
  )
}
