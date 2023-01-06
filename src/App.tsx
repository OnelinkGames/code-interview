import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import axios from 'axios';
import ProtectedRoutes from './shared/components/protected-route';
import Signin from './pages/login/signin';
import Signup from './pages/login/signup';
const Topics = React.lazy(() => import('./pages/topics/topic'))
const SubTopicLayout = React.lazy(() => import("./pages/subtopics/subtopic"))
const ContentLayout = React.lazy(() => import("./pages/contents/content"))
const Header = React.lazy(() => import("./pages/header/header"))
const Home = React.lazy(() => import("./pages/home/home"))
const Error = React.lazy(() => import("./pages/error/error"))

function App() {

  axios.interceptors.request.use((request) => {
    let loading: HTMLElement = document.getElementById("loading")!;
    loading.style.display = "block";

    return request;
  }, (err) => {
    let loading: HTMLElement = document.getElementById("loading")!;
    loading.style.display = "none";

    return Promise.reject(err);
  });

  axios.interceptors.response.use((response) => {
    let loading: HTMLElement = document.getElementById("loading")!;
    loading.style.display = "none";

    return response;
  }, (err) => {
    let loading: HTMLElement = document.getElementById("loading")!;
    loading.style.display = "none";

    return Promise.reject(err);
  });

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Header />} >
              <Route index element={<Home />} />
              <Route path="topics" element={<Topics />} />
              <Route path="subtopics" element={<SubTopicLayout />} />
              <Route path="contents" element={<ContentLayout />} />
            </Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  )
}

export default App
