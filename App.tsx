import React, { useState, useEffect } from 'react';
import { Header, PageView } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ChatBot } from './components/ChatBot';
import { AdminDashboard } from './components/AdminDashboard';
import { PRODUCTS, WHATSAPP_PHONE_NUMBER } from './constants';
import { CartItem, Product, ProductCategory } from './types';
import { Search, ArrowRight, MapPin, Phone, Mail, Settings, Lock, X, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<PageView>('home');
  
  // Admin Logic
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // Estado de sesión
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Estado de visibilidad del panel
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para mostrar el modal de login
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Catalog filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Trigger del Modal al hacer 5 clicks
  useEffect(() => {
    if (adminClickCount >= 5) {
        setAdminClickCount(0);
        setShowLoginModal(true);
    }
  }, [adminClickCount]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin') {
        setIsAdminAuthenticated(true);
        setShowLoginModal(false);
        setShowAdminPanel(false); // No abrir panel inmediatamente, solo mostrar el botón flotante
        setPasswordInput('');
        setLoginError(false);
    } else {
        setLoginError(true);
        setPasswordInput('');
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Admin View Render
  if (showAdminPanel && isAdminAuthenticated) {
      return (
        <AdminDashboard 
            products={PRODUCTS} 
            onClose={() => setShowAdminPanel(false)} 
        />
      );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            {/* Hero Section - Minimalist */}
            <section className="bg-black text-white py-24 md:py-32 relative overflow-hidden">
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl">
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-zinc-400 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Manufactura Aditiva
                  </h2>
                  <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    CREAMOS EL FUTURO<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">CAPA POR CAPA.</span>
                  </h1>
                  <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    NextLayer transforma ideas digitales en objetos físicos tangibles. 
                    Diseño, prototipado y producción en Córdoba, Argentina.
                  </p>
                  <button 
                    onClick={() => setCurrentView('catalog')}
                    className="bg-white text-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 rounded-none"
                  >
                    Ver Catálogo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Abstract BG Element */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900 to-transparent opacity-50 pointer-events-none"></div>
            </section>

            {/* Featured Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight text-black">DESTACADOS</h2>
                    <div className="h-1 w-12 bg-black"></div>
                  </div>
                  <button onClick={() => setCurrentView('catalog')} className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
                    Ver Todo
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {PRODUCTS.slice(0, 3).map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      
      case 'catalog':
        return (
          <div className="py-12 bg-white min-h-screen">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-black">CATÁLOGO</h1>
                    <p className="text-zinc-500 text-sm">Explora nuestra colección de diseños.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                   {/* Search */}
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-zinc-200 focus:border-black outline-none w-full sm:w-64 text-sm rounded-none"
                      />
                   </div>
                   
                   {/* Categories */}
                   <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-zinc-200 focus:border-black outline-none bg-white text-sm uppercase tracking-wide rounded-none cursor-pointer"
                   >
                      <option value="all">Todas las categorías</option>
                      {Object.values(ProductCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                   </select>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-zinc-200 bg-zinc-50">
                    <p className="text-zinc-400 text-sm uppercase tracking-widest">No se encontraron productos.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'info':
        return (
          <div className="py-12 bg-white min-h-screen animate-in fade-in duration-500">
             <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                   <h1 className="text-4xl font-bold mb-4 text-black">NEXTLAYER</h1>
                   <p className="text-zinc-500 max-w-xl mx-auto font-light">
                     Somos un estudio de diseño y manufactura aditiva enfocado en la calidad, la funcionalidad y la estética minimalista.
                   </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                   <div className="bg-zinc-50 p-8 border border-zinc-100">
                      <h3 className="text-lg font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Ubicación
                      </h3>
                      <p className="text-zinc-600 mb-4">Córdoba, Argentina.</p>
                      <p className="text-zinc-500 text-sm font-light">
                        Realizamos envíos a todo el país. Nuestro taller no cuenta con atención al público sin cita previa.
                      </p>
                   </div>
                   
                   <div className="bg-zinc-50 p-8 border border-zinc-100">
                      <h3 className="text-lg font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Contacto
                      </h3>
                      <p className="text-zinc-600 mb-2 font-mono">+54 9 351 296-5608</p>
                      <p className="text-zinc-500 text-sm mb-6">Atención personalizada vía WhatsApp.</p>
                      
                      <a 
                        href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}`}
                        target="_blank"
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-70 transition-opacity"
                      >
                        Enviar Mensaje <ArrowRight className="w-3 h-3" />
                      </a>
                   </div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-900">
      <Header 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-zinc-100 py-12 text-center">
        <p className="text-black font-bold text-lg mb-2">NEXTLAYER</p>
        <p 
           className="text-zinc-400 text-xs uppercase tracking-widest cursor-pointer select-none hover:text-zinc-600 transition-colors"
           onClick={() => setAdminClickCount(prev => prev + 1)}
        >
           © 2024 Diseño y Manufactura Aditiva.
        </p>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      <ChatBot />

      {/* Custom Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm p-8 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200 relative">
               <button 
                 onClick={() => setShowLoginModal(false)}
                 className="absolute top-4 right-4 text-zinc-400 hover:text-black"
               >
                 <X className="w-5 h-5" />
               </button>

               <div className="flex flex-col items-center mb-6">
                  <div className="p-3 bg-black text-white mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold uppercase tracking-widest text-center">Acceso Admin</h2>
                  <p className="text-xs text-zinc-500 text-center mt-1">Ingresa la contraseña para editar ofertas</p>
               </div>

               <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setLoginError(false);
                      }}
                      placeholder="Contraseña..."
                      autoFocus
                      className={`w-full p-3 border ${loginError ? 'border-red-500 bg-red-50' : 'border-zinc-300 focus:border-black'} outline-none text-center tracking-widest rounded-none transition-colors`}
                    />
                    {loginError && (
                      <div className="flex items-center justify-center gap-2 mt-2 text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold">Contraseña incorrecta</span>
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-black text-white py-3 font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-none"
                  >
                    Ingresar
                  </button>
               </form>
            </div>
        </div>
      )}

      {/* Floating Admin Toggle Button - Only visible when authenticated */}
      {isAdminAuthenticated && !showAdminPanel && (
        <button
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-6 left-6 z-50 bg-red-600 text-white px-4 py-3 font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-red-700 transition-all hover:scale-105 rounded-none flex items-center gap-2 animate-in slide-in-from-bottom-10"
        >
          <Settings className="w-4 h-4" />
          Panel Admin
        </button>
      )}
    </div>
  );
};

export default App;