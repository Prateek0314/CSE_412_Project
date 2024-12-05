import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ShopPage = () => {
    const navigate = useNavigate();

    const handleItemClick = (item) => {
        navigate('/item', { state: { item } });
    }
    return (
        <Box>
            <Typography>Hello</Typography>
        </Box>
    );
};