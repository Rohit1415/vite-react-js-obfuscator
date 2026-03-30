import { useEffect, useState } from "react";
import { api } from "../utils/api";

type Category = {
  id: string;
  name: string;
  description: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
};

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err: any) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-spin flex-reverse"></div>
        </div>
      </div>
    );
  }

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.categoryId === activeCategory);

  return (
    <div className="space-y-16 animate-fade-in relative z-10">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-br from-gray-900 to-gray-500 bg-clip-text text-transparent transform relative inline-block">
          The New Standard.
          <div className="absolute -top-4 -right-10 w-20 h-20 bg-brand-400/20 blur-2xl rounded-full pointer-events-none"></div>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium">
          Discover our curated collection of premium essentials designed for the modern lifestyle.
        </p>
      </div>

      <div className="flex justify-center space-x-2 py-4 overflow-x-auto hidden-scrollbar pb-6 rounded-3xl sticky top-24 backdrop-blur-sm z-20">
        <button 
          onClick={() => setActiveCategory("all")}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            activeCategory === "all" 
            ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105" 
            : "bg-white/50 text-gray-600 hover:bg-gray-100 hover:scale-105"
          }`}
        >
          View All
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id 
              ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105" 
              : "bg-white/50 text-gray-600 hover:bg-gray-100 hover:scale-105"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card-premium group flex flex-col h-full bg-white/80 overflow-hidden relative">
            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-xs font-black text-gray-900">
              Only {product.stock} left
            </div>
            
            <div className="aspect-square bg-gray-50/50 relative overflow-hidden flex items-center justify-center p-8 border-b border-gray-100/50">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-brand-50 to-indigo-100 shadow-inner group-hover:scale-[1.15] group-hover:rotate-3 transition-transform duration-700 flex items-center justify-center text-brand-500 font-black text-4xl transform-gpu">
                 {product.name.charAt(0)}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-white to-transparent">
              <div className="flex justify-between items-start mb-6 gap-4">
                <div className="flex-1">
                  <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-brand-600 rounded-lg uppercase tracking-wider mb-3 inline-block">
                    {categories.find(c => c.id === product.categoryId)?.name || 'Misc'}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-brand-600 transition-colors">
                    {product.name}
                  </h3>
                </div>
                <div className="text-2xl font-black text-gray-900 bg-white shadow-sm px-3 py-1 rounded-xl">
                  ${product.price}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
                {product.description}
              </p>
              <button className="btn-primary w-full mt-auto font-bold tracking-wide">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
