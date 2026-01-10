import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../../api/services';
import SEO from '../../components/SEO';

export default function Browse() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getAll({ category, search }),
          categoryService.getAll()
        ]);
        setProducts(productsRes.data.data.products);
        setCategories(categoriesRes.data.data.categories);
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, search]);

  return (
    <>
      <SEO title="Browse Products" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Services</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={search}
            onChange={(e) => setSearchParams({ category, search: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSearchParams({ search })}
            className={`px-4 py-2 rounded-full ${!category ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSearchParams({ category: cat._id, search })}
              className={`px-4 py-2 rounded-full ${category === cat._id ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={product.images[0] || '/placeholder.png'}
                  alt={product.productName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.productName}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <div className="text-sm text-gray-500">
                      ⭐ {product.rating.toFixed(1)} ({product.reviewCount})
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
