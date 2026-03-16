import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FileText, Users, Briefcase, BookOpen, Tag, List,
  AlertCircle, Package, UserCheck, ArrowLeftRight,
  LogOut, Plus, Printer, ToggleRight, Search, Menu,
  X, MoreHorizontal, ChevronDown,
} from "lucide-react";
import "../styles/pricelist.css";

function getScreenType() {
  const width = window.innerWidth;
  if (width <= 480)  return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}
// menu icons 
const SIDEBAR_ITEMS = [
  { label: "Invoices",           icon: FileText        },
  { label: "Customers",          icon: Users           },
  { label: "My Business",        icon: Briefcase       },
  { label: "Invoice Journal",    icon: BookOpen        },
  { label: "Price List",         icon: Tag, active: true },
  { label: "Multiple Invoicing", icon: List            },
  { label: "Unpaid Invoices",    icon: AlertCircle     },
  { label: "Offer",              icon: Tag             },
  { label: "Inventory Control",  icon: Package         },
  { label: "Member Invoicing",   icon: UserCheck       },
  { label: "Import/Export",      icon: ArrowLeftRight  },
];


export default function PriceList({ onLogout }) {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [screenType,  setScreenType]  = useState(getScreenType());

  // Update screen type on window resize
  useEffect(() => {
    function handleResize() {
      setScreenType(getScreenType());
      // Auto close sidebar when switching to desktop screen
      if (getScreenType() === "desktop") setSidebarOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

// token expiry handling and fetching products
async function fetchProducts() {
  const token = localStorage.getItem("token");
  if (!token) {
    onLogout();
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Token expired or invalid
    if (res.status === 401) {
      localStorage.removeItem("token");
      onLogout();
      return;
    }

    // Other server errors
    if (!res.ok) {
      throw new Error("Failed to load products");
    }

    const data = await res.json();
    setProducts(data);

  } catch (err) {
    console.error("Failed to fetch products:", err);
  } finally {
    setLoading(false);
  }
}

  // Save single product field to the db
  async function saveProductField(productId, fieldName, fieldValue) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [fieldName]: fieldValue }),
      });
      return response.ok;
    } catch (err) {
      console.error("Save failed:", err);
      return false;
    }
  }

  // Updating the product in local state after successful save
  function updateLocalProduct(productId, fieldName, newValue) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, [fieldName]: newValue } : p
      )
    );
  }

  return (
    <div className="pricelist-page">

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme="light"
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="sidebar-header">
          <span className="sidebar-menu-title">Menu</span>
          {/* {mobile tablet cross btn } */}
          {screenType !== "desktop" && (
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.label}
                className={`nav-item ${item.active ? "nav-item--active" : ""}`}
                onClick={() => {}}
              >
                <IconComponent size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Logout btn */}
          <button
            className="nav-item nav-item--logout"
            onClick={onLogout}
          >
            <LogOut size={14} />
            <span>Log out</span>
          </button>
        </nav>
      </aside>

    
      <div className="main-content">

        {/* Blue top bar */}
        <div className="pricelist-topbar">

          {/* Hamburger */}
          {screenType !== "desktop" && (
            <button
              className="topbar-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} color="white" />
            </button>
          )}

          {/* admin user avatar */}
          {screenType === "desktop" && (
            <div className="topbar-user">
              <div className="topbar-avatar">JA</div>
              <div className="topbar-user-info">
                <span className="topbar-user-name">John Andres</span>
                <span className="topbar-user-company">Storfjord AS</span>
              </div>
            </div>
          )}

          <div className="topbar-lang">
            <span>English</span>
            <img
              src="https://storage.123fakturere.no/public/flags/GB.png"
              alt="English flag"
              className="topbar-flag"
            />
          </div>
        </div>

        <div className="white-content">

          <div className="toolbar">
            <div className="search-boxes">
              <div className="search-box">
                <input placeholder="Search Article No ..." />
                <Search size={13} color="#1a90d9" />
              </div>
              <div className="search-box">
                <input placeholder="Search Product ..." />
                <Search size={13} color="#1a90d9" />
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-btn">
                <span className="btn-green-circle">
                  <Plus size={12} color="white" strokeWidth={3} />
                </span>
                <span className="btn-text">New Product</span>
              </button>
              <button className="action-btn">
                <Printer size={14} color="#1a90d9" />
                <span className="btn-text">Print List</span>
              </button>
              <button className="action-btn">
                <ToggleRight size={16} color="#1a90d9" />
                <span className="btn-text">Advanced mode</span>
              </button>
            </div>
          </div>

          {/* Table headers */}
          <div className={`table-headers ${screenType}`}>
            <div className="th-spacer" />

            {screenType === "desktop" && (
              <>
                <div className="th">Article No. <ChevronDown size={11} /></div>
                <div className="th th-wide">Product/Service <ChevronDown size={11} /></div>
                <div className="th">In Price</div>
                <div className="th">Price</div>
                <div className="th">Unit</div>
                <div className="th">In Stock</div>
                <div className="th th-wide">Description</div>
              </>
            )}

            {screenType === "tablet" && (
              <>
                <div className="th">Article No.</div>
                <div className="th th-wide">Product/Service</div>
                <div className="th">Price</div>
                <div className="th">In Stock</div>
                <div className="th">Unit</div>
              </>
            )}

            {screenType === "mobile" && (
              <>
                <div className="th th-wide">Product/Service</div>
                <div className="th">Price</div>
              </>
            )}

            <div className="th-end" />
          </div>

          {/* Product list */}
          {loading && <p className="status-text">Loading products...</p>}

          {!loading && products.length === 0 && (
            <p className="status-text">No products found.</p>
          )}

          {!loading && products.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              screenType={screenType}
              showArrow={true}
              onSave={saveProductField}
              onSaveSuccess={updateLocalProduct}
            />
          ))}

        </div>
      </div>
    </div>
  );
}

function Field({ value, onChange, onBlur, wide }) {
  return (
    <input
      className={`row-field ${wide ? "row-field-wide" : ""}`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}

function ProductRow({ product, screenType, showArrow, onSave, onSaveSuccess }) {

  // Local editable values
  const [fieldValues, setFieldValues] = useState({ ...product });

  // Ref stores the last successfully saved values
  const savedValues = useRef({ ...product });

  // Update local state as user types 
  function handleChange(fieldName, newValue) {
    setFieldValues((prev) => ({ ...prev, [fieldName]: newValue }));
  }

  // On blur — save to DB if value changed by user
  async function handleBlur(fieldName) {
    const newValue       = fieldValues[fieldName];
    const lastSavedValue = savedValues.current[fieldName];

    // Skip if nothing changed since last save
    if (String(newValue ?? "") === String(lastSavedValue ?? "")) return;

 
    const toastId = toast.loading("Saving...", { position: "top-center" });

    const success = await onSave(product.id, fieldName, newValue);

    if (success) {
      // Update saved reference so next blur compares correctly
      savedValues.current[fieldName] = newValue;

      // Update parent state so value dont mismatch
      onSaveSuccess(product.id, fieldName, newValue);

      // Sucess feedback
      toast.update(toastId, {
        render: "✓ Database  updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
      });
    } else {
      // input again become last saved value
      setFieldValues((prev) => ({
        ...prev,
        [fieldName]: lastSavedValue,
      }));

      // loading toast becomes error
      toast.update(toastId, {
        render: "✗ Failed to save. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    }
  }

  return (
    <div className={`product-row ${screenType}`}>

    
      <span className="row-arrow">
        {showArrow ? "→" : ""}
      </span>

      {/* DESKTOP : 7 columns */}
      {screenType === "desktop" && (
        <>
          <Field
            value={fieldValues.article_no ?? ""}
            onChange={(e) => handleChange("article_no", e.target.value)}
            onBlur={() => handleBlur("article_no")}
          />
          <Field
            wide
            value={fieldValues.product_service ?? ""}
            onChange={(e) => handleChange("product_service", e.target.value)}
            onBlur={() => handleBlur("product_service")}
          />
          <Field
            value={fieldValues.in_price ?? ""}
            onChange={(e) => handleChange("in_price", e.target.value)}
            onBlur={() => handleBlur("in_price")}
          />
          <Field
            value={fieldValues.price ?? ""}
            onChange={(e) => handleChange("price", e.target.value)}
            onBlur={() => handleBlur("price")}
          />
          <Field
            value={fieldValues.unit ?? ""}
            onChange={(e) => handleChange("unit", e.target.value)}
            onBlur={() => handleBlur("unit")}
          />
          <Field
            value={fieldValues.in_stock ?? ""}
            onChange={(e) => handleChange("in_stock", e.target.value)}
            onBlur={() => handleBlur("in_stock")}
          />
          <Field
            wide
            value={fieldValues.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
          />
        </>
      )}

      {/* TABLET : 5 columns */}
      {screenType === "tablet" && (
        <>
          <Field
            value={fieldValues.article_no ?? ""}
            onChange={(e) => handleChange("article_no", e.target.value)}
            onBlur={() => handleBlur("article_no")}
          />
          <Field
            wide
            value={fieldValues.product_service ?? ""}
            onChange={(e) => handleChange("product_service", e.target.value)}
            onBlur={() => handleBlur("product_service")}
          />
          <Field
            value={fieldValues.price ?? ""}
            onChange={(e) => handleChange("price", e.target.value)}
            onBlur={() => handleBlur("price")}
          />
          <Field
            value={fieldValues.in_stock ?? ""}
            onChange={(e) => handleChange("in_stock", e.target.value)}
            onBlur={() => handleBlur("in_stock")}
          />
          <Field
            value={fieldValues.unit ?? ""}
            onChange={(e) => handleChange("unit", e.target.value)}
            onBlur={() => handleBlur("unit")}
          />
        </>
      )}

      {/* MOBILE : 2 columns */}
      {screenType === "mobile" && (
        <>
          <Field
            wide
            value={fieldValues.product_service ?? ""}
            onChange={(e) => handleChange("product_service", e.target.value)}
            onBlur={() => handleBlur("product_service")}
          />
          <Field
            value={fieldValues.price ?? ""}
            onChange={(e) => handleChange("price", e.target.value)}
            onBlur={() => handleBlur("price")}
          />
        </>
      )}

      {/* Three dots btn */}
      <button className="more-dots-btn" aria-label="Options">
        <MoreHorizontal size={15} color="#1a90d9" />
      </button>

    </div>
  );
}