import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  message,
  Button, Input, Spin, Table, Typography, ConfigProvider, Popover, Dropdown, Space, Breadcrumb, Select, Form,
  Flex, Divider, Row, Col

} from 'antd';
import './BioData.css';
import { FieldTimeOutlined, BookFilled, NumberOutlined, BookOutlined, AppstoreAddOutlined, TagOutlined, DeleteOutlined, TrophyOutlined, CalendarOutlined, ReadOutlined, HomeFilled, SaveOutlined, FolderAddFilled, DollarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { PaystackButton } from "react-paystack";
import { studyCenters } from "./data";
import { Card } from 'antd';
import axios from 'axios';
import API_ENDPOINTS from '../../../Endpoints/environment';

const { Title, Text } = Typography;
const { Option } = Select;

const Course_reg = () => {
  const [courses, setCourses] = useState([""]); // Start with one empty course field
  const [courseInfo, setCourseInfo] = useState(''); // Start with one empty course field
  const [userCourses, setUserCourses] = useState([]); // Start with one empty course field
  const [disabled, setDisabled] = useState(true); // Start with one empty course field
  const [user2ndCourses, setUser2ndCourses] = useState([""]); // Start with one empty course field
  const [user1stCourses, setUser1stCourses] = useState([""]); // Start with one empty course field
  const [loading, setLoading] = useState(false);
  const [couseLoading, setCourseLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [view, setView] = useState(true);
  const [user, setUser] = useState('');
  const [form] = Form.useForm();
  const [modeOfCourse, setModeOfCourse] = useState("");
  const [subjectOfStudy, setSubjectOfStudy] = useState("");
  const [session, setSession] = useState("");
  const [levelOfCourse, setLevelOfCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [courseSemesterData, setCourseSemesterData] = useState([
    { course: "", semester: "", course_type: "" }
  ]);
  const [spinning, setSpinning] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const publicKey = "pk_live_a0e748b1c573eab4ee5c659fe004596ecd25a232";
  // const publicKey = "pk_test_3fbb14acfe497c070f67293c2f7f6bcb1b9228a9";
  const [applicationNumber, setApplicationNumber] = useState('');
  const amount = 4000000;
  const amount60 = 2400000;
  const amount40 = 1600000;
  const [availableCourses, setAvailableCourses] = useState([]);
  const userId = localStorage.getItem('id')
  const { id } = useParams();
  const [centerAccount, setCenterAccount] = useState('');

  const itemLink = [
    {
      key: '1',
      label: '1st item',
    },
    {
      key: '2',
      label: '2nd item',
    },
    {
      key: '3',
      label: '3rd item',
    },
  ];

  const items = [
    {
      path: `/Dashboard/${id}`,
      title: <HomeFilled />,
    },

    {
      path: '/course_reg',
      title: 'Course Registration',

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
  const componentProps = {
    email,
    amount,
    metadata: {
      id: id,
      pay_type: "complete_school_fees",
      // regNumber
    },
    publicKey,
    split: {
      type: "flat",
      subaccounts: [
        //Bantigi Oasis
        { subaccount: "ACCT_1hli5sgrrcfuas9", share: 68500 },
        // COE ACCOUNT
        { subaccount: "ACCT_aan2ehxiej239du", share: 2082500 },
        //CENTER ACCOUNT 
        { subaccount: centerAccount, share: 1730000 },
      ]
    },
    text: "Pay Complete Fees Now",
    onSuccess: async (reference) => {
      const paidOn = new Date();
      const formData = {
        couse_fee_date: reference.reference,

        course_fee_reference: paidOn.toISOString().split('T')[0],
        course_paid: true,
        has_paid: true

      };
      localStorage.setItem('UserData', formData)
      localStorage.setItem('app_number', applicationNumber)
      try {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        console.log(response);
        window.location.href = await `/dashboard/${id}/fees-receipt`;
      } catch (error) {
        console.error("Error updating personal details:", error);
        message.error("Failed to update personal details");
      } finally {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        console.log(response);
        if (response.data) {
          message.loading("redirecting to fees receipt");
          window.location.href = await `/dashboard/${id}/fees-receipt`;


        }
        setLoading(false);
      }

    },
    onClose: () => alert("Wait! Don't leave :("),
  };

  const component60Props = {
    email,
    amount: 2400000,
    metadata: {
      id: id,
      pay_type: "partial_school_fees",
      // regNumber
    },
    publicKey,
    split: {
      type: "flat",
      subaccounts: [
        // Daniel ALAMBA
        { subaccount: "ACCT_1hli5sgrrcfuas9", share: 61500 },
        // COE ACCOUNT
        { subaccount: "ACCT_aan2ehxiej239du", share: 1201000 },
        //CENTER ACCOUNT 
        { subaccount: centerAccount, share: 1026000 },
      ]
    },
    text: "Pay 60% Now",
    onSuccess: async (reference) => {
      const paidOn = new Date();
      const formData = {
        couse_fee_date: reference.reference,

        course_fee_reference: paidOn.toISOString().split('T')[0],
        has_paid: true

      };
      localStorage.setItem('UserData', formData)
      localStorage.setItem('app_number', applicationNumber)
      try {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        console.log(response);
        window.location.href = await `/dashboard/${id}/fees-receipt`;
      } catch (error) {
        console.error("Error updating personal details:", error);
        message.error("Failed to update personal details");
      } finally {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        console.log(response);
        if (response.data) {
          message.loading("redirecting to fees receipt");
          window.location.href = await `/dashboard/${id}/fees-receipt`;


        }
        setLoading(false);
      }

    },
    onClose: () => alert("Wait! Don't leave :("),
  };

  const component40Props = {
    email,
    amount: 1600000,
    metadata: {
      id: id,
      pay_type: "school_fees_completion",
      // regNumber
    },
    publicKey,
    split: {
      type: "flat",
      subaccounts: [
        //DANIEL ALAMBA
        { subaccount: "ACCT_1hli5sgrrcfuas9", share: 40000 },
        // COE ACCOUNT
        { subaccount: "ACCT_aan2ehxiej239du", share: 814000 },
        //CENTER ACCOUNT 
        { subaccount: centerAccount, share: 666000 },
      ]
    },
    text: "Pay Now",
    onSuccess: async (reference) => {
      const paidOn = new Date();
      const formData = {
        couse_fee_date: reference.reference,

        course_fee_reference: paidOn.toISOString().split('T')[0],
        course_paid: true

      };
      localStorage.setItem('UserData', formData)
      localStorage.setItem('app_number', applicationNumber)
      try {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        console.log(response);
        window.location.href = await `/dashboard/${id}/fees-receipt`;
      } catch (error) {
        console.error("Error updating personal details:", error);
        message.error("Failed to update personal details");
      } finally {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        console.log(response);
        if (response.data) {
          message.loading("redirecting to fees receipt");
          window.location.href = await `/dashboard/${id}/fees-receipt`;


        }
        setLoading(false);
      }
    },
    onClose: () => alert("Wait! Don't leave :("),
  };

  const handleAddCourse = () => {
    setLoading(true)
    setCourseSemesterData([...courseSemesterData, { course: "", semester: "", course_type: "" }]);
    fetchUser()
    setLoading(false)
  };

  const handleDelete = (code) => {
    setCourses(courses.filter(course => course.code !== code));
  };



  const content = (
    <div>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: 'green',
            borderRadius: 2,
            textAlign: 'start',
            // Alias Token
            colorBgContainer: '#f6ffed',

          },
        }}
      >
        <PaystackButton style={{ width: '100%', margin: '2%' }} className='btn btn-green' {...componentProps} />
        <br />
        <br />

        <PaystackButton style={{ width: '100%', margin: '2%' }} className='btn btn-green' {...component60Props} />

      </ConfigProvider>
    </div>
  );
  const handleCourseChange = (index, value) => {
    const updatedData = [...courseSemesterData];
    updatedData[index].course = value;
    setCourseSemesterData(updatedData);
  };
  const handleSessionChange = (value) => {
    setSession(value); // ✅ Correct
  };

  const handleSemesterChange = (index, value) => {
    const updatedData = [...courseSemesterData];
    updatedData[index].semester = value;
    setCourseSemesterData(updatedData);
  };

  const handleCourseType = (index, value) => {
    const updatedData = [...courseSemesterData];
    updatedData[index].course_type = value;
    setCourseSemesterData(updatedData);
  };

  const handleSubmit = async (e) => {
    // e?.preventDefault();
    console.log("User Courses ", courses)
    setLoading(true);
    if (!courseSemesterData) {
      message.info('No course Selected')
      return;
    }
    if (userCourses[0]?.mode_of_course) {
      try {
        const promises = courseSemesterData.map((item) => {
          const payload = {

            application_id: user.id, // Replace with the actual application ID
            course: item.course.trim(),
            semester: item.semester.trim(),
            course_type: item.course_type.trim(),
          };

          return axios.post(`${API_ENDPOINTS.API_BASE_URL}/courses`, payload);
        });

        await Promise.all(promises);
        // navigate(`/dashboard/${id}`);

        // alert("Courses added successfully PLEASE LOG OUT AND LOG IN AGAIN!!");
        // fetchUser();
        setCourses([""]); // Reset the form
      } catch (error) {
        console.error("Error adding courses:", error.response?.data || error);
        alert(`Failed to add courses: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
        navigate(`/dashboard/${id}`)
      }

    } else {
      try {
        const promises = courseSemesterData.map((item) => {
          const payload = {
            mode_of_course: modeOfCourse,
            subject_of_study: subjectOfStudy,
            session: session,
            level_of_course: levelOfCourse,
            application_id: user.id, // Replace with the actual application ID
            course: item.course.trim(),
            semester: item.semester.trim(),
            course_type: item.course_type.trim(),
          };

          return axios.post(`${API_ENDPOINTS.API_BASE_URL}/courses`, payload);
        });

        await Promise.all(promises);

        message.success("Courses added successfully!");
        window.location.href = `/dashboard/${id}/`;

      } catch (error) {
        console.error("Error adding courses:", error.response?.data || error);
        alert(`Failed to add courses: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    }

  };

  const fetchUser = async () => {
    // Define the function before using it
    const setCenterAccountBySite = (studyCenter) => {
      switch (studyCenter) {
        case 'New Bussa':
          return 'ACCT_p76xm5gfunxqp89';
        case 'Gulu':
          return 'ACCT_0saux3r5q758ky6';
        case 'suleja':
          return 'ACCT_n3bppexq5wd5n85';
        case 'Gawu':
          return 'ACCT_by8wdwd0a10g68u';
        case 'Mokwa':
          return 'ACCT_bvaybztnxq9r7mk';
        case 'Kagara':
          return 'ACCT_sr3hi6ohw6w5bd3';
        case 'Rijau':
          return 'ACCT_te7rbklmjj58gja';
        case 'Kontogora':
          return 'ACCT_zbec9c9igq0alsz';
        case 'Doko':
          return 'ACCT_pft4xrq2nn8z3kz';
        case 'Katcha':
          return 'ACCT_q7hpb8aop6872xk';
        case 'Salka':
          return 'ACCT_zduspv9kbkc5wsp';
        default:
          return 'ACCT_aan2ehxiej239du'; // Default COE account
      }
    };

    try {
      const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/course-data`);
      setAvailableCourses(response.data || []);
      console.log('COURSES fetched', response);

      const user = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
      console.log('USER fetched', user);

      handleCenterChange(user.data.desired_study_cent);
      setUser(user.data);

      // Move the center account logic here
      if (user.data.desired_study_cent) {
        const centerAccount = setCenterAccountBySite(user.data.desired_study_cent);
        setCenterAccount(centerAccount);
        console.log('Center Account', centerAccount);
      }

      const bio = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/bio-registrations/${user.data.id}`);
      console.log("USER BUI", bio);

      setCourseLoading(false);
      setSpinning(false);

      // finding the user courses
      const center = await studyCenters.find((sc) => sc.name === user.data.desired_study_cent);
      if (center && center.levels[Number(bio.data.level)]) {
        console.log(center.levels[Number(bio.data.level)]);
        setCourses(center.levels[Number(bio.data.level)]);
      }

      if (!bio.data.level) {
        navigate(`/Dashboard/${id}/bio-data`);
      } else {
        console.log("USER BIO", bio.data);
        setEmail(user.data.email);
        handleLevelChange(bio.data.level);
        setApplicationNumber(user.data.application_number);
      }

      const courses = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/courses/${user.data.id}`);
      console.log("USER COURSES", courses);
      setUserCourses(courses.data);
      if (courses.data) {

        setDisabled(false);
      }
      form.setFieldsValue({
        mode_of_course: courses.data[0]?.mode_of_course,
        subject_of_study: courses.data[0]?.subject_of_study,
        session: courses.data[0]?.session,
        level_of_course: courses.data[0]?.level_of_course,
      });
      const toBeFiltered = courses.data;
      const filteredCourses = toBeFiltered.filter(
        (course) => course.semester === "1st"
      );
      const filtered2ndCourses = toBeFiltered.filter(
        (course) => course.semester === "2nd"
      );

      if (user.data.course_paid) {
        setView(false);
      }
      setUser1stCourses(filteredCourses);
      setUser2ndCourses(filtered2ndCourses);

      if (courses) {
        setView(false);
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    setSpinning(true)
    // console.log('check')


    fetchUser(); // Call the async function to fetch data
  }, []); // Only re-run if `userId` changes

  // Handle level change
  const handleLevelChange = (stDlevel) => {
    const level = stDlevel;
    setSelectedLevel(level);

    // Find the selected center and fetch the courses for the level
    const centerData = studyCenters.find((center) => center.name === selectedCenter);
    if (centerData && centerData.levels[level]) {
      setAvailableCourses(centerData.levels[level]);
    } else {
      setCourses([]);
    }
  };


  const handleCenterChange = (DESIREDCourse) => {
    const center = DESIREDCourse;
    setSelectedCenter(center);
    setSelectedLevel(""); // Reset level and courses
    setAvailableCourses([]);
  };

  const columns = [
    {
      title: 'COURSE TITLE',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'CORE/ELECTIVE',
      dataIndex: 'course_type',
      key: 'course_type',
    },
    {
      title: 'SEMESTER',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: 'SESSION',
      dataIndex: 'session',
      key: 'session',
    },
    // {
    //   title: 'DELETE',
    //   key: 'delete',
    //   render: (_, record) => (
    //     <Button
    //       type="primary"
    //       danger
    //       onClick={() => handleDelete(record.code)}
    //     >
    //       DELETE
    //     </Button>
    //   ),
    // },
  ];

  return (

    <>
      <Breadcrumb style={{ marginLeft: '8.7%', marginTop: '1%', backgroundColor: 'white', width: '82.5%', color: 'white', borderRadius: '15px', padding: '0.5%' }} itemRender={itemRender} items={items} />
      <Spin spinning={spinning} fullscreen />
      <div style={{ padding: '0 ', backgroundColor: '#fff', minHeight: '100vh', width: '83%', margin: '1% auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', backgroundColor: '#028f64', padding: '10px', color: 'white', display: 'flex', alignItems: 'center' }}>
          <Title level={2} style={{ color: '#fff' }}>Course Registration</Title>

        </div>

        <div style={{ textAlign: 'center', margin: '20px' }}>
        </div>
        {user.has_paid != 1 ? (
          <>
            <div className='' style={{ margin: '2% auto' }}>
              <Card
                bordered={false}
                style={{
                  maxWidth: 600,
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
                      Registration Fees payment
                    </Title>
                  </Space>
                  <Popover content={content} trigger="click">


                    <Button style={{ textAlign: 'start' }} block className='btn btn-green' variant="outlined">
                      Select Payment option
                    </Button>
                  </Popover>
                </Space>

                {/* <Space direction="vertical" size="small">
                  {user.has_paid && !user.course_paid ? (<>

                  </>) : !user.has_paid && !user.course_paid ? (<>

                  </>) : (<></>)}
                </Space> */}
              </Card>

            </div>
          </>
        ) : (

          <>
            <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>

              <>
                <>
                  <div>

                    <ConfigProvider >
                      {user?.course_paid == 1 ? (
                        <>

                        </>) : (<>
                          <Space align="center" direction='horizontal' style={{ display: 'flex', justifyContent: 'space-between', border: 'solid 1px green', margin: '1%', padding: '1%', borderRadius: '8px', backgroundColor: 'white' }}>
                            <BookFilled style={{ fontSize: '28px', color: 'green' }} />
                            <Title level={4} style={{ margin: 0, color: '#262626', fontWeight: 600 }}>
                              Complete  Fees Payment
                            </Title>

                            <PaystackButton
                              style={{ width: '100%', margin: '1%' }} className='btn btn-green'
                              {...component40Props}
                            />
                          </Space>
                        </>)}



                    </ConfigProvider>
                  </div>

                  <div className="registration-container" style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>


                      <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Row gutter={24}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="Mode Of Course"
                              name="mode_of_course"
                              rules={[{ required: true, message: 'Please enter mode of course' }]}
                            >
                              <Input
                                placeholder="Mode Of Course"
                                prefix={<ReadOutlined style={{ color: '#bfbfbf' }} />}
                                value={modeOfCourse}
                                disabled={disabled}
                                onChange={(e) => setModeOfCourse(e.target.value)}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="Subject Of Study"
                              name="subject_of_study"
                              rules={[{ required: true, message: 'Please enter subject of study' }]}
                            >
                              <Input
                                placeholder="Subject Of Study"
                                prefix={<BookOutlined style={{ color: '#bfbfbf' }} />}
                                value={subjectOfStudy}
                                disabled={disabled}
                                onChange={(e) => setSubjectOfStudy(e.target.value)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={24}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="Session"
                              name="session"
                              rules={[{ required: true, message: 'Please select a session' }]}
                            >
                              <Select
                                placeholder="Select a session"
                                value={session}
                                onChange={handleSessionChange}
                                suffixIcon={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
                              >
                                <Option value="" disabled>Select a session</Option>
                                <Option value="2024/2025">2024/2025</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              label="Level Of Course"
                              name="level_of_course"
                              rules={[{ required: true, message: 'Please enter level of course' }]}
                            >
                              <Input
                                placeholder="Level Of Course"
                                prefix={<TrophyOutlined style={{ color: '#bfbfbf' }} />}
                                value={levelOfCourse}
                                disabled={disabled}
                                onChange={(e) => setLevelOfCourse(e.target.value)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Divider orientation="left">
                          <Space>
                            <AppstoreAddOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                            <Text strong style={{ fontSize: '18px' }}>Add Courses</Text>
                          </Space>
                        </Divider>

                        {courseSemesterData.map((data, index) => (
                          <Card
                            key={index}
                            style={{ marginBottom: '16px' }}
                            size="small"
                            bordered
                            extra={
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                type="text"
                              />
                            }
                          >
                            <Row gutter={16}>
                              <Col xs={24} md={8}>
                                <Form.Item
                                  label={<Space><NumberOutlined /> Course {index + 1}</Space>}
                                  required
                                >
                                  <Input
                                    value={data.course}
                                    onChange={(e) => handleCourseChange(index, e.target.value)}
                                    placeholder="Enter course"
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={8}>
                                <Form.Item
                                  label={<Space><FieldTimeOutlined /> Semester</Space>}
                                  required
                                >
                                  <Select
                                    value={data.semester}
                                    onChange={(value) => handleSemesterChange(index, value)}
                                    placeholder="Select semester"
                                    style={{ width: '100%' }}
                                  >
                                    <Option value="">Select Semester</Option>
                                    <Option value="1st">1st Semester</Option>
                                    <Option value="2nd">2nd Semester</Option>
                                  </Select>
                                </Form.Item>
                              </Col>

                              <Col xs={24} md={8}>
                                <Form.Item
                                  label={<Space><TagOutlined /> Course Type</Space>}
                                  required
                                >
                                  <Select
                                    value={data.course_type}
                                    onChange={(value) => handleCourseType(index, value)}
                                    placeholder="Select course type"
                                    style={{ width: '100%' }}
                                  >
                                    <Option value="">Select Course Type</Option>
                                    <Option value="core">Core</Option>
                                    <Option value="elective">Elective</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        ))}

                        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '16px' }}>
                          <Button
                            type="dashed"
                            onClick={handleAddCourse}
                            icon={<PlusCircleOutlined />}
                            block
                          >
                            Add Course
                          </Button>

                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={loading}
                              icon={<SaveOutlined />}
                              size="large"
                              color='green'
                              style={{ width: '100%', height: '45px' }}
                              className='btn btn-green'
                            >
                              {loading ? "Saving..." : "Save Registration"}
                            </Button>
                          </Form.Item>
                        </Space>
                      </Form>
                    </Space>
                  </div>
                </>
              </>
              {/* )} */}

            </div>
          </>
        )}


        <div style={{ backgroundColor: '#028f64', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '10px' }}>
          Registered Courses
        </div>
        <div className="responsive-tables-container">


          <Table
            columns={columns}
            dataSource={user1stCourses}
            rowKey="code"
            title={() => 'First Semester'}
            pagination={false}
            bordered
            style={{
              backgroundColor: 'white',
              marginBottom: '20px',
              width: '100%'
            }}
            scroll={{ x: true }}
            size="small"
            className="course-table"
          />

          <Table
            columns={columns}
            dataSource={user2ndCourses}
            title={() => 'Second Semester'}
            rowKey="code"
            pagination={false}
            bordered
            style={{
              backgroundColor: 'white',
              width: '100%'
            }}
            scroll={{ x: true }}
            size="small"
            className="course-table"
          />
        </div>
      </div>
    </>
  );
};

export default Course_reg;
