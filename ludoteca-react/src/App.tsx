import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Game } from "./pages/game/Game";
import { Author } from "./pages/author/Author";
import { Category } from "./pages/category/Category";
import { Customer } from "./pages/customer/Customer";
import { Borrow } from "./pages/borrow/Borrow";
import { Layout } from "./components/Layout";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { LoaderProvider } from "./context/LoaderProvider";

function App() {
  return (
     <LoaderProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index path="games" element={<Game />} />
              <Route path="categories" element={<Category />} />
              <Route path="authors" element={<Author />} />
              <Route path="customers" element={<Customer />} />
              <Route path="borrows" element={<Borrow />} /> 
              <Route path="*" element={<Navigate to="/games" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </LoaderProvider>
  )
}

export default App;
