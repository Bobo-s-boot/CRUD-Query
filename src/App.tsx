import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query"; // Импорт React Query
import "./App.scss";
import AddProduct from "./components/addProduct";
import Alert from "./components/alert";
import ProductsList from "./components/products-list";
import EditProduct from "./components/edit-product";

// Создание экземпляра QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    // Оборачиваем приложение в QueryClientProvider, чтобы предоставить доступ к queryClient
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AddProduct />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/product-list" element={<ProductsList />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
