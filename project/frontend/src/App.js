import "App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "pages/dashboard";
import { Home } from "pages/homepage";
import { EditFormPage } from "pages/editpages_form";
import { GoalBased } from "pages/goalbased";
import { NewTaxGoal } from "pages/newtaxgoal";
import { useDispatch, useSelector } from "react-redux";
import { LoginWithLocalData } from './store/UserSlice';
import axios from 'axios';
import { Login } from './store/UserSlice';
import { Goal } from "pages/normalGoal";
import { GoalFirst } from "pages/normalGoalFirst"
const baseURL = "http://localhost:8000";
function RequireAuth({ children, redirectTo }) {
  const localUser = JSON.parse(localStorage.getItem('userData'))
  if (!localUser) {
    alert("Please Login")
    return <Navigate to={redirectTo} />
  }
  return localUser.isLogIn ? children : <Navigate to={redirectTo} />;
}
function App() {
  const userStore = useSelector(state => state.userStore)
  const dispatch = useDispatch()
  try {
    if (userStore.userId === null) {
      const localUser = localStorage.getItem('userData')
      if (localUser) {
        axios.post(`${baseURL}/auth/veriylocaluser`, {
          localUser: localUser
        }).then(res => {
          dispatch(LoginWithLocalData(JSON.parse(localUser)))
        }).catch(e => {
          localStorage.removeItem("userData");
          console.log(e)
        })
      }
    }
  } catch (e) {
    console.log(e)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth redirectTo="/">
              {<Dashboard />}
            </RequireAuth>
          }
        />
        <Route
          path="/Goal-Based"
          element={
            <RequireAuth redirectTo="/">
              {<GoalBased />}
            </RequireAuth>
          }
        />
        <Route path="/Goal-Based" element={<GoalBased />} />
        <Route path="/Goal-Based/reduce-tax-goal" element={<NewTaxGoal />} />
        <Route path="/Goal-Based/normal-goal" element={<Goal />} />
        <Route path="/Goal-Based/normal-goal-first" element={<Goal />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
