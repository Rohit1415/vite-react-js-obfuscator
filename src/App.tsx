import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Cart from "./pages/Cart.tsx";
import Orders from "./pages/Orders.tsx";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <nav className="nav-glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black bg-gradient-to-r from-brand-600 to-indigo-800 bg-clip-text text-transparent">
                HYPESTORE
              </span>
            </Link>
            
            <div className="flex items-center space-x-6 shrink-0">
              <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors">
                Discover
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors">
                    Orders
                  </Link>
                  <Link to="/cart" className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors relative flex items-center">
                    Cart
                    <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white shadow-sm">
                      !
                    </span>
                  </Link>
                  <div className="h-6 w-px bg-gray-200 mx-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-bold px-5 py-2.5 rounded-xl border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="text-sm font-bold px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-brand-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 hidden-scrollbar">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <footer className="w-full border-t border-gray-200/50 bg-white/30 backdrop-blur-md py-8 mt-auto relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="text-xl font-black text-gray-300 mb-2 tracking-widest">HYPESTORE</span>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">© 2026 ENCRYPTED E-COMMERCE.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
