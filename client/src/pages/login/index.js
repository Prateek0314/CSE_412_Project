import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { Header } from "../../components";
import { color } from "../../theme";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { getCustomerInfo } from "../../services/api";

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 6vh)',
        gap: 2
    },
    textField: {
        width: '300px',
        background: color.white
    },
    errorText: {
        mt: 1,
        color: color.error
    },
    button: {
        width: '300px',
        mt: 2,
        background: color.secondary
    }
};

export const LoginPage = () => {
    const [userID, setUserID] = useState('');
    const [error, setError] = useState('');
    const { user, login } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/shop');
        }
    }, [user, navigate])

    const handleLogin = async () => {
        try {
            const customer = await getCustomerInfo(userID);
            if (customer) {
                setError('');
                login({ userID: customer.Customer_ID }); // Set user details
                navigate('/shop');
            } else {
                setError('Invalid user ID.');
            }
        } catch (error) {
            console.error("Login failed:", error.message);
            setError('Unable to log in. Please try again.');
        }
    };

    return (
        <Box>
            <Header />
            <Box sx={styles.container}>
                <Typography variant="h4">Login</Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                    sx={styles.textField} 
                />
                {error && (
                    <Typography sx={styles.errorText}>{error}</Typography>
                )}
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={styles.button}
                >
                    Log In
                </Button>
            </Box>
        </Box>
    );
};