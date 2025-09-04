"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Eye, Star, ChevronLeft, ChevronRight, X } from "lucide-react"
import { GestureControls } from "@/components/gesture-controls"
import { LoadingSkeleton } from "@/components/loading-skeleton"

interface FashionItem {
  id: string
  title: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  colors: string[]
  category: string
  season: string
  rating: number
  isNew?: boolean
  isSale?: boolean
}

interface FilterState {
  colors: string[]
  categories: string[]
  brands: string[]
  seasons: string[]
  priceRange: [number, number]
  sortBy: string
  showOnSale: boolean
  showNew: boolean
}

interface FashionGalleryProps {
  activeFilter: string
  viewMode: "grid" | "lookbook"
  filters: FilterState
  activeCollection: string | null
}

export function FashionGallery({ activeFilter, viewMode, filters, activeCollection }: FashionGalleryProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [currentLookIndex, setCurrentLookIndex] = useState(0)
  const [isLookbookOpen, setIsLookbookOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const { scrollY } = useScroll()

  const fashionItems: FashionItem[] = [
    {
      id: "1",
      title: "Silk Midi Dress",
      brand: "Atelier Luna",
      price: 285,
      originalPrice: 380,
      image: "/elegant-silk-midi-dress-in-emerald-green.jpg",
      colors: ["emerald", "black", "navy"],
      category: "dresses",
      season: "spring",
      rating: 4.8,
      isSale: true,
    },
    {
      id: "2",
      title: "Cashmere Blazer",
      brand: "Maison Noir",
      price: 520,
      image: "/luxury-cashmere-blazer-in-charcoal-gray.jpg",
      colors: ["black", "gray", "camel"],
      category: "outerwear",
      season: "autumn",
      rating: 4.9,
      isNew: true,
    },
    {
      id: "3",
      title: "Leather Ankle Boots",
      brand: "Cobbler & Co",
      price: 340,
      image: "/premium-leather-ankle-boots-in-cognac-brown.jpg",
      colors: ["brown", "black", "tan"],
      category: "shoes",
      season: "winter",
      rating: 4.7,
    },
    {
      id: "4",
      title: "Linen Shirt",
      brand: "Coastal Threads",
      price: 125,
      image: "/crisp-white-linen-shirt-minimalist-design.jpg",
      colors: ["white", "blue", "beige"],
      category: "tops",
      season: "summer",
      rating: 4.6,
    },
    {
      id: "5",
      title: "Wool Coat",
      brand: "Nordic Style",
      price: 680,
      image: "/elegant-wool-coat-in-navy-blue-double-breasted.jpg",
      colors: ["navy", "black", "camel"],
      category: "outerwear",
      season: "winter",
      rating: 4.9,
    },
    {
      id: "6",
      title: "Silk Scarf",
      brand: "Atelier Luna",
      price: 95,
      image: "/luxury-silk-scarf-with-abstract-pattern.jpg",
      colors: ["multicolor", "blue", "red"],
      category: "accessories",
      season: "spring",
      rating: 4.5,
      isNew: true,
    },
    {
      id: "7",
      title: "Denim Jacket",
      brand: "Urban Classic",
      price: 180,
      originalPrice: 220,
      image: "/vintage-style-denim-jacket-in-medium-wash.jpg",
      colors: ["blue", "black", "white"],
      category: "outerwear",
      season: "spring",
      rating: 4.4,
      isSale: true,
    },
    {
      id: "8",
      title: "Pleated Skirt",
      brand: "Feminine Touch",
      price: 165,
      image: "/elegant-pleated-midi-skirt-in-blush-pink.jpg",
      colors: ["pink", "black", "beige"],
      category: "bottoms",
      season: "spring",
      rating: 4.6,
    },
  ]

  const filteredItems = fashionItems.filter((item) => {
    if (activeFilter !== "all") {
      const matchesLegacyFilter = item.colors.some(
        (color) =>
          color.toLowerCase().includes(activeFilter.toLowerCase()) ||
          (activeFilter === "beige" && (color === "tan" || color === "camel")),
      )
      if (!matchesLegacyFilter) return false
    }

    if (activeCollection) {
      const collectionSeasonMap: { [key: string]: string } = {
        spring: "spring",
        summer: "summer",
        autumn: "autumn",
        winter: "winter",
      }
      if (item.season !== collectionSeasonMap[activeCollection]) return false
    }

    if (filters.colors.length > 0) {
      const matchesColor = item.colors.some((color) => filters.colors.includes(color))
      if (!matchesColor) return false
    }

    if (filters.categories.length > 0) {
      if (!filters.categories.includes(item.category)) return false
    }

    if (filters.brands.length > 0) {
      const brandSlug = item.brand.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")
      if (!filters.brands.includes(brandSlug)) return false
    }

    if (filters.seasons.length > 0) {
      if (!filters.seasons.includes(item.season)) return false
    }

    if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
      return false
    }

    if (filters.showOnSale && !item.isSale) return false
    if (filters.showNew && !item.isNew) return false

    return true
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      case "rating":
        return b.rating - a.rating
      case "popular":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const toggleLike = (itemId: string) => {
    const newLikedItems = new Set(likedItems)
    if (newLikedItems.has(itemId)) {
      newLikedItems.delete(itemId)
    } else {
      newLikedItems.add(itemId)
    }
    setLikedItems(newLikedItems)
  }

  const nextLook = () => {
    setCurrentLookIndex((prev) => (prev + 1) % sortedItems.length)
  }

  const prevLook = () => {
    setCurrentLookIndex((prev) => (prev - 1 + sortedItems.length) % sortedItems.length)
  }

  const openLookbook = (index: number) => {
    setCurrentLookIndex(index)
    setIsLookbookOpen(true)
  }

  const handleSwipeLeft = () => {
    if (isLookbookOpen && currentLookIndex < sortedItems.length - 1) {
      nextLook()
    }
  }

  const handleSwipeRight = () => {
    if (isLookbookOpen && currentLookIndex > 0) {
      prevLook()
    }
  }

  const handlePinchZoom = (scale: number) => {
    setZoomScale(scale)
  }

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [activeFilter, filters, activeCollection])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const yTransforms = sortedItems.map((_, index) => {
    return [index * 800, (index + 1) * 800]
  })

  const opacityTransforms = sortedItems.map((_, index) => {
    return [index * 800 - 200, index * 800, (index + 1) * 800, (index + 1) * 800 + 200]
  })

  if (isLoading) {
    return <LoadingSkeleton variant="gallery" count={8} />
  }

  return (
    <>
      {viewMode === "lookbook" && (
        <GestureControls onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} className="space-y-0">
          {sortedItems.map((item, index) => {
            const y = scrollY.get() >= yTransforms[index][0] && scrollY.get() < yTransforms[index][1] ? -100 : 0
            const opacity =
              scrollY.get() >= opacityTransforms[index][0] && scrollY.get() < opacityTransforms[index][1] ? 1 : 0

            return (
              <motion.div
                key={item.id}
                className="relative h-screen flex items-center justify-center overflow-hidden cursor-pointer"
                style={{ y, opacity }}
                onClick={() => openLookbook(index)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    transform: `translateY(${scrollY.get() * 0.5}px)`,
                  }}
                />

                <div className="absolute inset-0 bg-black/40" />

                <motion.div
                  className="relative z-10 text-center text-white max-w-2xl px-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4">
                    {item.isNew && <Badge className="bg-primary text-primary-foreground mb-2">New Arrival</Badge>}
                    {item.isSale && (
                      <Badge className="bg-destructive text-destructive-foreground mb-2 ml-2">On Sale</Badge>
                    )}
                  </div>

                  <h2 className="text-5xl md:text-7xl font-serif font-bold mb-4 text-balance">{item.title}</h2>

                  <p className="text-xl md:text-2xl font-light mb-2 opacity-90">{item.brand}</p>

                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-3xl font-semibold">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xl opacity-70 line-through">${item.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-8">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">{item.rating}</span>
                  </div>

                  <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-gray-100">
                    View Details
                  </Button>
                </motion.div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <motion.div
                      className="w-1 h-3 bg-white/70 rounded-full mt-2"
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </GestureControls>
      )}

      <AnimatePresence>
        {isLookbookOpen && (
          <GestureControls onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} onPinchZoom={handlePinchZoom}>
            <motion.div
              className="fixed inset-0 z-50 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 z-10 text-white hover:bg-white/20"
                  onClick={() => setIsLookbookOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={prevLook}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={nextLook}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>

                <motion.div
                  key={currentLookIndex}
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ scale: zoomScale }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={sortedItems[currentLookIndex]?.image || "/placeholder.svg"}
                      alt={sortedItems[currentLookIndex]?.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                      <div className="max-w-2xl">
                        <h3 className="text-4xl font-serif font-bold text-white mb-2">
                          {sortedItems[currentLookIndex]?.title}
                        </h3>
                        <p className="text-xl text-white/90 mb-4">{sortedItems[currentLookIndex]?.brand}</p>
                        <div className="flex items-center gap-4 mb-6">
                          <span className="text-2xl font-semibold text-white">
                            ${sortedItems[currentLookIndex]?.price}
                          </span>
                          {sortedItems[currentLookIndex]?.originalPrice && (
                            <span className="text-lg text-white/70 line-through">
                              ${sortedItems[currentLookIndex]?.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="rounded-full bg-white text-black hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLike(sortedItems[currentLookIndex]?.id)
                            }}
                          >
                            <Heart
                              className={`h-4 w-4 mr-2 ${likedItems.has(sortedItems[currentLookIndex]?.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                            {likedItems.has(sortedItems[currentLookIndex]?.id) ? "Liked" : "Like"}
                          </Button>
                          <Button className="rounded-full bg-primary text-primary-foreground">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {sortedItems.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentLookIndex ? "bg-white w-8" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentLookIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </GestureControls>
        )}
      </AnimatePresence>

      {viewMode === "grid" && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {sortedItems.map((item, index) => (
              <GestureControls key={item.id} className="h-full">
                <motion.div
                  variants={itemVariants}
                  layout
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group cursor-pointer h-full"
                  onClick={() => openLookbook(index)}
                  whileHover={{ y: -8, rotateX: 5, rotateY: 5, transition: { duration: 0.3 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-card h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-80 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        loading="lazy"
                      />

                      <motion.div
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                        animate={{
                          background:
                            hoveredItem === item.id
                              ? "linear-gradient(135deg, rgba(8,145,178,0.1) 0%, rgba(16,185,129,0.1) 100%)"
                              : "rgba(0,0,0,0.2)",
                        }}
                      />

                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.isNew && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                        {item.isSale && <Badge className="bg-destructive text-destructive-foreground">Sale</Badge>}
                      </div>

                      <motion.div
                        className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{
                          x: hoveredItem === item.id ? 0 : 20,
                          opacity: hoveredItem === item.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, staggerChildren: 0.1 }}
                      >
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLike(item.id)
                            }}
                          >
                            <Heart
                              className={`h-4 w-4 ${likedItems.has(item.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              openLookbook(index)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </motion.div>

                      <div className="absolute bottom-3 left-3 flex gap-1">
                        {item.colors.slice(0, 3).map((color, index) => (
                          <motion.div
                            key={index}
                            className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                              color === "black"
                                ? "bg-black"
                                : color === "white"
                                  ? "bg-white"
                                  : color === "blue"
                                    ? "bg-blue-500"
                                    : color === "red"
                                      ? "bg-red-500"
                                      : color === "emerald"
                                        ? "bg-emerald-500"
                                        : color === "navy"
                                          ? "bg-blue-900"
                                          : color === "gray"
                                            ? "bg-gray-500"
                                            : color === "camel"
                                              ? "bg-amber-200"
                                              : color === "brown"
                                                ? "bg-amber-800"
                                                : color === "tan"
                                                  ? "bg-amber-100"
                                                  : color === "beige"
                                                    ? "bg-stone-200"
                                                    : color === "pink"
                                                      ? "bg-pink-300"
                                                      : "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
                            }`}
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.2 }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-serif font-semibold text-foreground text-lg leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{item.brand}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{item.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </GestureControls>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  )
}
