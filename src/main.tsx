import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ProtectedRoute from "@/components/protected-route";
import Map from "@/pages/map";
import Regions from "@/pages/regions";
import AddRoadSegment from "@/pages/add-road-segment";
import EditRoadSegment from "@/pages/edit-road-segment";
import RoadSegments from "@/pages/road-segments";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="map" element={<Map />} />
                <Route path="road-segments">
                  <Route index element={<RoadSegments />} />
                  <Route path="add" element={<AddRoadSegment />} />
                  <Route path=":segmentId/edit" element={<EditRoadSegment />} />
                </Route>
                <Route path="regions" element={<Regions />} />
                <Route path="road-materials" element={<Regions />} />
                <Route path="road-types" element={<Regions />} />
                <Route path="road-conditions" element={<Regions />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>

        <Toaster position="top-right" theme="light" />

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
