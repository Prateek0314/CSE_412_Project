import { Box, Button, TextField, Typography } from '@mui/material';
import { Header, Product } from '../../components';
import { Grid } from '@mui/system';
import { useEffect, useState } from 'react';
import { color } from '../../theme';
import { getAllProducts } from '../../services/api';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                const formattedProducts = data.map((product) => ({
                    sku: product.Product_SKU,
                    description: product.Product_Description,
                    category: product.Product_Category,
                    quantity: product.Quantity,
                    price: product.Item_Price,
                }));
                setProducts(formattedProducts);
                setFilteredProducts(formattedProducts);
            } catch (error) {
                console.error("Error fetching products: ", error.message);
            }
        };

        fetchProducts();
    }, []);

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