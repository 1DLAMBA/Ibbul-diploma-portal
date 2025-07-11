import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowDownOutlined, ArrowUpOutlined, EyeFilled, UserOutlined } from '@ant-design/icons';
import { Card, Col, Tag, ConfigProvider, Statistic, Button, Table, Input, Select, Spin, Row } from 'antd';
import axios from "axios";
import '../admin-pages/styles/application.css';
import API_ENDPOINTS from "../../../../../Endpoints/environment";


const { Search } = Input;
const { Option } = Select;

export const View_approved = () => {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noAdmissionCount, setNoAdmissionCount] = useState(0);
  const [matricNumberCount, setMatricNumberCount] = useState(0);
  const [approvedStudents, setApprovedStudents] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [studyCent, setStudyCent] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/personal-details`);
      console.log(response)
      const filteredData = response.data.filter((student) => !student.matric_number);
      setData(filteredData);
      setNoAdmissionCount(response.data.filter((student) => !student.has_admission).length);
      setMatricNumberCount(response.data.filter((student) => student.matric_number).length);
      setApprovedStudents(response.data.filter((student) => student.has_admission && !student.matric_number).length);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);







  useEffect(() => {
    fetchStudents(pagination.current, search, studyCent);
  }, [pagination.current, search, studyCent]);
  const fetchStudents = async (page, searchValue, studyCentValue) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/personal-details-paged`, {
        params: {
          page,
          search: searchValue,
          study_cent: studyCentValue,
          type: "admitted",
        },
      });
      const admittedStudents = response.data.data.filter((students) => !students.matric_number && students.has_admission);
      setStudents(admittedStudents); // Laravel paginates in `data`
      setPagination({
        ...pagination,
        total: response.data.total, // Total count for pagination
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({ ...pagination });
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleFilterChange = (value) => {
    setStudyCent(value);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "other_names",
      key: "other_names",
    },

    {
      title: "Application/ Matric Number",
      dataIndex: "application_number",
      key: "application_number",
    },
    {
      title: "Study Center",
      dataIndex: "desired_study_cent",
      key: "desired_study_cent",
    }, {
      title: "Has Accepted",
      dataIndex: "matric_number",
      key: "matric_number",
      render: (matric_number) => (
        <span>
          {matric_number ? (
            <Tag color="green">Yes</Tag>
          ) : (
            <Tag color="red">No</Tag>
          )}
        </span>
      ),
    },
   {
    title: "Programme Type",
    dataIndex: "bio_registration.mode_of_entry",
    key: "programme_type",
    render: (_, record) => {
      const modeOfEntry = record.bio_registration?.mode_of_entry;
      return (
        <span>
          {modeOfEntry === 'pre_nce' ? (
            <Tag color="green">Pre NCE</Tag>
          ) : (
            <Tag color="cyan">{modeOfEntry || 'Direct NCE'}</Tag>
          )}
        </span>
      );
    }},
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
            onClick={() => { navigate(`/registration/${id}/success`); }}
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

  return (
    <div>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '2% auto', padding: '0 20px' }}>
        <div className="table-head">
          <h2>
            Approved Students List
          </h2>
          <p>
            This list contains data of students that have admission in the college
          </p>
        </div>
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Search
              placeholder="Search by Matric/Application Number"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <Select
              placeholder="Filter by Study Center"
              allowClear
              onChange={handleFilterChange}
              style={{ width: '100%' }}
            >
              <Option value="Salka">Salka</Option>
              <Option value="Mokwa">Mokwa</Option>
              <Option value="suleja">Suleja</Option>
              <Option value="Kagara">Kagara</Option>
              <Option value="New Bussa">New Bussa</Option>
              <Option value="Gulu">Gulu</Option>
              <Option value="Gawu">Gawu</Option>
              <Option value="Doko">Doko</Option>
              <Option value="Katcha">Katcha</Option>
            </Select>
          </Col>
        </Row>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#028f64',
              borderRadius: 2,
              colorBgContainer: '#f6ffed',
            },
          }}
        >
          <Spin spinning={loading} size="large" style={{ backgroundColor: 'white !important' }}>
            <div style={{ overflowX: 'auto' }}>
              <Table
                columns={columns}
                dataSource={students}
                rowKey={(record) => record.id}
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                scroll={{ x: 'max-content' }}
              />
            </div>
          </Spin>
        </ConfigProvider>
      </div>
    </div>
  );
};