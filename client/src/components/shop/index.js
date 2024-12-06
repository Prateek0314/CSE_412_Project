import { Button, Card, CardActions, CardContent, Divider, IconButton, Modal, Typography, Box } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { color } from "../../theme";
import { useCart } from '../../context/CartContext';
import { useState } from "react";

const styles = {
    card: {
        maxWidth: 345,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 'auto',
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
    },
    cardContent: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    skuText: {
        fontWeight: 'bold',
        mb: 1,
    },
    priceContainer: {
        marginTop: 'auto'
    },
    text: {
        mb: 1,
    },
    boldText: {
        fontWeight: 'bold',
    },
    divider: {
        marginY: 1,
    },
    cardActions: {
        justifyContent: 'space-between',
    },
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: color.offWhite,
        border: '0px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    },
    modalTitleText: {
        mb: 2,
    },
    modalQuantity: {
        display: 'flex',
        alignItems: 'center',
        mt: 2,
    },
    modalCartButton: {
        background: color.secondary,
        mt: 3,
    },
};

export const Product = (props) => {
    const {
        sku,
        description,
        category,
        quantity,
        price
    } = props;

    const { addToCart } = useCart();
    const [isModalOpen, setModalOpen] = useState(false);
    const [itemQuantity, setItemQuantity] = useState(1);

    const handleViewMore = () => {
        setModalOpen(true);
    };

    const handleAddToCart = () => {
        addToCart(sku, itemQuantity);
    }

    return (
        <Card sx={styles.card}>
            <CardContent sx={styles.cardContent}>
                <Typography variant="h6" component="div" sx={styles.skuText}>
                    SKU: {sku}
                </Typography>
                <Typography variant="body2" color={color.bodyText} sx={styles.text}>
                    <strong>{description}</strong>
                </Typography>
                <Typography variant="body2" color={color.bodyText} sx={styles.text}>
                    <strong>Category: </strong>{category}
                </Typography>
                <Box sx={styles.priceContainer}>
                    <Divider />
                    <Typography variant="body1" color={color.primary} sx={styles.boldText}>
                        ${price.toFixed(2)}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={styles.cardActions}>
                <IconButton color={color.tertiaryText} onClick={handleViewMore} aria-label="view info">
                    <InfoIcon />
                </IconButton>
                <IconButton color={color.tertiaryText} onClick={handleAddToCart} aria-label="add to cart">
                    <AddShoppingCartIcon />
                </IconButton>
            </CardActions>

            <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
                <Card sx={styles.modal}>
                    <CardContent>
                        <Typography variant="h6" component="h2" sx={styles.modalTitleText}>
                            Product Details
                        </Typography>
                        <Typography variant="body1" sx={styles.text}>
                            <strong>SKU:</strong> {sku}
                        </Typography>
                        <Typography variant="body1" sx={styles.text}>
                            <strong>Description:</strong> {description}
                        </Typography>
                        <Typography variant="body1" sx={styles.text}>
                            <strong>Category:</strong> {category}
                        </Typography>
                        <Typography variant="body1" sx={styles.text}>
                            <strong>Quantity Available:</strong> {quantity}
                        </Typography>
                        <Typography variant="body1" sx={styles.text}>
                            <strong>Price:</strong> ${price.toFixed(2)}
                        </Typography>

                        <Box sx={styles.modalQuantity}>
                            <Button variant="outlined" onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}>
                                -
                            </Button>
                            <Typography sx={{ mx: 2 }}>{itemQuantity}</Typography>
                            <Button variant="outlined" onClick={() => setItemQuantity(Math.min(quantity, itemQuantity + 1))}>
                                +
                            </Button>
                        </Box>

                        <Button variant="contained" sx={styles.modalCartButton} onClick={handleAddToCart}>
                            Add To Cart
                        </Button>
                    </CardContent>
                </Card>
            </Modal>
        </Card>
    )
}