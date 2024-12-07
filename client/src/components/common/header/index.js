import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import { color } from "../../../theme";
import { useUser } from "../../../context/UserContext";
import Cart from "../cart";
import { useNavigate } from "react-router-dom";

const styles = {
    appbar: {
        height: '6vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.primary
    },
    toolbar: {
        display: 'flex',
        width: '100%',
        padding: 0
    },
    title: {
        ml: 3,
        mr: 5
    },
    spacer: {
        flexGrow: 1
    },
    button: {
        mr: 4,
        backgroundColor: color.primary,
        '&:hover': {
            backgroundColor: color.tertiaryText
        }
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 2
    }
};

export const Header = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLoginButton = (e) => {
        navigate('/login');
    };

    const handleProfileButton = (e) => {
        navigate('/profile');
    };

    const handleLogoutButton = (e) => {
        logout();
        navigate('/login');
    };

    return (
        <Box>
            <AppBar sx={styles.appbar}>
                <Toolbar sx={styles.toolbar}>
                    <Typography variant='h4' sx={styles.title}>Shop</Typography>

                    {user ? (
                        <>
                        <Box sx={styles.buttonContainer}>
                            <Button variant="contained" sx={styles.button} onClick={handleProfileButton}>Profile</Button>
                        </Box>

                        <Cart />

                        <Box sx={styles.buttonContainer}>
                            <Button variant="contained" sx={styles.button} onClick={handleLogoutButton}>Logout</Button>
                        </Box>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            sx={styles.button}
                            onClick={handleLoginButton}
                        >
                            Log In
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Toolbar sx={styles.toolbar} />
        </Box>
    );
};