import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock, Users } from "lucide-react"

/**
 * Props for the RecipeCard component
 * @interface RecipeCardProps
 * @property {string} id - Unique identifier for the recipe
 * @property {string} title - Title of the recipe
 * @property {string} slug - URL-friendly identifier for the recipe
 * @property {string} featuredImage - URL to the recipe's featured image
 * @property {string} description - Brief description of the recipe
 * @property {string} cuisine - Type of cuisine (e.g., "Italian", "Mexican")
 * @property {string} difficulty - Difficulty level ("easy", "medium", "hard")
 * @property {number} prepTime - Preparation time in minutes
 * @property {number} cookTime - Cooking time in minutes
 * @property {number} servings - Number of servings the recipe yields
 * @property {boolean} featured - Whether the recipe is featured
 */
export interface RecipeCardProps {
  id: string
  title: string
  slug: string
  featuredImage: string
  description: string
  cuisine: string
  difficulty: string
  prepTime: number
  cookTime: number
  servings: number
  featured?: boolean
}

/**
 * RecipeCard component displays a recipe in a card format
 *
 * @param {RecipeCardProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export function RecipeCard({
  id,
  title,
  slug,
  featuredImage,
  description,
  cuisine,
  difficulty,
  prepTime,
  cookTime,
  servings,
  featured = false,
}: RecipeCardProps): JSX.Element {
  // Format time (minutes to hours and minutes)
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`
  }

  return (
    <Card key={id} className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={featuredImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {featured && (
          <span className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-sm text-gray-600">
          {cuisine} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </p>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatTime(prepTime + cookTime)}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>Serves {servings}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/recipes/${slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Recipe
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
