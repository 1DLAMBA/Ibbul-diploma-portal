import React, { useState } from 'react';
import { Card, Button, Typography, Space, Breadcrumb, Select } from 'antd';
import { BookOutlined, UserOutlined, HomeFilled } from '@ant-design/icons';
import { Routes, useNavigate, Link, useParams } from 'react-router-dom';
import '../style.css';


const { Title, Text } = Typography;

const { Option } = Select;

  const items = [
    {
      path: '/Dashboard',
      title: <HomeFilled style={{color:'green'}} />,
    },
    
  ];
  
  function itemRender(currentRoute, params, items, paths) {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;
  
    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
    );
  }

const Panel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [regButton, setRegButton] = useState(null)
  function routeBio() {
    navigate(`/dashboard/${id}/Bio-data`);
  }
  function routeCourse() {
    navigate(`/dashboard/${id}/Course_reg`);
  }
  return (
    <>
    <Breadcrumb style={{marginLeft:'8.7%', marginTop: '0%', backgroundColor:'white', width:'82.5%', color:'white', borderRadius:'15px', padding:'0.5%'}} itemRender={itemRender} items={items} />
   
    <div className="d-flex m-auto" style={{width:'85%',  justifyContent:'space-around', paddingTop: '', flexWrap:'wrap'}}>


    <Card
      bordered={false}
      className='card'
      style={{
        
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        padding: '16px',
      }}
    >
      <Space direction="vertical" size="small">
        <Space>
          <UserOutlined style={{ fontSize: '24px', color: '#000' }} />
          <Title level={4} style={{ margin: 0, color: '#000' }}>
            MY PERSONAL DATA
          </Title>
        </Space>
        <Text type="secondary">View your biodata details here</Text>
        <Button type="primary" onClick={routeBio} style={{ backgroundColor: '#028f64', borderColor: '#028f64' }}>
          View
        </Button>
      </Space>
    </Card>
    
    <Card
      bordered={false}
      className='card'

      style={{
        
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        padding: '16px',
      }}
    >
      <Space direction="vertical" size="small">
        <Space>
          <BookOutlined style={{ fontSize: '24px', color: '#000' }} />
          <Title level={4} style={{ margin: 0, color: '#000' }}>
            Course Registration
          </Title>
        </Space>
        <Text type="secondary">View and update your registered courses here</Text>
        <Button type="primary" onClick={routeCourse} style={{ backgroundColor: '#028f64', borderColor: '#028f64' }}>
          View
        </Button>
      </Space>
    </Card>

    </div>

 
    </>
  );
};

export default Panel;
