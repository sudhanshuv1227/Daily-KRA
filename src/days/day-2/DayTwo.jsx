import { useEffect, useState } from "react";

const fallbackProducts = [
  {
    id: 1,
    title: "Saffron Utility Tote",
    category: "accessories",
    price: 68,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    title: "Field Notes Jacket",
    category: "clothing",
    price: 124,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    title: "Everyday Ceramic Set",
    category: "home",
    price: 44,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    title: "Cloud Knit Pullover",
    category: "clothing",
    price: 88,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
  },
];

const USD_TO_INR = 83;

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) * USD_TO_INR);
}

export default function DayTwo() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    let active = true;
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((items) => {
        if (active) {
          setProducts(items);
          setStatus("live");
        }
      })
      .catch(() => {
        if (active) {
          setProducts(fallbackProducts);
          setStatus("fallback");
        }
      });
    return () => {
      active = false;
    };
  }, []);
  const visible = products.filter(
    (product) =>
      (category === "all" || product.category.includes(category)) &&
      product.title.toLowerCase().includes(query.toLowerCase()),
  );
  const add = (product) => {
    setCart((current) =>
      current.some((item) => item.id === product.id)
        ? current
        : [...current, product],
    );
    setCartOpen(true);
  };
  return (
    <>
      <section className="catalog-intro">
        <div>
          <p className="eyebrow">DAY 02 / REACT FUNDAMENTALS</p>
          <h1>
            Useful things,
            <br />
            <em>well considered.</em>
          </h1>
        </div>
        <div className="intro-copy">
          A small catalog powered by state moving in one direction. Filters and
          the bag are props all the way down.
        </div>
      </section>
      <section className="catalog-layout">
        <aside className="filter-panel">
          <p className="panel-label">
            FILTERS <span>STATE</span>
          </p>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="⌕  Search objects"
            aria-label="Search objects"
          />
          <div className="filter-group">
            <small>CATEGORY</small>
            {["all", "clothing", "accessories", "home"].map((item) => (
              <button
                className={category === item ? "filter active" : "filter"}
                onClick={() => setCategory(item)}
                key={item}
              >
                {category === item ? "●" : "○"} {item}
              </button>
            ))}
          </div>
          <div className="flow-note">
            props path<strong>App → CatalogPage → ProductCard</strong>
          </div>
        </aside>
        <section className="product-area">
          <div className="area-heading">
            <div>
              <p className="eyebrow">THE COLLECTION</p>
              <h2>{category === "all" ? "All objects" : category}</h2>
            </div>
            <span>
              {visible.length} RESULTS · {status.toUpperCase()}
            </span>
          </div>
          {status === "loading" ? (
            <div className="loading-message">Fetching external catalog...</div>
          ) : (
            <ProductGrid products={visible} onAdd={add} />
          )}
        </section>
      </section>
      {cartOpen && (
        <aside className="cart-drawer">
          <button onClick={() => setCartOpen(false)}>×</button>
          <p className="eyebrow">
            YOUR BAG / {cart.length.toString().padStart(2, "0")}
          </p>
          {cart.length ? (
            cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <span>{item.title}</span>
                <b>{formatPrice(item.price)}</b>
              </div>
            ))
          ) : (
            <p className="intro-copy">Your bag is waiting.</p>
          )}
        </aside>
      )}
      <button className="floating-bag" onClick={() => setCartOpen(true)}>
        Bag <b>{cart.length.toString().padStart(2, "0")}</b>
      </button>
    </>
  );
}

function ProductGrid({ products, onAdd }) {
  if (!products.length)
    return <div className="loading-message">No objects match that search.</div>;
  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-image">
            <img src={product.image} alt={product.title} />
            <button
              type="button"
              onPointerDown={() => onAdd(product)}
              onClick={() => onAdd(product)}
              aria-label={`Add ${product.title}`}
            >
              +
            </button>
          </div>
          <h3>{product.title}</h3>
          <span>{product.category}</span>
          <b>{formatPrice(product.price)}</b>
        </article>
      ))}
    </div>
  );
}
