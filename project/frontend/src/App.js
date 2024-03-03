import "App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "pages/dashboard";
import { Home } from "pages/homepage";
import { EditFormPage } from "pages/editpages_form";
import { GoalBased } from "pages/goalbased";
import { NewTaxGoal } from "pages/newtaxgoal";
import { useDispatch } from "react-redux";
import { Login } from './store/UserSlice';
import { SelectFund } from "pages/selectFund";
function App() {
  const dispatch = useDispatch()
  try {
    const localUser = localStorage.getItem('userData')
    if (localUser) {
      dispatch(Login(JSON.parse(localUser)))
    }
  } catch (e) {
    console.log(e)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/edit-form" element={<EditFormPage />} />
        <Route path="/Goal-Based" element={<GoalBased />} />
        <Route path="/Goal-Based/reduce-tax-goal" element={<NewTaxGoal />} />
        <Route path="/Goal-Based/reduce-tax-goal/select-fund" element={<SelectFund />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
