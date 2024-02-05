import * as React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import Post from './pages/Post/Post';

function App() {
  return (
    <BrowserRouter basename="/my-blog">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/post/:postId" element={<Post />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;