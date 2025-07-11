import logo from './logo.svg';
import './App.css';
import Application_check from './components/main/Application_check';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './components/main/Main';
import Dashboard from './components/main/Dashboard';
import Bio_data from './components/main/dashboard/Bio_data';
import Course_reg from './components/main/dashboard/Course_reg';
import Edit_Bio from './components/main/dashboard/Edit_Bio';
import Panel from './components/main/dashboard/Panel';
import Admin_Panel from './components/main/dashboard/admin/Admin_Panel';
import View_applications from './components/main/dashboard/admin/admin-pages/View_Applications';
import Add_Applications from './components/main/dashboard/admin/admin-pages/Add_Application';
import Registration from './components/main/Registration';
import Reg_Success from './components/Reg_Success';
import Single_Application from './components/main/dashboard/admin/admin-pages/Single_Appliaction';
import { Admin_dashboard } from './components/main/dashboard/admin/admin-pages/Admin_dashboard';
import { View_approved } from './components/main/dashboard/admin/admin-pages/View_approved';
import Admission_Letter from './components/main/dashboard/documents/Admission_Letter';
import Acceptance_Receipt from './components/main/dashboard/documents/Acceptance_Receipt';
import Fees_Receipt from './components/main/dashboard/documents/Fees_Receipt';
import { Student_Stats } from './components/main/dashboard/admin/admin-pages/Student_Stats';
import Exam_Card from './components/main/dashboard/documents/exam_card';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    if (window.location.hostname === 'admin.coestudycenter.com.ng') {
      window.location.href = 'https://coestudycenter.com.ng/admin/student-stats';
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Main />} />
        <Route path="/admin" element={<Admin_Panel />} >
          <Route path='/admin' element={<Admin_dashboard />} />
          <Route path='/admin/view-applications' element={<View_applications />} />
          <Route path='/admin/student-stats' element={<Student_Stats />} />
          <Route path='/admin/view-approved' element={<View_approved />} />
          <Route path='/admin/view-approved/single/:id' element={<View_approved />} />
          <Route path='/admin/add-applications' element={<Add_Applications />} />
          <Route path='/admin/single-application/:id' element={<Single_Application />} />

        </Route>
        <Route path="/registration" element={<Registration />} />
        <Route path='/registration/:id/success' element={<Reg_Success />} />



        <Route path='/dashboard/:id' element={<Dashboard />}>
          <Route path='/dashboard/:id' element={<Panel />} />
          <Route path='/dashboard/:id/Bio-data' element={<Bio_data />} />
          <Route path='/dashboard/:id/Edit' element={<Edit_Bio />} />
          <Route path='/dashboard/:id/Course_reg' element={<Course_reg />} />
          <Route path='/dashboard/:id/admission-letter' element={<Admission_Letter />} />
          <Route path='/dashboard/:id/exam-card' element={<Exam_Card />} />
          <Route path='/dashboard/:id/acceptance-receipt' element={<Acceptance_Receipt />} />
          <Route path='/dashboard/:id/fees-receipt' element={<Fees_Receipt />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;



