import { Box, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header, Product } from '../../components';
import { Grid } from '@mui/system';

const products = [
    {
        sku: '12345',
        description: 'High-quality wireless headphones with noise cancellation.',
        category: 'Electronics',
        quantity: 10,
        price: 299.99,
    },
    {
        sku: '67890',
        description: 'Smartphone with a 6.5-inch display and 128GB storage.',
        category: 'Electronics',
        quantity: 15,
        price: 799.99,
    },
    {
        sku: '11223',
        description: 'Ergonomic office chair with lumbar support.',
        category: 'Furniture',
        quantity: 5,
        price: 149.99,
    },
];

export const ShopPage = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <Header />
            <Box style={{ padding: '16px' }}>
                <Typography variant='h4' gutterBottom>
                    View Products
                </Typography>
                <Grid container spacing={2} alignItems='flex-start'>
                    {products.map((product) => (
                        <Grid item key={product.sku} sx={12} sm={6} md={4}>
                            <Product
                                sku={product.sku}
                                description={product.description}
                                category={product.category}
                                quantity={product.quantity}
                                price={product.price}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};