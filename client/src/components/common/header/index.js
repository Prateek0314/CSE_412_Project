import { AppBar, Box, Button, darken, Toolbar, Typography } from "@mui/material"
import { color } from "../../../theme";
import { useUser } from "../../../context/UserContext";

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
    button: {
        mr: 4,
        backgroundColor: color.primary,
        '&:hover': {
            backgroundColor: color.tertiaryText
        }
    }
};

export const Header = () => {
    const { user } = useUser();
    return (
        <Box>
            <AppBar sx={styles.appbar}>
                <Toolbar sx={styles.toolbar}>
                    <Typography variant='h4' sx={styles.title}>Shop</Typography>
                    {user ? (
                        <>
                        <Button variant="contained" sx={styles.button}>Profile</Button>
                        <Button variant="contained" sx={styles.button}>Cart</Button>
                        <Button variant="contained" sx={styles.button}>Checkout</Button>
                        </>
                    ) : (
                        <Button variant="contained" sx={styles.button}>Log In</Button>
                    )}
                </Toolbar>
            </AppBar>
            <Toolbar sx={styles.toolbar} />
        </Box>
    );
};