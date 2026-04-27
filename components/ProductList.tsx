"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Trash2, Search, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Product {
  id: string
  name: string
  description: string | null
  ingredients: string | null
  createdAt: string
  audits: { score: number }[]
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Products</h1>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <CardHeader>
            <CardTitle>No products found</CardTitle>
            <CardDescription>
              Start by adding your first product to audit its sustainability.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/products/new">Add First Product</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
                    {product.audits[0]?.score ?? "-"}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {product.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between mt-auto pt-6">
                <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/products/${product.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
