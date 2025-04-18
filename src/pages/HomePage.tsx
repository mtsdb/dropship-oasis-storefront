
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    description: "High-quality wireless earbuds with noise cancellation and long battery life."
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    description: "Feature-rich smartwatch with health tracking, notifications, and customizable watch faces."
  },
  {
    id: "3",
    name: "Portable Bluetooth Speaker",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    description: "Compact portable speaker with amazing sound quality and 20-hour battery life."
  },
  {
    id: "4",
    name: "Phone Camera Lens Kit",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    description: "Versatile lens kit for smartphone photography, includes wide angle, macro, and fisheye lenses."
  },
  {
    id: "5",
    name: "Laptop Stand",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1661961110372-8a7682543120?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    description: "Adjustable aluminum laptop stand for improved ergonomics and cooling."
  },
  {
    id: "6",
    name: "Wireless Charging Pad",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices."
  }
];

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate loading data from API
    const fetchProducts = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <section className="mb-10">
        <div className="bg-gradient-to-r from-primary/10 to-secondary rounded-lg p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Dropship Oasis</h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Discover premium products for your online store. Quality items, fast shipping, and excellent margins.
          </p>
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-500">No products found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
