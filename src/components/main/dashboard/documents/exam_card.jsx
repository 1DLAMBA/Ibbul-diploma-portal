import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  message,
  Button,
  Spin,
  Typography,
  Space,
  Card,
  Row,
  Col,
  Divider,
  Table,
  Tag,
  Avatar,
  Breadcrumb
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  EnvironmentOutlined,
  PrinterOutlined,
  FileTextOutlined,
  HomeFilled
} from '@ant-design/icons';
import axios from 'axios';
import API_ENDPOINTS from '../../../../Endpoints/environment';
import './exam_card.css';
import logo from '../../../../assets/logo2.png';

const { Title, Text } = Typography;

const ExamCard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        const userData = userResponse.data;

        // Fetch user's courses
        const coursesResponse = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/courses/${id}`);
        const coursesData = coursesResponse.data;

        setUser(userData);
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load exam card data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    if (!user?.course_paid) {
      message.error('You need to pay for your courses before printing the exam card');
      navigate(`/dashboard/${id}/course_reg`);
      return;
    }
      window.print();
  };

  const columns = [
    {
      title: 'Course Title',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Course Type',
      dataIndex: 'course_type',
      key: 'course_type',
      render: (text) => (
        <Tag color={text === 'core' ? 'blue' : 'green'}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }
   function itemRender(currentRoute, params, items, paths) {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
    );
  }
  const items = [
    {
      path: `/Dashboard/${id}`,
      title: <HomeFilled />,
    },

    {
      path: `/Dashboard/${id}/course_reg`,
      title: 'Course Registration',

    },

    {
      path: `/Dashboard/${id}/exam_card`,
      title: 'Exam Card',

    },

  ];

  return (
  <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
  
      <Breadcrumb style={{  marginTop: '1%', marginBottom: '1%', marginRight: '1%', backgroundColor: 'white', width: '82.5%', color: 'white', borderRadius: '15px', padding: '0.5%' }} itemRender={itemRender} items={items} />
    <div className="exam-card-container">

      <div className="print-button-container">
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          className="print-button"
          style={{ backgroundColor: '#028f64', borderColor: '#028f64' }}
        >
          Print Exam Card
        </Button>
      </div>

      <div className="exam-card">
        <div className="exam-card-header">
          <img src={logo} alt="School Logo" className="school-logo" />
          <Title level={2} className="school-name">College of Education</Title>
          <Title level={3}>Examination Card</Title>
        </div>

        <Divider />

        <div className="student-info">
          <Row gutter={[24, 24]}>
            <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Avatar
                size={120}
                src={user?.passport ? `${API_ENDPOINTS.API_BASE_URL}/file/get/${user.passport}` : undefined}
                icon={!user?.passport && <UserOutlined style={{ fontSize: '60px' }} />}
                className="profile-pic"
                style={{ backgroundColor: '#028f64' }}
              />
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Text strong><UserOutlined /> Full Name:</Text>
                <Text>{user?.surname} {user?.other_names}</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Text strong><FileTextOutlined /> Matric Number:</Text>
                <Text>{user?.matric_number}</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Text strong><BookOutlined /> Course:</Text>
                <Text>{user?.course}</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Text strong><EnvironmentOutlined /> Study Center:</Text>
                <Text>{user?.desired_study_cent}</Text>
              </Space>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="courses-section">
          <Title level={4}>Registered Courses</Title>
          <Table
            columns={columns}
            dataSource={courses}
            rowKey="id"
            pagination={false}
            bordered
            size="small"
          />
        </div>

        <div className="exam-card-footer">
          <div className="signature-section">
            <div className="signature-box">
              <Text>Student's Signature</Text>
              <div className="signature-line"></div>
            </div>
            <div className="signature-box">
              <Text>Examination Officer's Signature</Text>
              <div className="signature-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ExamCard;
