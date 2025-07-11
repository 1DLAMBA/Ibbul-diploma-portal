import React, { useEffect, useState, createContext, useContext } from 'react';

import coverPhoto from '../../../../assets/backgrround.jpg';
import { BarsOutlined, PhoneOutlined, MailOutlined, UserOutlined, BookFilled, DashboardOutlined, TeamOutlined, CheckCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import logo from '../../../../assets/logo2.png';
import profilePic from '../../../../assets/pro-pic.png';
import { PaystackButton } from "react-paystack";
import { Routes, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Button, Popover, Space, ConfigProvider, Avatar, Flex } from 'antd';
import axios from 'axios';
import BioData from './../../dashboard/Bio_data';

import './../../Dashboard.css';
import API_ENDPOINTS from '../../../../Endpoints/environment';


const Admin_Panel = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('' || null);
    const [application, setApplication] = useState('');
    const userId=localStorage.getItem('id')
  
    function routeViewApplications() {
      navigate('/admin/view-applications');
    }
    function routeStudentStats() {
      navigate('/admin/student-stats');
    }
    function routeViewApproved() {
      navigate('/admin/view-approved');
    }
    function routeViewSingleApproved() {
      navigate('/admin/view-approved/single/:id');
    }
    function routeLogOut() {
      navigate('/');
    }
  
    useEffect(() => {
      // console.log('check')
      const fetchUser = async () => {
        // console.log('check')
        try {
          const response = await axios.get(`${API_ENDPOINTS}/applications/${userId}`);
          setApplication(response.data); // Assuming the API returns user data in `response.data`
          const responseBio = await axios.get(`${API_ENDPOINTS}/bio-data/${userId}`);
          if(responseBio){
            setUser(responseBio.data.data[0])
  
            console.log(responseBio.data.data);
          }
  
  
          console.log('Data',response.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      if (userId) {
        fetchUser(); // Call the async function to fetch data
      }
    }, [userId]); // Only re-run if `userId` changes
  
  
  
    // routeViewApplications
    const content = (
      <div style={{ minWidth: '200px' }}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 4,
            },
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              icon={<FileTextOutlined />} 
              block 
              onClick={routeViewApplications}
              style={{ textAlign: 'left', height: '40px' }}
            >
              View Applications
            </Button>
            <Button 
              icon={<TeamOutlined />} 
              block 
              onClick={routeStudentStats}
              style={{ textAlign: 'left', height: '40px' }}
            >
              Student Statistics
            </Button>
            <Button 
              icon={<CheckCircleOutlined />} 
              block 
              onClick={routeViewApproved}
              style={{ textAlign: 'left', height: '40px' }}
            >
              View Approved
            </Button>
            {/* <Button 
              icon={<DashboardOutlined />} 
              block 
              onClick={routeViewSingleApproved}
              style={{ textAlign: 'left', height: '40px' }}
            >
              Single Approved View
            </Button> */}
            <Button 
              icon={<UserOutlined />} 
              block 
              onClick={routeLogOut}
              style={{ textAlign: 'left', height: '40px' }}
            >
              Log Out
            </Button>
          </Space>
        </ConfigProvider>
      </div>
    );
    // const
    return (
      <>
  
        <div className="dashboard-container">
          <div className="head" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            backgroundColor: '#5f885f',
            height: '70px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={logo} style={{ height: '50px', width: 'auto' }} alt="Logo" />
              <h2 className='school-name' style={{ 
                color: '#fff', 
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>COLLEGE OF EDUCATION</h2>
            </div>

            <Popover 
              content={content} 
              trigger="click"
              placement="bottomRight"
            >
              <BarsOutlined style={{ 
                fontSize: '1.5rem', 
                color: '#fff', 
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'background-color 0.3s'
              }} />
            </Popover>
          </div>
  
          {/* Cover Photo */}
  
  
          {/* User Information Card */}
        </div>
        <div className='content'>
          <div className="user-card">
            {/* <Avatar
              size={140}
              src={user?.photoId}
              icon={<UserOutlined />}
              className="profile-pic"
            /> */}
            <h1 style={{ fontFamily: "'Ubuntu', serif" }} >ADMIN PANEL</h1>
           
            
  
  
          </div>
          <div className="outlet">
  
            <Outlet />
          </div>
        </div>
      </>
    );
  };

export default Admin_Panel;