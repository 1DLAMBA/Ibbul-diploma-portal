import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, ConfigProvider, Button, Select, Row, Col } from "antd";
import axios from "axios";
import '../admin-pages/styles/application.css';
import { EyeFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../../../../Endpoints/environment";

const { Option } = Select;

const ViewApplications = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const navigate = useNavigate();

  const centers = [
    "suleja", "Rijau", "Gulu", "New Bussa", "Mokwa", 
    "Kagara", "Salka", "Kontogora", "Gawu", "Doko", 
    "Katcha"
  ];

  const ViewApplication = (id) => {
    navigate(`/admin/single-application/${id}`);
  };

  // Define columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Application Number", dataIndex: "application_number", key: "application_number" },
    { title: "Full Name", dataIndex: ["other_names"], key: "full_name" },
    { title: "Phone Number", dataIndex: ["phone_number"], key: "phone_number" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Local Government", dataIndex: "local_government", key: "local_government" },
    {
      title: "View",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#028f64',
              borderRadius: 2,
              colorText: 'white',
              colorBgContainer: '#f6ffed',
            },
          }}
        >
          <Button
            htmlType="submit"
            block
            onClick={() => { ViewApplication(id); }}
            style={{
              backgroundColor: "#028f64",
              borderColor: "#028f64",
              padding: "10px 40px",
              color: 'white',
              width: 'max-content',
            }}
          >
            <EyeFilled /> View
          </Button>
        </ConfigProvider>
      ),
    },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/personal-details`); // Replace with your API endpoint
        const filteredData = response.data.filter((student) => !student.matric_number && !student.has_admission);
        setData(filteredData);
        setFilteredData(filteredData); // Initial data for the table
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle dropdown selection
  const handleFilterChange = (value) => {
    setSelectedCenter(value);
    if (value) {
      const filtered = data.filter((student) => student.desired_study_cent === value);
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset to full data if no center is selected
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '2% auto', padding: '0 20px' }}>
      
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#028f64',
            borderRadius: 2,
            colorBgContainer: '#f6ffed',
          },
        }}
      >
      <Spin spinning={loading}>
        <div className="table-head">
          <h2>
            New Applicants List
          </h2>
          <p>
            This list contains data of students that have applied to the college
          </p>
        </div>
        <Row justify="space-around" align="middle" style={{ margin: "1%" }}>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Select
              placeholder="Select Study Center"
              onChange={handleFilterChange}
              value={selectedCenter}
              style={{ width: '100%', maxWidth: '300px', margin: 'auto' }}
              allowClear
            >
              {centers.map((center) => (
                <Option key={center} value={center}>
                  {center}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 'max-content' }}
          />
        </div>
        
      </Spin>
      </ConfigProvider>
    </div>
  );
};

export default ViewApplications;
