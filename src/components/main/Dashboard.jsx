import React, { useEffect, useState, createContext, useContext } from 'react';
import './Dashboard.css';
import coverPhoto from '../../assets/backgrround.jpg';
import {
  BarsOutlined, PhoneOutlined, MailOutlined, BookTwoTone, UserOutlined, BookFilled,
  BookOutlined,
  FileTextOutlined,
  LogoutOutlined,
  HeatMapOutlined,
  EnvironmentFilled,
  MenuOutlined,
  PhoneFilled,
  MailFilled,
  EditOutlined,
  EditFilled
} from '@ant-design/icons';
import logo from '../../assets/logo.png';
import profilePic from '../../assets/pro-pic.png';
import { PaystackButton } from "react-paystack";
import { Routes, useNavigate } from 'react-router-dom';
import { Outlet, useParams } from 'react-router-dom';
import { Button, Upload, message, Popover, Skeleton, Space, ConfigProvider, Avatar, Flex, Tag, Tooltip } from 'antd';
import axios from 'axios';
import BioData from './dashboard/Bio_data';
import API_ENDPOINTS from '../../Endpoints/environment';



const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState('' || null);
  const [application, setApplication] = useState('');
  const userId = localStorage.getItem('id')
  const [uploadedOl1, setUploadedAL1] = useState('')
  const [loader, setLoader] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [passport, setPassport] = useState('')
  const [imageUrl, setImageUrl] = useState(null);
  
  
  


  function routeBio() {
    navigate(`/Dashboard/${id}/Bio-data`);
  }
  function routeCourse() {
    navigate(`/Dashboard/${id}/Course_reg`);
  }
  function routeLogOUt() {
    navigate('/');
  }

  function routeAdmissionLetter() {
    navigate(`/Dashboard/${id}/admission-letter`)
  }

  function routeAcceptanceFee() {
    navigate(`/dashboard/${id}/acceptance-receipt`);
  }
  function routeSchoolFees() {
    navigate(`/dashboard/${id}/fees-receipt`);
  }
  function routeExamCard() {
    navigate(`/dashboard/${id}/exam-card`);
  }


  // console.log('check')
  const fetchUser = async () => {
    // console.log('check')
    try {
      const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
      const responseBio = await axios.get(`${API_ENDPOINTS.BIO_REGISTRATION}/${id}`);
      setApplication(response.data); // Assuming the API returns user data in `response.data`
      // const responseBio = await axios.get(`http://127.0.0.1:8000/api/bio-data/${id}`);
      // if(responseBio){
      //   setUser(responseBio.data.data[0])

      //   console.log(responseBio.data.data);
      // }
      setUser(responseBio.data)
      if (!response.data.matric_number) {
        navigate('/');

      }


      console.log('Data', response.data.data);
      setLoader(false);

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {

    fetchUser(); // Call the async function to fetch data

  }, []); // Only re-run if `userId` changes


  // PASPORT UPLOAD
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleUploadChange = (info, setUploadedState, type) => {
    const { status } = info.file;
    if (status === 'uploading') {
      setUploading(true);
      message.loading('Uploading passport photo...', 0);
    } else if (status === 'done') {
      setUploading(false);
      message.destroy(); // Clear the loading message
      message.success(`${info.file.name} file uploaded successfully.`);
      const reader = new FileReader();

      const fileName = info.file.response.data;
      if (type === 'passport') {
        setPassport(fileName)
        console.log(info)
        setImageUrl(`${API_ENDPOINTS.IMAGE}/${info.file.response.data}`);
        const updatePassport = async () => {
          try {
            const response = await axios.put(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`, {
              passport: fileName
            });
            console.log('Passport updated successfully:', response.data);
          } catch (error) {
            console.error('Error updating passport:', error);
          }
        }
        updatePassport();
      }
      setLoader(true);
      fetchUser(); 
    } else if (status === 'error') {
      setUploading(false);
      message.destroy(); // Clear the loading message
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const props = (setUploadedState, type) => ({
    name: 'file',
    multiple: false,
    action: `${API_ENDPOINTS.UPLOAD}`,
    onChange(info) {
      console.log('asa')
      handleUploadChange(info, setUploadedState, type);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  });



  // routeBio
  const content = (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'green',
          borderRadius: 2,
          // Removing textAlign from token as we'll handle it in the style
          colorBgContainer: '#f6ffed',
        },
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          type="text"
          onClick={routeBio}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <UserOutlined style={{ marginRight: '8px' }} /> Bio Data
        </Button>

        <Button
          block
          type="text"
          onClick={routeCourse}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <BookOutlined style={{ marginRight: '8px' }} /> Course Reg
        </Button>
        <div style={{ borderTop: '1px solid #e8e8e8', margin: '4px 0' }} />

        <Button
          block
          type="text"
          onClick={routeAdmissionLetter}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <FileTextOutlined style={{ marginRight: '8px' }} /> Admission Letter
        </Button>
        <Button
          block
          type="text"
          disabled={user?.level !== "100"}
          onClick={routeAcceptanceFee}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <FileTextOutlined style={{ marginRight: '8px' }} /> Acceptance Fee receipt
        </Button>
        <Button
          block
          type="text"
          disabled={application?.has_paid == 0}
          onClick={routeSchoolFees}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <FileTextOutlined style={{ marginRight: '8px' }} /> School Fees receipt
        </Button>
        <Button
          block
          type="text"
          disabled={!application?.course_paid}
          onClick={routeExamCard}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <FileTextOutlined style={{ marginRight: '8px' }} /> Exam Card
        </Button>

        <div style={{ borderTop: '1px solid #e8e8e8', margin: '4px 0' }} />

        <Button
          block
          danger
          type="text"
          onClick={routeLogOUt}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <LogoutOutlined style={{ marginRight: '8px' }} /> Log Out
        </Button>
      </Space>
    </ConfigProvider>
  );
  // const
  return (
    <>

      <div className="dashboard-container">
        <div className="head">

          <img src={logo} alt="User" style={{ marginLeft: '10%' }} />

          <ConfigProvider
            theme={{
              token: {
                // Modern color scheme
                colorPrimary: '#028f64',
                colorBgContainer: '#ffffff',

                // Refined radius and spacing
                borderRadius: 8,
                margin: 16,

                // Adding box shadow for depth
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <Popover
              content={content}
              trigger="click"
              placement="bottomRight"
              overlayStyle={{
                width: '220px',
                borderRadius: '12px',
              }}
            >
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<MenuOutlined />}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '48px',
                  height: '48px',
                  boxShadow: '0 4px 12px rgba(163, 197, 84, 0.41)',
                  transition: 'all 0.3s ease',
                  marginRight: '10%'
                }}
                className="hover:shadow-lg"
              />
            </Popover>
          </ConfigProvider>

        </div>

        {/* Cover Photo */}


        {/* User Information Card */}
      </div>
      <div className='content'>
        <div className="user-card">
          <Flex>

            <Avatar
              size={140}
              src={application?.passport ? `${API_ENDPOINTS.API_BASE_URL}/file/get/${application.passport}` : undefined}
              icon={!application?.passport && <UserOutlined style={{ fontSize: '70px' }} />}
              className="profile-pic"
              style={{ backgroundColor: '#d6e5da' }}
            />
            <Upload
              name="passport"
              listType="picture"
              showUploadList={false}
              beforeUpload={beforeUpload}
              {...props(setUploadedAL1, 'passport')}
              accept="image/*"
            >


              <Tooltip title="Change Passport">
                <Button type="primary" shape="circle"
                  style={{ backgroundColor: '#d6e5da', border: '1px solid green' }}
                  icon={<EditFilled style={{ color: 'green' }} />} />
              </Tooltip>
            </Upload>
          </Flex>

          {loader ? (<>

            <div style={{ display: 'flex', width: '30%', justifyContent: 'space-between', margin: '2%' }}>

              <Skeleton.Node
                active='true'
                style={{
                  width: 170,
                  height: 20
                }}
              />

              <Skeleton.Node
                active='true'
                style={{
                  width: 170,
                  height: 20
                }}
              />
            </div>
            <div style={{ display: 'flex', width: '30%', justifyContent: 'space-between', margin: '2%' }}>

              <Skeleton.Node
                active='true'
                style={{
                  width: 170,
                  height: 20
                }}
              />

              <Skeleton.Node
                active='true'
                style={{
                  width: 170,
                  height: 20
                }}
              />
            </div>
          </>) : (<>
            {application?.surname ? (<>
              <div className='info-hold'>
                <div style={{ marginRight: '20px' }}>
                  <h2 className="user-name">{application?.surname} {application?.other_names} </h2>

                  <p className="user-info"><span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#d9f7be', // light green
                    border: '1px solid #389e0d', // dark green outline
                    marginRight: '8px'
                  }}>
                    <BookFilled style={{
                      color: '#389e0d', // dark green icon
                      fontSize: '14px'
                    }} />
                  </span>{application?.matric_number}</p>

                </div>
                <div>

                  <p className="user-info"><span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#d9f7be', // light green
                    border: '1px solid #389e0d', // dark green outline
                    marginRight: '8px'
                  }}>
                    <PhoneFilled style={{
                      color: '#028f64', // dark green icon
                      fontSize: '14px'
                    }} />
                  </span> {application.phone_number}</p>

                  <p className="user-info"><span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#d9f7be', // light green
                    border: '1px solid #028f64', // dark green outline
                    marginRight: '8px'
                  }}>
                    <MailFilled style={{
                      color: '#028f64', // dark green icon
                      fontSize: '14px'
                    }} />
                  </span> {application.email}</p>
                </div>

                <div style={{}}>
                  <p className="user-info"><span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#d9f7be', // light green
                    border: '1px solid #028f64', // dark green outline
                    marginRight: '8px'
                  }}>
                    <BookOutlined style={{
                      color: '#028f64', // dark green icon
                      fontSize: '14px'
                    }} />
                  </span>{application?.course}</p>

                  <Tag className="user-info" style={{ padding: '2%', color: '#028f64' }}><EnvironmentFilled /> {application.desired_study_cent} study center</Tag>
                </div>
              </div></>) : (<>
                <div >
                  <h3>Your application number is {application.application_number}</h3>
                  <br></br>
                  <p style={{ padding: '2%', border: '1px solid red', fontWeight: 'bolder', borderRadius: '5px' }}>Please Update Personal Data</p>

                </div>
              </>)}

          </>)}




        </div>
        <div className="outlet">

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
