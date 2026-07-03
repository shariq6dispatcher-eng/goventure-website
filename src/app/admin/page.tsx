"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Images,
  ShoppingBag,
  FileText,
  Clock,
  Plus,
  Pencil,
  Trash2,
  ZoomIn,
  Search,
} from "lucide-react";

import Sidebar, { AdminTab } from "@/components/admin/Sidebar";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import Lightbox from "@/components/admin/Lightbox";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PortfolioModal, {
  PortfolioItem,
} from "@/components/admin/PortfolioModal";
import ProductModal, { Product } from "@/components/admin/ProductModal";
import QuoteDrawer, { Quote } from "@/components/admin/QuoteDrawer";
import { ToastProvider, useToast } from "@/components/admin/Toast";

<<<<<<< HEAD
type PendingDelete =
  | { kind: "portfolio"; id: string; label: string }
  | { kind: "product"; id: string; label: string }
  | { kind: "quote"; id: string; label: string };
=======
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] =
    useState(false);
// const [orders, setOrders] = useState<any[]>([]);
// const [loadingOrders, setLoadingOrders] = useState(true);
// const [selectedOrder, setSelectedOrder] = useState<any>(null);
>>>>>>> bdb5e6d2fa8a2953224b3009eb0d00e3cd66b60c

function AdminDashboard() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Data
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  // Portfolio modal state
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] =
    useState<PortfolioItem | null>(null);
  const [savingPortfolio, setSavingPortfolio] = useState(false);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Quote drawer
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [updatingQuoteStatus, setUpdatingQuoteStatus] = useState(false);
  const [quoteStatusFilter, setQuoteStatusFilter] = useState("All");
  const [quoteSearch, setQuoteSearch] = useState("");

  // Shared
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  // ==========================
  // FETCHERS
  // ==========================

  const fetchPortfolio = async () => {
    try {
      setLoadingPortfolio(true);
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error();
      setPortfolio(await res.json());
    } catch {
      showToast("error", "Couldn't load portfolio items.");
    } finally {
      setLoadingPortfolio(false);
    }
  };
<<<<<<< HEAD
=======
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

// const fetchOrders = async () => {
//   try {
//     setLoadingOrders(true);

//     const res = await fetch("/api/orders");

//     if (!res.ok) {
//       throw new Error("Failed to fetch orders");
//     }

//     const data = await res.json();

//     setOrders(data);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoadingOrders(false);
//   }
// };
  // ==========================
  // FETCH PRODUCTS
  // ==========================
>>>>>>> bdb5e6d2fa8a2953224b3009eb0d00e3cd66b60c

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error();
      setProducts(await res.json());
    } catch {
      showToast("error", "Couldn't load shop products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoadingQuotes(true);
      const res = await fetch("/api/quotes");
      if (!res.ok) throw new Error();
      setQuotes(await res.json());
    } catch {
      showToast("error", "Couldn't load quote requests.");
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchProducts();
    fetchQuotes();
<<<<<<< HEAD
    // eslint-disable-next-line react-hooks/exhaustive-deps
=======
>>>>>>> bdb5e6d2fa8a2953224b3009eb0d00e3cd66b60c
  }, []);

  // ==========================
  // PORTFOLIO ACTIONS
  // ==========================

  const savePortfolioItem = async (values: {
    title: string;
    category: string;
    image: string;
  }) => {
    setSavingPortfolio(true);
    try {
      const isEdit = !!editingPortfolioItem;
      const res = await fetch(
        isEdit
          ? `/api/portfolio/${editingPortfolioItem!._id}`
          : "/api/portfolio",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");

      showToast(
        "success",
        isEdit ? "Portfolio item updated." : "Portfolio item added."
      );
      setPortfolioModalOpen(false);
      setEditingPortfolioItem(null);
      fetchPortfolio();
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to save portfolio item."
      );
    } finally {
      setSavingPortfolio(false);
    }
  };

  // ==========================
  // PRODUCT ACTIONS
  // ==========================

  const saveProduct = async (values: {
    title: string;
    description: string;
    category: string;
    price: string;
    image: string;
  }) => {
    setSavingProduct(true);
    try {
      const isEdit = !!editingProduct;
      const res = await fetch(
        isEdit ? `/api/products/${editingProduct!._id}` : "/api/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, price: Number(values.price) }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");

      showToast("success", isEdit ? "Product updated." : "Product added.");
      setProductModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to save product."
      );
    } finally {
      setSavingProduct(false);
    }
  };

<<<<<<< HEAD
  // ==========================
  // QUOTE ACTIONS
  // ==========================

  const changeQuoteStatus = async (status: string) => {
    if (!selectedQuote) return;
    setUpdatingQuoteStatus(true);
    try {
      const res = await fetch(`/api/quotes/${selectedQuote._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();

      setSelectedQuote({ ...selectedQuote, status });
      setQuotes((prev) =>
        prev.map((q) => (q._id === selectedQuote._id ? { ...q, status } : q))
      );
      showToast("success", `Status updated to "${status}".`);
    } catch {
      showToast("error", "Failed to update status.");
    } finally {
      setUpdatingQuoteStatus(false);
    }
  };

  // ==========================
  // DELETE (shared)
  // ==========================

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const endpoint =
        pendingDelete.kind === "portfolio"
          ? `/api/portfolio/${pendingDelete.id}`
          : pendingDelete.kind === "product"
          ? `/api/products/${pendingDelete.id}`
          : `/api/quotes/${pendingDelete.id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error();

      if (pendingDelete.kind === "portfolio") {
        setPortfolio((prev) => prev.filter((p) => p._id !== pendingDelete.id));
        showToast("success", "Portfolio item deleted.");
      } else if (pendingDelete.kind === "product") {
        setProducts((prev) => prev.filter((p) => p._id !== pendingDelete.id));
        showToast("success", "Product deleted.");
      } else {
        setQuotes((prev) => prev.filter((q) => q._id !== pendingDelete.id));
        showToast("success", "Quote request deleted.");
        setSelectedQuote(null);
      }
    } catch {
      showToast("error", "Delete failed. Please try again.");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  // ==========================
  // DERIVED
  // ==========================

  const newQuoteCount = useMemo(
    () => quotes.filter((q) => q.status === "New").length,
    [quotes]
  );

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesStatus =
        quoteStatusFilter === "All" || q.status === quoteStatusFilter;
      const term = quoteSearch.trim().toLowerCase();
      const matchesSearch =
        !term ||
        q.name?.toLowerCase().includes(term) ||
        q.email?.toLowerCase().includes(term) ||
        q.company?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [quotes, quoteStatusFilter, quoteSearch]);

  // ==========================
  // RENDER
  // ==========================

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        newQuoteCount={newQuoteCount}
      />

      <div className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <>
              <h2 className="text-2xl font-bold mb-8">Overview</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <StatCard
                  icon={Images}
                  label="Portfolio Items"
                  value={portfolio.length}
                />
                <StatCard
                  icon={ShoppingBag}
                  label="Shop Products"
                  value={products.length}
                />
                <StatCard
                  icon={FileText}
                  label="Total Quote Requests"
                  value={quotes.length}
                />
                <StatCard
                  icon={Clock}
                  label="New Requests"
                  value={newQuoteCount}
                  accent
                />
              </div>

              <h3 className="text-lg font-semibold mb-4">
                Recent Quote Requests
              </h3>
              <div className="rounded-2xl border border-zinc-800 overflow-hidden">
                {loadingQuotes ? (
                  <p className="p-6 text-sm text-zinc-500">Loading…</p>
                ) : quotes.length === 0 ? (
                  <p className="p-6 text-sm text-zinc-500">
                    No quote requests yet.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {quotes.slice(0, 5).map((q) => (
                        <tr
                          key={q._id}
                          onClick={() => setSelectedQuote(q)}
                          className="border-b border-zinc-900 last:border-0 hover:bg-zinc-950 cursor-pointer transition-colors"
                        >
                          <td className="p-4 font-medium">{q.name}</td>
                          <td className="p-4 text-zinc-400">{q.service}</td>
                          <td className="p-4">
                            <StatusBadge status={q.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* PORTFOLIO */}
          {activeTab === "portfolio" && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Portfolio</h2>
                <button
                  onClick={() => {
                    setEditingPortfolioItem(null);
                    setPortfolioModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition-all"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              {loadingPortfolio ? (
                <p className="text-sm text-zinc-500">Loading portfolio…</p>
              ) : portfolio.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500 text-sm">
                  No portfolio items yet. Click &quot;Add Item&quot; to upload
                  your first piece.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item) => (
                    <div
                      key={item._id}
                      className="group rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden"
                    >
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-56 w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => setLightboxSrc(item.image)}
                            aria-label="View full size"
                            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center text-white"
                          >
                            <ZoomIn size={17} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingPortfolioItem(item);
                              setPortfolioModalOpen(true);
                            }}
                            aria-label="Edit"
                            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center text-white"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setPendingDelete({
                                kind: "portfolio",
                                id: item._id,
                                label: item.title,
                              })
                            }
                            aria-label="Delete"
                            className="w-10 h-10 rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur flex items-center justify-center text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-zinc-500 text-sm mt-1">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Shop Products</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition-all"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {loadingProducts ? (
                <p className="text-sm text-zinc-500">Loading products…</p>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500 text-sm">
                  No products yet. Click &quot;Add Product&quot; to list your
                  first item.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="group rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden"
                    >
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-48 w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => setLightboxSrc(product.image)}
                            aria-label="View full size"
                            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center text-white"
                          >
                            <ZoomIn size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setProductModalOpen(true);
                            }}
                            aria-label="Edit"
                            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center text-white"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() =>
                              setPendingDelete({
                                kind: "product",
                                id: product._id,
                                label: product.title,
                              })
                            }
                            aria-label="Delete"
                            className="w-9 h-9 rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur flex items-center justify-center text-white"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold text-sm">
                          {product.title}
                        </h3>
                        <p className="text-zinc-500 text-xs mt-1">
                          {product.category}
                        </p>
                        <p className="text-[#D4AF37] font-bold mt-2">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* QUOTES */}
          {activeTab === "quotes" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold">Quote Requests</h2>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                      value={quoteSearch}
                      onChange={(e) => setQuoteSearch(e.target.value)}
                      placeholder="Search name, email, company…"
                      className="bg-zinc-950 border border-zinc-800 focus:border-[#D4AF37] outline-none pl-9 pr-4 py-2.5 rounded-xl text-sm w-64 transition-colors"
                    />
                  </div>

                  <select
                    value={quoteStatusFilter}
                    onChange={(e) => setQuoteStatusFilter(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 focus:border-[#D4AF37] outline-none px-4 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {[
                      "All",
                      "New",
                      "In Progress",
                      "Quoted",
                      "Completed",
                      "Declined",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 overflow-hidden">
                {loadingQuotes ? (
                  <p className="p-6 text-sm text-zinc-500">
                    Loading quotes…
                  </p>
                ) : filteredQuotes.length === 0 ? (
                  <p className="p-6 text-sm text-zinc-500">
                    No quote requests match your filters.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800 text-left text-zinc-500">
                          <th className="p-4 font-medium">Customer</th>
                          <th className="p-4 font-medium">Service</th>
                          <th className="p-4 font-medium">Country</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQuotes.map((quote) => (
                          <tr
                            key={quote._id}
                            className="border-b border-zinc-900 last:border-0 hover:bg-zinc-950/60 transition-colors"
                          >
                            <td className="p-4">
                              <p className="font-medium">{quote.name}</p>
                              <p className="text-zinc-500 text-xs mt-0.5">
                                {quote.email}
                              </p>
                            </td>
                            <td className="p-4 text-zinc-400">
                              {quote.service}
                            </td>
                            <td className="p-4 text-zinc-400">
                              {quote.country || "—"}
                            </td>
                            <td className="p-4">
                              <StatusBadge status={quote.status} />
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedQuote(quote)}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals / overlays */}
      <PortfolioModal
        open={portfolioModalOpen}
        item={editingPortfolioItem}
        saving={savingPortfolio}
        onClose={() => {
          setPortfolioModalOpen(false);
          setEditingPortfolioItem(null);
        }}
        onSave={savePortfolioItem}
      />

      <ProductModal
        open={productModalOpen}
        item={editingProduct}
        saving={savingProduct}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={saveProduct}
      />

      <QuoteDrawer
        quote={selectedQuote}
        updatingStatus={updatingQuoteStatus}
        onClose={() => setSelectedQuote(null)}
        onStatusChange={changeQuoteStatus}
        onDelete={() =>
          selectedQuote &&
          setPendingDelete({
            kind: "quote",
            id: selectedQuote._id,
            label: selectedQuote.name,
          })
        }
        onViewArtwork={setLightboxSrc}
      />

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.label}"?`}
        description="This can't be undone. The item will be permanently removed."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminDashboard />
    </ToastProvider>
  );
=======
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
{/* <button
  onClick={() => setActiveTab("orders")}
  className={
    activeTab === "orders"
      ? "bg-[#D4AF37] text-black px-6 py-3 rounded-full"
      : "bg-zinc-900 px-6 py-3 rounded-full"
  }
>
  Orders
</button> */}
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
>>>>>>> bdb5e6d2fa8a2953224b3009eb0d00e3cd66b60c
}
