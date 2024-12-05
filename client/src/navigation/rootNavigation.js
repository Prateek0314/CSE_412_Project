import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Paths } from './routes';
import { AdminPage, CheckoutPage, ItemPage, ShopPage } from '../pages';

export const RootNavigation = () => {
    return (
        <Routes>
            <Route path={Paths.ADMIN} element={<AdminPage />} />
            <Route path={Paths.CHECKOUT} element={<CheckoutPage />} />
            <Route path={Paths.ITEM} element={<ItemPage />} />
            <Route path={Paths.SHOP} element={<ShopPage />} />
            <Route path={Paths.DEFAULT} element={<ShopPage />} />
        </Routes>
    )
}