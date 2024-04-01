import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from "./util/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";
import NoFound from "./pages/NotFound";

function App() {
    return (
        <div className="App">

            <Router>
                <NavBar/>
                <Routes>
                    {/*<Route index exact element={<Home/>}/>*/}
                    {/*todo: 区别？*/}
                    <Route path='/' exact element={<Home/>}/>
                    <Route path='/about' element={<About/>}/>
                    <Route path='/product' element={<Product/>}/>
                    <Route path='*' element={<NoFound/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
