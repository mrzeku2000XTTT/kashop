/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AddProduct from './pages/AddProduct';
import Home from './pages/Home';
import KCbridge from './pages/KCbridge';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Shop from './pages/Shop';
import StoreManagement from './pages/StoreManagement';
import StoreProducts from './pages/StoreProducts';
import Features from './pages/Features';
import About from './pages/About';
import Docs from './pages/Docs';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AddProduct": AddProduct,
    "Home": Home,
    "KCbridge": KCbridge,
    "Orders": Orders,
    "ProductDetail": ProductDetail,
    "Products": Products,
    "Settings": Settings,
    "Shop": Shop,
    "StoreManagement": StoreManagement,
    "StoreProducts": StoreProducts,
    "Features": Features,
    "About": About,
    "Docs": Docs,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};