import { RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './pages/auth/login'
import { adminRoutes, managerRoutes, memberRoutes, publicRoutes } from './routes/router'
import { useSelector } from 'react-redux'

function App() {
const role = useSelector(state => state.user.role);

  // 1) Jab tak role null/undefined hai -> loading show karo
  if (role === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  let route = publicRoutes
  if (role === "admin") {
    route = adminRoutes;
  } else if (role === "member") {
    route = memberRoutes;
  } else if (role == "manager") {
    route = managerRoutes;
  }
  
  return (
    <>
      <RouterProvider router={route}></RouterProvider>
    </>
  )
}

export default App
