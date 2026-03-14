import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Multiple menu selections
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(100);

  const addToCart = (menu, caterer) => {
    if (!cartItems.some(item => item.menuId === menu.id)) {
      setCartItems(prev => [...prev, {
        menuId: menu.id,
        menuName: menu.menuName,
        description: menu.description,
        dishes: menu.dishes,
        type: menu.type,
        pricePerPerson: menu.price,
        catererId: caterer.id || caterer._id,
        catererName: caterer.name,
      }]);
    }
    setIsCartOpen(true);
  };

  const removeCartItem = (menuId) => {
    setCartItems(prev => prev.filter(item => item.menuId !== menuId));
  };

  const clearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
    setGuestCount(100);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.pricePerPerson * guestCount), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        guestCount,
        setGuestCount,
        addToCart,
        removeCartItem,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
