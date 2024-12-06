import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { Box, Button, Divider, Drawer, IconButton, List, ListItem, Typography } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { color } from "../../../theme";

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
    },
    emptyCart: {
        textAlign: 'center',
        marginTop: '20px',
        color: 'gray',
    },
};

const Cart = () => {
    const { cart, removeFromCart } = useCart();
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open)
    };

    return (
        <>
        <IconButton color={color.secondary} onClick={toggleDrawer(true)}>
            <ShoppingCartIcon />
        </IconButton>

        <Drawer anchor='right' open={isDrawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={styles.drawer} role='presentation' onKeyDown={toggleDrawer(false)}>
                <Typography variant='h6' sx={styles.cartTitle}>
                    Your Cart
                </Typography>

                <Divider />

                {cart.length > 0 ? (
                    <List>
                        {cart.map((item) => (
                            <ListItem>
                                <Box>
                                    <Typography variant='body1'>{item.name}</Typography>
                                    <Typography variant='body2' color={color.primary}>
                                        Quantity: {item.quantity}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1">${(item.price * item.quantity)}</Typography>
                                    <Button size="small" onClick={() => removeFromCart(item.sku)}>
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
                    <Button variant="contained" fullWidth>
                        Proceed to Checkout
                    </Button>
                )}
            </Box>
        </Drawer>
        </>
    );
};

export default Cart;