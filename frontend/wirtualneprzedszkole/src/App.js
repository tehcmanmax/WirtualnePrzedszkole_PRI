import Users from './pages/User/Users';
import Home from './pages/Home/Home';
import AddUser from './pages/CreateUser/AddUser';
import Login from './pages/Login/Login'
import User from './pages/User/User'
import UserNavi from './pages/User/UserNavi'

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";



function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path='/'>
        <Route index element={<Login/>}></Route>
        </Route>
        <Route path="users">
          <Route index element={<Users/>}></Route>
        </Route>
        <Route path='add-user'>
          <Route index element={<AddUser/>}></Route>
        </Route>
        <Route path='/home'>
          <Route index element={<Home/>}></Route>
        </Route>
        <Route path='/user/:id'>
          <Route index element={<UserNavi/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
