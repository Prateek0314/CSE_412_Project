import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { Box, Button, Divider, Drawer, List, ListItem, Typography } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { color } from "../../../theme";
import { useNavigate } from "react-router-dom";

const styles = {
    drawer: {
        width: 300,
        padding: 2,
    },
    cartTitle: {
        fontWeight: 'bold',
        marginBottom: '16px',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        gap: 16
    },
    itemDetails: {
        flexGrow: 1,
        marginRight: '16px'
    },
    emptyCart: {
        textAlign: 'center',
        marginTop: '20px',
        color: 'gray',
    },
    cartButton: {
        background: color.secondary,
        padding: '8px 16px',
        mr: 4
    },
    cartIcon: {
        ml: 1
    },
    removeButton: {
        color: color.secondary
    },
    checkoutButton: {
        background: color.secondary
    }
};

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart } = useCart();
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open)
    };

    const handleCheckoutButton = (e) => {
        navigate('/checkout');
        setDrawerOpen(false);
    };

    return (
        <>
        <Button variant="contained" sx={styles.cartButton} onClick={toggleDrawer(true)}>
            Cart
            <ShoppingCartIcon sx={styles.cartIcon} />
        </Button>

        <Drawer anchor='right' open={isDrawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={styles.drawer} role='presentation' onKeyDown={toggleDrawer(false)}>
                <Typography variant='h6' sx={styles.cartTitle}>
                    Your Cart
                </Typography>

                <Divider />

                {cart.length > 0 ? (
                    <List>
                        {cart.map((item) => (
                            <ListItem key={item.sku}>
                                <Box sx={styles.itemDetails}>
                                    <Typography variant='body1'>{item.description}</Typography>
                                    <Typography variant='body2' color={color.primary}>
                                        Quantity: {item.quantity}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
                                    <Button size="small" sx={styles.removeButton} onClick={() => removeFromCart(item.sku)}>
                                        Remove
                                    </Button>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" sx={styles.emptyCart}>
                        Your cart is empty.
                    </Typography>
                )}

                <Divider sx={{ marginY: 2 }} />

                {cart.length > 0 && (
                    <Button variant="contained" sx={styles.checkoutButton} onClick={handleCheckoutButton} fullWidth>
                        Proceed to Checkout
                    </Button>
                )}
            </Box>
        </Drawer>
        </>
    );
};

export default Cart;