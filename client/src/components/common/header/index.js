import { AppBar, Box, Button, darken, Toolbar, Typography } from "@mui/material"
import { color } from "../../../theme";
import { useUser } from "../../../context/UserContext";
import Cart from "../cart";

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
    const { user } = useUser();
    return (
        <Box>
            <AppBar sx={styles.appbar}>
                <Toolbar sx={styles.toolbar}>
                    <Typography variant='h4' sx={styles.title}>Shop</Typography>

                    {!user ? (
                        <>
                        <Box sx={styles.buttonContainer}>
                            <Button variant="contained" sx={styles.button}>Profile</Button>
                        </Box>

                        <Cart />
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