import React, { useMemo, useState } from 'react';
import { X, Trash2, MessageCircle, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';
import { WHATSAPP_PHONE_NUMBER } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity,
  onRemoveItem 
}) => {
  const [customerName, setCustomerName] = useState('');

  // Helper to get the actual price (offer or regular)
  const getPrice = (item: CartItem) => {
    return (item.offerPrice && item.offerPrice < item.price) ? item.offerPrice : item.price;
  };

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (getPrice(item) * item.quantity), 0);
  }, [cartItems]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-AR', { 
      style: 'currency', 
      currency: 'ARS', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const handleCheckout = () => {
    if (!customerName.trim()) {
      alert('Por favor ingresa tu nombre para el pedido.');
      return;
    }

    let message = `Hola! Soy ${customerName}, quisiera realizar el siguiente pedido en 3D Print Master:\n\n`;
    
    cartItems.forEach(item => {
      const finalPrice = getPrice(item);
      const subtotal = formatPrice(finalPrice * item.quantity);
      const isOffer = finalPrice < item.price;
      message += `- ${item.quantity}x ${item.name} ${isOffer ? '(OFERTA)' : ''} (${subtotal})\n`;
    });
    
    message += `\n*Total: ${formatPrice(total)}*`;
    message += `\n\nQuedo a la espera de la confirmación y datos de pago (Transferencia/Efectivo).`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-none border-l border-zinc-200 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-black">TU CARRITO</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 transition-colors">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-300 gap-4">
              <p className="text-sm tracking-widest uppercase">Tu carrito está vacío</p>
              <button onClick={onClose} className="text-black text-sm font-bold underline decoration-1 underline-offset-4">
                VER CATÁLOGO
              </button>
            </div>
          ) : (
            cartItems.map(item => {
               const finalPrice = getPrice(item);
               return (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-zinc-100 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <h4 className="font-medium text-sm text-black line-clamp-1 uppercase">{item.name}</h4>
                        {item.offerPrice && item.offerPrice < item.price && (
                           <span className="text-[10px] text-red-600 font-bold uppercase tracking-wide">¡Oferta!</span>
                        )}
                      </div>
                      <p className="text-black font-bold text-sm">{formatPrice(finalPrice * item.quantity)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-zinc-200">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-zinc-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-zinc-400 hover:text-black transition-colors text-xs uppercase underline decoration-1 underline-offset-2"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
               );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 bg-zinc-50 border-t border-zinc-100 space-y-6">
            <div className="flex justify-between items-center text-xl font-bold text-black">
              <span>TOTAL</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tu Nombre</label>
                <input 
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-black focus:ring-0 outline-none text-sm rounded-none transition-colors"
                />
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-black hover:bg-zinc-800 text-white py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-none"
            >
              <MessageCircle className="w-4 h-4" />
              Finalizar en WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};