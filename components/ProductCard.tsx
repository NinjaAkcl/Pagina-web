import React, { useState } from 'react';
import { Product } from '../types';
import { ImageOff, Check, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-AR', { 
      style: 'currency', 
      currency: 'ARS', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product);
    
    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const hasOffer = product.offerPrice && product.offerPrice < product.price;
  const displayPrice = hasOffer ? product.offerPrice! : product.price;
  
  // Calcular porcentaje de descuento
  const discountPercentage = hasOffer 
    ? Math.round(((product.price - product.offerPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="group flex flex-col h-full border border-transparent hover:border-zinc-200 transition-all duration-300 p-2 bg-white hover:shadow-sm relative">
      
      {/* Badge de Oferta con Porcentaje Automático */}
      {hasOffer && (
        <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest flex items-center gap-1 shadow-sm">
          <Tag className="w-3 h-3" />
          {discountPercentage}% OFF
        </div>
      )}

      <div className="relative aspect-square overflow-hidden bg-zinc-50 mb-4 flex items-center justify-center">
        {!imgError ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform"
          />
        ) : (
          <div className="flex flex-col items-center text-zinc-300 gap-2">
            <ImageOff className="w-8 h-8" />
            <span className="text-[10px] uppercase tracking-widest">Sin Imagen</span>
          </div>
        )}
        
        {/* Overlay sutil al hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-baseline mb-1 gap-2">
            <h3 className="text-sm font-bold text-black uppercase tracking-wide truncate group-hover:text-zinc-600 transition-colors">{product.name}</h3>
        </div>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2">{product.category}</p>
        <p className="text-zinc-600 text-xs mb-4 line-clamp-2 flex-1 font-light leading-relaxed">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
            <div className="flex flex-col">
              {hasOffer && (
                <span className="text-[10px] text-zinc-400 line-through decoration-zinc-400 decoration-1 mb-0.5 block">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className={`text-sm font-bold tabular-nums ${hasOffer ? 'text-red-600' : 'text-black'}`}>
                  {formatPrice(displayPrice)}
              </span>
            </div>
            <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`
                  relative overflow-hidden px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-none transition-all duration-300
                  ${isAdding 
                    ? 'bg-zinc-800 text-white w-24' 
                    : 'bg-black text-white hover:bg-zinc-800 w-24'
                  }
                `}
            >
                <div className="flex items-center justify-center gap-2">
                  {isAdding ? (
                    <>
                      <Check className="w-3 h-3 animate-in zoom-in duration-300" />
                      <span className="animate-in fade-in duration-300">Listo</span>
                    </>
                  ) : (
                    <>
                      <span>Agregar</span>
                    </>
                  )}
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};