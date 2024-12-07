import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { Header } from '../../components';
import { color } from '../../theme';

const styles = {
    container: {
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    detailsBox: {
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 4,
        backgroundColor: '#f9f9f9',
        width: '100%',
        maxWidth: 600,
    },
    button: {
        mt: 4,
        background: color.secondary
    },
};

export const TransactionConfirmed = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Access transaction details passed via state
    const transaction = location.state?.transaction;

    if (!transaction) {
        return (
            <Box sx={styles.container}>
                <Typography variant="h6" color="error">
                    No transaction details found.
                </Typography>
                <Button
                    variant="contained"
                    sx={styles.button}
                    onClick={() => navigate('/')}
                >
                    Go to Home
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Header />

            <Box sx={styles.container}>
                <Typography variant="h4">Transaction Confirmed!</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Thank you for your purchase. Here are your transaction details:
                </Typography>

                <Box sx={styles.detailsBox}>
                    <Typography variant="body1">
                        <strong>Transaction ID:</strong> {transaction.Transaction_ID}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Customer ID:</strong> {transaction.CustomerID}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Total Price:</strong> ${transaction.Total_Price}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Delivery Charges:</strong> ${transaction.Delivery_charges}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Tax:</strong> {transaction.Tax_pct}%
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    sx={styles.button}
                    onClick={() => navigate('/profile')}
                >
                    Go to Profile
                </Button>
            </Box>
        </Box>
    );
};
