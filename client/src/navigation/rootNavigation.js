import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Paths } from './routes';
import { CheckoutPage, LoginPage, ShopPage, TransactionConfirmed } from '../pages';

export const RootNavigation = () => {
    return (
        <Routes>
            <Route path={Paths.CHECKOUT} element={<CheckoutPage />} />
            <Route path={Paths.LOGIN} element={<LoginPage />} />
            <Route path={Paths.SHOP} element={<ShopPage />} />
            <Route path={Paths.ORDER_CONFIRMATION} element={<TransactionConfirmed />} />
            <Route path={Paths.DEFAULT} element={<ShopPage />} />
        </Routes>
    )
}