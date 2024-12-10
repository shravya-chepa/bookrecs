import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyShelf from './pages/MyShelf';
import BrowseByGenre from './pages/BrowseByGenre';
import SearchResults from './pages/SearchResults';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <Router>
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/my-shelf"
            element={
              <PrivateRoute>
                <MyShelf />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/browse-by-genre"
            element={
              <PrivateRoute>
                <BrowseByGenre />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchResults />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  </Router>
);

export default App;
