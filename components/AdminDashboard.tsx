import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { Copy, Save, ArrowLeft, AlertTriangle, Trash2, Plus, Edit, X, Image as ImageIcon } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  onClose: () => void;
}

const EMPTY_PRODUCT: Product = {
  id: '',
  name: '',
  description: '',
  price: 0,
  category: 'Figuras',
  imageUrl: 'https://picsum.photos/400/400'
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ products: initialProducts, onClose }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(EMPTY_PRODUCT);
  const [isNew, setIsNew] = useState(false);

  // --- CRUD Operations ---

  const handleAddNew = () => {
    setCurrentProduct({
      ...EMPTY_PRODUCT,
      id: Date.now().toString(), // Simple unique ID
    });
    setIsNew(true);
    setIsEditing(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsNew(false);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!currentProduct.name || !currentProduct.price) {
      alert('El nombre y el precio son obligatorios');
      return;
    }

    if (isNew) {
      setProducts(prev => [...prev, currentProduct]);
    } else {
      setProducts(prev => prev.map(p => p.id === currentProduct.id ? currentProduct : p));
    }
    
    setIsEditing(false);
  };

  // --- Code Generation ---

  const generateCode = () => {
    const code = `export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
    setGeneratedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Código copiado! Ahora pégalo en constants.ts');
  };

  // Calculate discount for display in form
  const calculateDiscount = () => {
    if (currentProduct.price > 0 && currentProduct.offerPrice && currentProduct.offerPrice < currentProduct.price) {
      return Math.round(((currentProduct.price - currentProduct.offerPrice) / currentProduct.price) * 100);
    }
    return 0;
  };
  
  const currentDiscount = calculateDiscount();

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-300 p-6 font-mono animate-in fade-in duration-300 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
             <button 
                onClick={onClose} 
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-colors"
             >
                <ArrowLeft className="w-4 h-4" />
                Volver a la Web
             </button>
             <h1 className="text-2xl font-bold text-white uppercase tracking-widest">NextLayer Admin</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-yellow-500 border border-yellow-500/30 p-2 bg-yellow-500/10">
             <AlertTriangle className="w-4 h-4" />
             <span>Edición local. Genera el código para guardar permanentemente.</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Main List */}
            <div className="lg:col-span-3 space-y-4">
                <div className="bg-black border border-zinc-800 p-4 min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-white">Inventario</h2>
                      <button 
                        onClick={handleAddNew}
                        className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Agregar Producto
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-zinc-400">
                            <thead className="text-xs uppercase bg-zinc-900 text-zinc-500">
                                <tr>
                                    <th className="px-4 py-3">Img</th>
                                    <th className="px-4 py-3">Producto</th>
                                    <th className="px-4 py-3">Categoría</th>
                                    <th className="px-4 py-3 text-right">Precio</th>
                                    <th className="px-4 py-3 text-right">Oferta</th>
                                    <th className="px-4 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {products.map(p => (
                                    <tr key={p.id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-4 py-3">
                                          <img src={p.imageUrl} alt="" className="w-8 h-8 object-cover bg-zinc-800" />
                                        </td>
                                        <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                                        <td className="px-4 py-3 text-xs uppercase">{p.category}</td>
                                        <td className="px-4 py-3 text-right">${p.price}</td>
                                        <td className="px-4 py-3 text-right">
                                            {p.offerPrice ? (
                                              <div className="flex flex-col items-end">
                                                <span className="text-green-400 font-bold">${p.offerPrice}</span>
                                                {p.offerPrice < p.price && (
                                                   <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1">
                                                     {Math.round(((p.price - p.offerPrice) / p.price) * 100)}% OFF
                                                   </span>
                                                )}
                                              </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="flex justify-center gap-2">
                                            <button 
                                              onClick={() => handleEdit(p)}
                                              className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                              title="Editar"
                                            >
                                              <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                              onClick={() => handleDelete(p.id)}
                                              className="p-2 hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-colors"
                                              title="Eliminar"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Sidebar: Code Generator */}
            <div className="lg:col-span-1">
                <div className="bg-black border border-zinc-800 p-4 sticky top-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">Guardar Cambios</h2>
                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                        1. Realiza todos tus cambios (agregar, editar, eliminar).<br/>
                        2. Presiona "Generar Código".<br/>
                        3. Copia el texto.<br/>
                        4. Reemplaza el contenido de <code>constants.ts</code>.
                    </p>
                    
                    <button 
                        onClick={generateCode}
                        className="w-full bg-white text-black py-3 font-bold text-sm uppercase hover:bg-zinc-200 mb-4 flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Generar Código
                    </button>

                    {generatedCode && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="relative group">
                                <pre className="bg-zinc-900 p-4 text-[10px] text-green-400 overflow-auto h-64 border border-zinc-700 font-mono selection:bg-green-900">
                                    {generatedCode}
                                </pre>
                                <button 
                                    onClick={copyToClipboard}
                                    className="absolute top-2 right-2 bg-white text-black p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-200"
                                    title="Copiar al portapapeles"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-center text-xs text-zinc-500 mt-2">Código listo para copiar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Edit/Create Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 w-full max-w-2xl border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-black">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                  {isNew ? 'Nuevo Producto' : 'Editar Producto'}
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 flex-1">
                <form id="productForm" onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Image & Preview */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-black border border-zinc-700 flex items-center justify-center overflow-hidden group relative">
                      {currentProduct.imageUrl ? (
                        <img src={currentProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-zinc-600">
                          <ImageIcon className="w-12 h-12 mb-2" />
                          <span className="text-xs uppercase">Vista Previa</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">URL de Imagen</label>
                      <input 
                        type="text" 
                        value={currentProduct.imageUrl}
                        onChange={(e) => setCurrentProduct({...currentProduct, imageUrl: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-white outline-none"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">Pega aquí el enlace directo a tu imagen.</p>
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Nombre</label>
                      <input 
                        type="text" 
                        required
                        value={currentProduct.name}
                        onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                        className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Categoría</label>
                      <select 
                        value={currentProduct.category}
                        onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                        className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-white outline-none"
                      >
                        {Object.values(ProductCategory).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Precio</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          value={currentProduct.price}
                          onChange={(e) => setCurrentProduct({...currentProduct, price: parseInt(e.target.value) || 0})}
                          className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="flex items-center justify-between text-xs font-bold uppercase text-zinc-500 mb-1">
                          <span>Precio Oferta</span>
                          {currentDiscount > 0 && (
                            <span className="text-green-400">(-{currentDiscount}%)</span>
                          )}
                        </label>
                        <input 
                          type="number" 
                          min="0"
                          placeholder="Opcional"
                          value={currentProduct.offerPrice || ''}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value) : undefined;
                            setCurrentProduct({...currentProduct, offerPrice: val});
                          }}
                          className="w-full bg-black border border-zinc-700 p-3 text-sm text-green-400 focus:border-white outline-none placeholder:text-zinc-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Descripción</label>
                      <textarea 
                        rows={4}
                        value={currentProduct.description}
                        onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                        className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-white outline-none resize-none"
                      />
                    </div>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-zinc-800 bg-black flex justify-end gap-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-xs font-bold uppercase hover:text-white text-zinc-400 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  form="productForm"
                  className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};