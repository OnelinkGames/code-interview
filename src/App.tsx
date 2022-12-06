import React, { useRef, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import axios, { AxiosError } from 'axios';
import Loading from './pages/loading/Loading'
import ProtectedRoutes from './shared/components/ProtectedRoute';
import Signin from './pages/login/Signin';
import Signup from './pages/login/Signup';
const ContentLayout = React.lazy(() => import("./pages/contents/Layout"))
const SubTopicLayout = React.lazy(() => import("./pages/subtopics/Layout"))
const Header = React.lazy(() => import("./pages/header/Header"))
const Home = React.lazy(() => import("./pages/home/Home"))
const Error = React.lazy(() => import("./pages/error/Error"))

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
      <React.Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Header />} >
              <Route index element={<Home />} />
              <Route path="contents" element={<ContentLayout />} />
              <Route path="subtopics" element={<SubTopicLayout />} />
            </Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  )
}

export default App
