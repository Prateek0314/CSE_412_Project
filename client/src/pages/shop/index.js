import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header, Product } from '../../components';
import { Grid } from '@mui/system';
import { useState } from 'react';
import { color } from '../../theme';

const products = [
    {
        sku: '12345',
        description: 'Wireless Headphones',
        category: 'Electronics',
        quantity: 10,
        price: 299.99,
    },
    {
        sku: '67890',
        description: 'Smartphone',
        category: 'Electronics',
        quantity: 15,
        price: 799.99,
    },
    {
        sku: '11223',
        description: 'Office Chair',
        category: 'Furniture',
        quantity: 5,
        price: 149.99,
    },
    {
        sku: '44556',
        description: '2-Slice Toaster',
        category: 'Kitchen',
        quantity: 8,
        price: 29.99,
    },
    {
        sku: '99887',
        description: 'Bluetooth Speaker',
        category: 'Electronics',
        quantity: 20,
        price: 49.99,
    },
    {
        sku: '55667',
        description: 'Knife Set',
        category: 'Kitchen',
        quantity: 12,
        price: 79.99,
    },
];

const styles = {
    searchbox: {
        display: 'flex',
        justifyContext: 'center', mb: 4
    },
    searchbar: {
        width: '50%',
        mr: 2,
        backgroundColor: color.white
    },
    searchButton: {
        background: color.secondary
    }
}

export const ShopPage = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);

    const handleSearch = () => {
        const removeCaseSearch = searchTerm.toLowerCase();
        const filteredResults = products.filter((product) => 
            product.description.toLowerCase().includes(removeCaseSearch)
        );
        setFilteredProducts(filteredResults);
    };

    return (
        <Box>
            <Header />
            <Box style={{ padding: '16px' }}>
                <Typography variant='h4' gutterBottom>
                    View Products
                </Typography>

                <Box sx={styles.searchbox}>
                    <TextField label="Search" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={styles.searchbar} />
                    <Button variant="contained" sx={styles.searchButton} onClick={handleSearch}>
                        Search
                    </Button>
                </Box>

                <Grid container spacing={2} alignItems='flex-start'>
                    {filteredProducts.map((product) => (
                        <Grid item key={product.sku} xs={12} sm={6} md={4}>
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