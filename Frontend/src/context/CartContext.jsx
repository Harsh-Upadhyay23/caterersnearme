import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState(null); // Single menu selection
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(100);

  const addToCart = (menu, caterer) => {
    setCartItem({
      menuId: menu.id,
      menuName: menu.menuName,
      description: menu.description,
      dishes: menu.dishes,
      type: menu.type,
      pricePerPerson: menu.price,
      catererId: caterer.id || caterer._id,
      catererName: caterer.name,
    });
    setIsCartOpen(true);
  };

  const clearCart = () => {
    setCartItem(null);
    setIsCartOpen(false);
    setGuestCount(100);
  };

  const totalPrice = cartItem ? cartItem.pricePerPerson * guestCount : 0;

  return (
    <CartContext.Provider
      value={{
        cartItem,
        isCartOpen,
        setIsCartOpen,
        guestCount,
        setGuestCount,
        addToCart,
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
