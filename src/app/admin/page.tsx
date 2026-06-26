"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");
const [selectedQuote, setSelectedQuote] =
useState<any>(null);
  // PORTFOLIO
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioCategory, setPortfolioCategory] =
    useState("Digitizing");
  const [portfolioFile, setPortfolioFile] =
    useState<File | null>(null);

  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] =
    useState(false);
const [orders, setOrders] = useState<any[]>([]);
const [loadingOrders, setLoadingOrders] = useState(true);
const [selectedOrder, setSelectedOrder] = useState<any>(null);

const [quotes, setQuotes] = useState<any[]>([]);
const [loadingQuotes, setLoadingQuotes] = useState(true);
  // PRODUCTS
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] =
    useState("");
  const [productCategory, setProductCategory] =
    useState("Patch");
  const [productPrice, setProductPrice] = useState("");
  const [productFile, setProductFile] =
    useState<File | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const [uploading, setUploading] = useState(false);

  // ==========================
  // FETCH PORTFOLIO
  // ==========================

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");

      if (!res.ok) return;

      const data = await res.json();

      setPortfolio(data);
    } catch (err) {
      console.error(err);
    }
  };
const fetchQuotes = async () => {
  try {
    setLoadingQuotes(true);

    const res = await fetch("/api/quotes");

    if (!res.ok) {
      throw new Error("Failed to fetch quotes");
    }

    const data = await res.json();

    setQuotes(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingQuotes(false);
  }
};

const fetchOrders = async () => {
  try {
    setLoadingOrders(true);

    const res = await fetch("/api/orders");

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();

    setOrders(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingOrders(false);
  }
};
  // ==========================
  // FETCH PRODUCTS
  // ==========================

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) return;

      const data = await res.json();

      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };
useEffect(() => {
  const navbar = document.getElementById("navbar");

  if (selectedQuote) {
    document.body.style.overflow = "hidden";
    navbar?.classList.add("hidden");
  } else {
    document.body.style.overflow = "auto";
    navbar?.classList.remove("hidden");
  }

  return () => {
    document.body.style.overflow = "auto";
    navbar?.classList.remove("hidden");
  };
}, [selectedQuote]);

  useEffect(() => {
    fetchPortfolio();
    fetchProducts();
    fetchQuotes();
    fetchOrders();
  }, []);

  // ==========================
  // PORTFOLIO UPLOAD
  // ==========================

  const uploadPortfolio = async () => {
    if (!portfolioFile || !portfolioTitle) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", portfolioFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: portfolioTitle,
          category: portfolioCategory,
          image: uploadData.imageUrl,
        }),
      });

      setPortfolioTitle("");
      setPortfolioFile(null);

      fetchPortfolio();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // ==========================
  // PRODUCT UPLOAD
  // ==========================

  const uploadProduct = async () => {
    if (!productFile || !productTitle) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", productFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: productTitle,
          description: productDescription,
          category: productCategory,
          price: Number(productPrice),
          image: uploadData.imageUrl,
        }),
      });

      setProductTitle("");
      setProductDescription("");
      setProductPrice("");
      setProductFile(null);

      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-28">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-6xl font-bold mb-10">
          Admin Dashboard
        </h1>

        {/* TABS */}

        <div className="flex gap-4 mb-10">

  <button
    onClick={() => setActiveTab("portfolio")}
    className={activeTab === "portfolio"
      ? "bg-[#D4AF37] text-black px-6 py-3 rounded-full"
      : "bg-zinc-900 px-6 py-3 rounded-full"}
  >
    Portfolio
  </button>

  <button
    onClick={() => setActiveTab("products")}
    className={activeTab === "products"
      ? "bg-[#D4AF37] text-black px-6 py-3 rounded-full"
      : "bg-zinc-900 px-6 py-3 rounded-full"}
  >
    Shop Products
  </button>
<button
  onClick={() => setActiveTab("orders")}
  className={
    activeTab === "orders"
      ? "bg-[#D4AF37] text-black px-6 py-3 rounded-full"
      : "bg-zinc-900 px-6 py-3 rounded-full"
  }
>
  Orders
</button>
  <button
    onClick={() => setActiveTab("quotes")}
    className={activeTab === "quotes"
      ? "bg-[#D4AF37] text-black px-6 py-3 rounded-full"
      : "bg-zinc-900 px-6 py-3 rounded-full"}
  >
    Quote Requests
  </button>

</div>
 {activeTab === "quotes" && (<div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-8">

  <h2 className="text-3xl font-bold mb-8">
    Quote Requests
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="border-b border-zinc-800">

          <th className="p-4 text-left">Customer</th>
          <th className="p-4 text-left">Service</th>
          <th className="p-4 text-left">Country</th>
          <th className="p-4 text-left">Status</th>
          <th className="p-4 text-left">Actions</th>

        </tr>

      </thead>

      <tbody>

        {quotes.map((quote) => (

          <tr
            key={quote._id}
            className="border-b border-zinc-800"
          >

            <td className="p-4">
              {quote.name}
            </td>

            <td className="p-4">
              {quote.service}
            </td>

            <td className="p-4">
              {quote.country}
            </td>

            <td className="p-4">
              {quote.status}
            </td>

            <td className="p-4">

              <button
                onClick={() =>
                  setSelectedQuote(quote)
                }
                className="
                bg-[#D4AF37]
                text-black
                px-4
                py-2
                rounded-lg
                "
              >
                View Details
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
)}
{activeTab === "orders" && (

<div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-8">

<h2 className="text-3xl font-bold mb-8">
Orders
</h2>

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className="border-b border-zinc-800">

<th className="p-4 text-left">Order ID</th>
<th className="p-4 text-left">Customer</th>
<th className="p-4 text-left">Amount</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Action</th>

</tr>

</thead>

<tbody>

{orders.map((order) => (

<tr
key={order._id}
className="border-b border-zinc-800"
>

<td className="p-4">
#{order.orderNumber}
</td>

<td className="p-4">
{order.customerName}
</td>

<td className="p-4">
${order.total}
</td>

<td className="p-4">

<span
className={`px-3 py-1 rounded-full text-sm ${
order.status === "Paid"
? "bg-green-600"
: order.status === "Pending"
? "bg-yellow-600"
: "bg-red-600"
}`}
>

{order.status}

</span>

</td>

<td className="p-4">

<button
onClick={() => setSelectedOrder(order)}
className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg"
>

View

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)}
        {/* PORTFOLIO */}

        {activeTab === "portfolio" && (
          <>
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 mb-10">

              <h2 className="text-3xl font-bold mb-6">
                Upload Portfolio Item
              </h2>

              <input
                value={portfolioTitle}
                onChange={(e) =>
                  setPortfolioTitle(e.target.value)
                }
                placeholder="Title"
                className="w-full bg-zinc-900 p-4 rounded-xl mb-4"
              />

              <select
                value={portfolioCategory}
                onChange={(e) =>
                  setPortfolioCategory(e.target.value)
                }
                className="w-full bg-zinc-900 p-4 rounded-xl mb-4"
              >
                <option>Digitizing</option>
                <option>Patches</option>
                <option>Jerseys</option>
                <option>Sportswear</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPortfolioFile(
                    e.target.files?.[0] || null
                  )
                }
              />

              {portfolioFile && (
                <img
                  src={URL.createObjectURL(portfolioFile)}
                  alt=""
                  className="w-full h-60 object-cover rounded-xl mt-4"
                />
              )}

              <button
                onClick={uploadPortfolio}
                disabled={uploading}
                className="mt-6 bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold"
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Portfolio"}
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {portfolio.map((item) => (
                <div
                  key={item._id}
                  className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="font-bold text-xl">
                      {item.title}
                    </h3>

                    <p className="text-zinc-400">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PRODUCTS */}

        {activeTab === "products" && (
          <>
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 mb-10">

              <h2 className="text-3xl font-bold mb-6">
                Add Shop Product
              </h2>

              <input
                placeholder="Product Title"
                value={productTitle}
                onChange={(e) =>
                  setProductTitle(e.target.value)
                }
                className="w-full bg-zinc-900 p-4 rounded-xl mb-4"
              />

              <textarea
                placeholder="Description"
                value={productDescription}
                onChange={(e) =>
                  setProductDescription(
                    e.target.value
                  )
                }
                className="w-full bg-zinc-900 p-4 rounded-xl mb-4 h-32"
              />

              <input
                placeholder="Price"
                value={productPrice}
                onChange={(e) =>
                  setProductPrice(e.target.value)
                }
                className="w-full bg-zinc-900 p-4 rounded-xl mb-4"
              />

              <select
                value={productCategory}
                onChange={(e) =>
                  setProductCategory(e.target.value)
                }
                className="w-full bg-zinc-900 p-4 rounded-xl mb-4"
              >
                <option>Patch</option>
                <option>Digitizing</option>
                <option>Sportswear</option>
                <option>Jersey</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProductFile(
                    e.target.files?.[0] || null
                  )
                }
              />

              <button
                onClick={uploadProduct}
                className="mt-6 bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold"
              >
                Add Product
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-8">

              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">

                    <h3 className="font-bold text-xl mb-2">
                      {product.title}
                    </h3>

                    <p className="text-zinc-400 mb-3">
                      {product.category}
                    </p>

                    <p className="text-[#D4AF37] font-bold">
                      ${product.price}
                    </p>

                  </div>
                </div>
              ))}

            </div>
          </>
        )}

{selectedQuote && (
  <div
    className="
    fixed
    inset-0
    z-[999999]
    bg-black/90
    backdrop-blur-md
    overflow-y-auto
    p-6
  "
    onClick={() => setSelectedQuote(null)}
  >
  <div
  onClick={(e) => e.stopPropagation()}
  className="
    relative
    w-full
    max-w-4xl
    mx-auto
    my-10
    rounded-3xl
    bg-zinc-950
    border
    border-zinc-800
    p-8
  "
>
      <button
        onClick={() => setSelectedQuote(null)}
        className="absolute right-6 top-6 text-3xl text-zinc-400 hover:text-white"
      >
        ×
      </button>

      <h2 className="text-3xl font-bold mb-8">
        Quote Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <p className="text-zinc-500">Name</p>
          <p>{selectedQuote.name}</p>
        </div>

        <div>
          <p className="text-zinc-500">Email</p>
          <p>{selectedQuote.email}</p>
        </div>

        <div>
          <p className="text-zinc-500">Phone</p>
          <p>{selectedQuote.phone}</p>
        </div>

        <div>
          <p className="text-zinc-500">Company</p>
          <p>{selectedQuote.company}</p>
        </div>

        <div>
          <p className="text-zinc-500">Service</p>
          <p>{selectedQuote.service}</p>
        </div>

        <div>
          <p className="text-zinc-500">Country</p>
          <p>{selectedQuote.country}</p>
        </div>

        <div>
          <p className="text-zinc-500">Quantity</p>
          <p>{selectedQuote.quantity}</p>
        </div>

        <div>
          <p className="text-zinc-500">Delivery Date</p>
          <p>{selectedQuote.deliveryDate}</p>
        </div>

      </div>

      <div className="mt-8">
        <h3 className="font-bold text-xl mb-3">
          Project Description
        </h3>

        <div className="bg-zinc-900 rounded-xl p-5">
          {selectedQuote.description}
        </div>
      </div>

      {selectedQuote.artwork && (
        <div className="mt-10">

          <h3 className="font-bold text-xl mb-5">
            Uploaded Artwork
          </h3>

          <img
  src={selectedQuote.artwork}
  className="
    block
    mx-auto
    w-64
    h-64
    object-contain
    rounded-xl
    border
    border-zinc-800
  "
/>

          <div className="flex gap-4 mt-5">

            <a
              href={selectedQuote.artwork}
              target="_blank"
              className="bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-semibold"
            >
              View Full Size
            </a>

            <a
              href={selectedQuote.artwork}
              download
              className="border border-zinc-700 px-6 py-3 rounded-xl"
            >
              Download Artwork
            </a>

          </div>

        </div>
      )}

    </div>
  </div>
)}
      </div>
    </main>
  );
}