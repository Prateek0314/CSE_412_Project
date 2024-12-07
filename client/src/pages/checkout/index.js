import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, Grid, IconButton, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { useCart } from '../../context/CartContext';
import { Header } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { color } from '../../theme';

const coupons = [
    { code: "SAVE10", discount: 10 },
    { code: "SAVE20", discount: 20 }
];

const styles = {
    container: {
        p: 4
    },
    header: {
        mb: 4
    },
    cartSection: {
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    summarySection: {
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        mb: 2,
        border: '1px solid #ccc',
        borderRadius: 2
    },
    summaryText: {
        mb: 1
    },
    priceText: {
        mt: 2
    },
    selectedCouponBox: {
        mt: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectCouponBox: {
        mt: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center'
    },
    addCouponText: {
        flex: 1
    },
    couponDrawer: {
        width: 300,
        p: 4
    },
    couponDrawerSelect: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        mb: 2,
        border: '1px solid #ccc',
        borderRadius: 2
    },
    checkoutButton: {
        mt: 4,
        width: "100%",
        background: color.secondary
    }
};

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { clearCart } = useCart();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    });

    const { cart } = useCart();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [taxPct] = useState(8.5);
    const [deliveryCharges] = useState(10.99);
    const [finalPrice, setFinalPrice] = useState(0);

    const calculateTotal = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountAmount = selectedCoupon ? (subtotal * selectedCoupon.discount) / 100 : 0;
        const discountedSubtotal = subtotal - discountAmount;
        const tax = ((discountedSubtotal + deliveryCharges) * taxPct) / 100;
        const totalPrice = discountedSubtotal + deliveryCharges + tax;
        setFinalPrice(totalPrice);
    };

    useEffect(() => {
        calculateTotal();
    }, [cart, selectedCoupon]);

    const handleAddCoupon = (coupon) => {
        setSelectedCoupon(coupon);
        setDrawerOpen(false);
    };

    const handleRemoveCoupon = () => {
        setSelectedCoupon(null);
    };

    const handleCheckout = () => {
        const transactionID = `TXN-${Date.now()}`;

        const transactionDetail = cart.map((item) => ({
            Transaction_ID: transactionID,
            Product_SKU: item.sku,
            Purchased_Quantity: item.quantity
        }));

        const transactionInfo = {
            CustomerID: user?.username,
            Delivery_charges: deliveryCharges,
            Coupon_Code: selectedCoupon ? selectedCoupon.code : 0,
            Tax_pct: taxPct,
            Total_price: finalPrice.toFixed(2),
            transactionDetail
        };

        navigate('/transaction-complete', { state: { transaction: transactionInfo } });

        clearCart();
    };

    return (
        <Box>
            <Header />

            <Box sx={styles.container}>
                <Typography variant="h4" sx={styles.header}>Checkout</Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Box sx={styles.cartSection}>
                            <Typography variant="h6" sx={styles.header}>Your Cart</Typography>
                            {cart.map((item) => (
                                <Box key={item.sku} sx={styles.cartItem}>
                                    <Box>
                                        <Typography variant="body1">{item.description}</Typography>
                                        <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                    </Box>
                                    <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box sx={styles.summarySection}>
                            <Typography variant="h6">Summary</Typography>
                            <Typography variant="body1" sx={styles.summaryText}>
                                Subtotal: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                            </Typography>
                            <Typography variant="body1" sx={styles.summaryText}>
                                Delivery Charges: ${deliveryCharges.toFixed(2)}
                            </Typography>
                            <Typography variant="body1" sx={styles.summaryText}>
                                Tax ({taxPct}%): ${(((cart.reduce((sum, item) => sum + item.price * item.quantity, 0) - ((cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * (selectedCoupon?.discount || 0)) / 100) + deliveryCharges) * taxPct) / 100).toFixed(2)}
                            </Typography>
                            <Typography variant="body1" sx={styles.priceText}>
                                Final Price: ${finalPrice.toFixed(2)}
                            </Typography>

                            {selectedCoupon ? (
                                <Box sx={styles.selectedCouponBox}>
                                    <Box>
                                        <Typography variant="body1">Coupon Applied: {selectedCoupon.code}</Typography>
                                        <Typography variant="body2">Discount: {selectedCoupon.discount}%</Typography>
                                    </Box>
                                    <IconButton onClick={handleRemoveCoupon}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Box sx={styles.selectCouponBox}>
                                    <Typography variant="body1" sx={styles.addCouponText}>Add Coupon</Typography>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>Add</Button>
                                </Box>
                            )}

                            <Button variant="contained" sx={styles.checkoutButton} onClick={handleCheckout}>
                                Complete Transaction
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
                    <Box sx={styles.couponDrawer}>
                        <Typography variant="h6">Available Coupons</Typography>
                        {coupons.map((coupon) => (
                            <Box key={coupon.code} sx={styles.couponDrawerSelect}>
                                <Box>
                                    <Typography variant="body1">{coupon.code}</Typography>
                                    <Typography variant="body2">Discount: {coupon.discount}%</Typography>
                                </Box>
                                <Button variant="contained" size="small" onClick={() => handleAddCoupon(coupon)}>Add</Button>
                            </Box>
                        ))}
                    </Box>
                </Drawer>
            </Box>
        </Box>
    );
};