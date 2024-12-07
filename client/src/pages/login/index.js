import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react"
import { Header } from "../../components";
import { color } from "../../theme";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../components/login";

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, login } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/shop');
        }
    }, [user, navigate])

    const handleLogin = () => {
        const user = process.env.REACT_APP_USER;
        const pass = process.env.REACT_APP_PASS;

        if (username === user && password === pass) {
            setError('');
            login({ username });
            navigate('/shop');
        } else {
            setError('Invalid username or password.');
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={styles.textField} 
                />
                <PasswordField password={password} setPassword={setPassword} />
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