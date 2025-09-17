import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login-new.jsx';
import CategoriesPage from './pages/categories.jsx';
import CategoryProductsPage from './pages/categoryProducts.jsx';
import ProductsPage from './pages/products.jsx';
import FavoritesPage from './pages/favorites.jsx';
import ViewedProductsPage from './pages/viewed-products.jsx';
import ProductDetailPage from './pages/product-detail-new.jsx';
import CartPage from './pages/cart.jsx';
import NotFound from './pages/NotFound.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "user",
        element: <ProtectedRoute><UserPage /></ProtectedRoute>
      },
      {
        path: "categories",
        element: <CategoriesPage />
      },
      {
        path: "category/:categoryId",
        element: <CategoryProductsPage />
      },
      {
        path: "products",
        element: <ProductsPage />
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />
      },
      {
        path: "favorites",
        element: <ProtectedRoute><FavoritesPage /></ProtectedRoute>
      },
      {
        path: "viewed-products",
        element: <ProtectedRoute><ViewedProductsPage /></ProtectedRoute>
      },
      {
        path: "cart",
        element: <ProtectedRoute><CartPage /></ProtectedRoute>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)