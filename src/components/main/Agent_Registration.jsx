import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, DatePicker, Typography, Row, message, Steps, theme, Card, Col, ConfigProvider, Divider, Alert, Space } from 'antd';
import { CloudUploadOutlined, UploadOutlined, SmileOutlined, SolutionOutlined, UserOutlined, WarningOutlined, FileFilled, LoadingOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './style.css';
import logo from '../../assets/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PaystackButton } from "react-paystack";
import API_ENDPOINTS from '../../Endpoints/environment';

const { Title, Text } = Typography;
const { Option } = Select;

const steps = [
  {
    title: 'Personal Particulars',
    content: 'First-content',
    icon: <UserOutlined />
  },
  {
    title: 'School Details',
    content: 'Second-content',
  },
  {
    title: 'Educational Qualifications',
    content: 'Last-content',
  },
];

const newSchoolsData = [
  "Accounting",
  "Business Administration",
  "Public Administration",
  "Computer Science",
  "Science Laboratory Technology",
  "Library and Information Science",
  "Criminology and intelligence Studies",
  "Media and Communication Studies",
  "Transport Management and Operations",
  "Social/Medical works and Rehabilitation Studies",
]

const AgentRegistration = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Registration form states
  const publicKey = "pk_live_a0e748b1c573eab4ee5c659fe004596ecd25a232";
  const [step, setStep] = useState('step1')
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [examTypes, setExamTypes] = useState([]);
  const [examNumber, setExamNumber] = useState([]);
  const [grades, setGrades] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [selectedExamType, setSelectedExamType] = useState("");
  const [firstStep, setFirstStep] = useState({});
  const [secondStep, setSecondStep] = useState(null);
  const [thirdStep, setThirdStep] = useState(null);
  const { token } = theme.useToken();
  const amount = 400000;
  const [email, setEmail] = useState(firstStep.phone_number);
  const [current, setCurrent] = useState(0);
  const [uploadedOl1, setUploadedAL1] = useState('')
  const [passport, setPassport] = useState('')
  const [nin, setNIN] = useState('')
  const [imageUrl, setImageUrl] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [states, setStates] = useState([]);
  const [lgas, setLGAs] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLGAs, setLoadingLGAs] = useState(false);
  const [uploading, setUploading] = useState(false);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Fetch LGAs from the API based on selected state
  const getLGAFromApi = async (state) => {
    setLoadingLGAs(true);
    try {
      const response = await fetch(
        `https://nga-states-lga.onrender.com/?state=${state}`
      );
      const json = await response.json();
      setLGAs(json);
    } catch (error) {
      console.error("Error fetching LGAs:", error);
    } finally {
      setLoadingLGAs(false);
    }
  };

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
        setImageUrl(`${API_ENDPOINTS.IMAGE}/${info.file.response.data}`)
      } else if (type === 'olevel') {
        setUploadedAL1(fileName);
      } else if (type === 'nin') {
        setNIN(fileName);
      }
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

  // Agent credentials (in a real app, this would be stored securely on the backend)
  const agentCredentials = {
    username: 'agent',
    password: 'agent123'
  };

  const onFinish = async (values) => {
    if (step === 'step1') {
      setFirstStep(values)
      setEmail(values.email)
      console.log('First Form Values:', firstStep);
      setStep('step2')
      next()
      window.scrollTo(0, 0)

    } else if (step === 'step2') {
      setSecondStep(values);
      console.log('second Form Values:', secondStep);
      console.log('First Form Values:', firstStep);
      next()
      window.scrollTo(0, 0)
      setStep('step3')
    } else if (step === 'step3') {
      setThirdStep(values)
      userCheck();
    }
  };

  async function userCheck() {
    try {
      if (!thirdStep) {
        message.error('Please fill the form Correctly')
        return;
      }
      const form = { phoneNumber: firstStep.phone_number };
      const schoolResponse = await axios.post(`${API_ENDPOINTS.API_BASE_URL}/check`, form);

      console.log('School Response:', schoolResponse);
      if (schoolResponse?.data?.user && !schoolResponse?.data?.user.educational_detail) {
        console.log('Third Form Values:', thirdStep);

        const educationFormData = {
          ...thirdStep,
          application_number: schoolResponse.data.user.id
        }
        const year = new Date().getFullYear();

        const newPersonalForm = {
          application_number: `${thirdStep.exam_year + thirdStep.exam_number}`,
          application_reference: null,
        }

        const perosnalResponse = await axios.put(`${API_ENDPOINTS.PERSONAL_DETAILS}/${schoolResponse.data.user.id}`, newPersonalForm);
        const finalResponse = await axios.post(API_ENDPOINTS.EDUCATIONALS_APPLICATION, educationFormData);

        console.log(finalResponse);
        if (!finalResponse) {
          setStep('step3');
          message.error('An error occurred while processing your data. Please try again.');
          return;
        }

        navigate(`${schoolResponse.data.user.id}/success`);

      } else if (schoolResponse?.data?.user?.educational_detail) {
        message.error('User already with phone number already exists')
      };
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);

      // Set step4 ONLY when an error occurs
      setStep('step4');
    }
  }

  const componentProps = {
    email,
    amount,
    metadata: {
      phone: firstStep.phone_number,
    },
    split: {
      type: "flat",
      subaccounts: [
        // DANIEL ALAMBA
        { subaccount: "ACCT_1hli5sgrrcfuas9", share: 30000 },
        // COE ACCOUNT
        { subaccount: "ACCT_aan2ehxiej239du", share: 325000 },

        // { subaccount: "ACCT_32iz48sbi1fshex", share: 50000 },
      ]
    },
    publicKey,
    text: "Pay Now",
    onSuccess: async (reference) => {
      sendDetails(reference)
    },
    onClose: () => alert("Wait! Don't leave :("),
  };

  const sendDetails = async () => {
    try {
      setLoading(true);
      const adjustedDOB = firstStep.date_of_birth.format('YYYY-MM-DD');
      const year = new Date().getFullYear();

      const personalFormData = {
        ...firstStep,
        application_number: `${thirdStep.exam_year + thirdStep.exam_number}`,
        date_of_birth: adjustedDOB,
        application_reference: `AGENT_${Date.now()}`, // Generate agent reference
        passport: passport, 
        olevel1: uploadedOl1,
        nin: nin,
      };
      
      const personalResponse = await axios.post(API_ENDPOINTS.PERSONAL_DETAILS, personalFormData);
      console.log('Personal Response:', personalResponse);

      const adjustedPSF1 = secondStep.p_school_from_1?.format('YYYY-MM-DD');
      const adjustedPST1 = secondStep.p_school_to_1?.format('YYYY-MM-DD');
      const adjustedPSF2 = secondStep.p_school_from_2?.format('YYYY-MM-DD');
      const adjustedPST2 = secondStep.p_school_to_2?.format('YYYY-MM-DD');

      const adjustedSSF1 = secondStep.s_school_from_1?.format('YYYY-MM-DD');
      const adjustedSST1 = secondStep.s_school_to_1?.format('YYYY-MM-DD');
      const adjustedSSF2 = secondStep.s_school_from_2?.format('YYYY-MM-DD');
      const adjustedSST2 = secondStep.s_school_to_2?.format('YYYY-MM-DD');

      const schoolFormData = {
        ...secondStep,
        application_number: personalResponse.data.id,
        p_school_from_1: adjustedPSF1,
        p_school_to_1: adjustedPST1,
        p_school_from_2: adjustedPSF2,
        p_school_to_2: adjustedPST2,
        s_school_from_1: adjustedSSF1,
        s_school_to_1: adjustedSST1,
        s_school_from_2: adjustedSSF2,
        s_school_to_2: adjustedSST2,
      }
      
      const schoolResponse = await axios.post(API_ENDPOINTS.SCHOOL_DETAILS, schoolFormData);
      console.log('School Response:', schoolResponse);

      console.log('Third Form Values:', thirdStep);
      const educationFormData = { ...thirdStep, application_number: personalResponse.data.id }
      const finalResponse = await axios.post(`${API_ENDPOINTS.EDUCATIONALS_APPLICATION}`, educationFormData)
      console.log('Final Response:', finalResponse);
      
      if (finalResponse) {
        message.success('Application submitted successfully!');
        // Navigate to success page
        navigate(`/registration/${personalResponse.data.id}/success`)
      } else {
        console.error("No response returned.");
        message.error("Application submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error sending user data:", error);
      message.error("An error occurred while submitting your application. Please try again.");
      setStep('step3')
    } finally {
      setLoading(false);
    }
  }

  function stepper() {
    if (step === 'step1') {

      setStep('step2')
    } else if (step === 'step2') {
      setStep('step3')
    } else {
      return;
    }

  }
  function stepback() {
    if (step === 'step4') {
      setStep('step3')
      prev()
      window.scrollTo(0, 0)

    } else if (step === 'step3') {

      setStep('step2')
      prev()
      window.scrollTo(0, 0)

    } else if (step === 'step2') {
      setStep('step1')
      prev()
      window.scrollTo(0, 0)

    } else {
      return;
    }

  }

  const handleSchoolChange = (value) => {
    setSelectedSchool(value); // Update the state when a school is selected
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setLGAs([]); // Clear LGAs when a new state is selected
    getLGAFromApi(value);
  };

  const handleExamTypeChange = (value) => {
    setSelectedExamType(value);
  };

  const handleAuthentication = async (values) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (values.username === agentCredentials.username && values.password === agentCredentials.password) {
        message.success('Authentication successful!');
        setIsAuthenticated(true);
      } else {
        message.error('Invalid username or password!');
      }
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    // Mock API data
    const getStatesFromApi = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch("https://nga-states-lga.onrender.com/fetch");
        const json = await response.json();
        setStates(json);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };
    getStatesFromApi();
    async function fetchData() {
      try {
        const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/course-data`);
        setSubjects(response.data || []);
        console.log('COURSES fetched', response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
    setExamTypes([
      { id: 1, exam_type: "WAEC", exam_code: "W" },
      { id: 3, exam_type: "NECO", exam_code: "N" },
      { id: 6, exam_type: "NABTEB", exam_code: "T" },
      { id: 7, exam_type: "GRADE_II_TEACHERS_CERT.", exam_code: "G" },
      { id: 8, exam_type: "NBAIS", exam_code: "NB" },
    ]);

    setGrades({
      WAEC: ["A1", "B2", "B3", "C4", "C5", "C6", "A.R"],
      NECO: ["A1", "B2", "B3", "C4", "C5", "C6", "A.R"],
      NABTEB: ["A1", "A2", "A3", "C4", "C5", "C6", "A.R"],
      GRADE_II_TEACHERS_CERT: ["A", "B", "C", "D", "A.R"],
      NBAIS: ["A", "B2", "B3", "C5", "C6", "A.R"],
    });


  }, []);

  if (!isAuthenticated) {
    return (
      <div className="application-check-container">
        <div className="application-card" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
          <div className="card-header">
            <img src={logo} width="60px" alt="Logo" className="logo" />
            <Title level={4} style={{marginBottom: '0', marginTop: '0'}} className="text-center text-green">
              IBBU Consult and services
            </Title>
          </div>

          <div className="" style={{ padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card
              style={{
                width: '100%',
                maxWidth: 350,
                borderRadius: 10,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Title level={4} style={{ textAlign: 'center', marginBottom: '16px', color: '#028f64' }}>
                Agent Authentication
              </Title>
              
              <Alert
                message="Agent Access Required"
                description="Enter your credentials to access the registration portal."
                type="info"
                showIcon
                style={{ marginBottom: '16px', fontSize: '12px' }}
              />

              <Form
                layout="vertical"
                onFinish={handleAuthentication}
                size="middle"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please enter your username!' }]}
                  style={{ marginBottom: '12px' }}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Enter username"
                    size="middle"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please enter your password!' }]}
                  style={{ marginBottom: '16px' }}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Enter password"
                    size="middle"
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: '12px' }}>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: '#028f64',
                        borderRadius: 2,
                      },
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      style={{
                        backgroundColor: '#028f64',
                        borderColor: '#028f64',
                        height: '36px',
                      }}
                    >
                      {loading ? 'Authenticating...' : 'Login'}
                    </Button>
                  </ConfigProvider>
                </Form.Item>
              </Form>

              <div style={{ textAlign: 'center' }}>
                <Button 
                  type="link" 
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBack}
                  style={{ color: '#028f64', fontSize: '12px' }}
                  size="small"
                >
                  Back to Home
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Agent Registration Form (replica of main registration form)
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="header">
          <span style={{ margin: 'auto', display: 'flex' }}>
            <img
              src={logo}
              alt="College Logo"
              className="form-logo"
            />
            <Title level={3} className="form-title">
              Ibrahim Badamasi Babangida University
            </Title>
          </span>
        </div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="application-form"
        >
          <div className="form-container">
            <div className="form-header">
              <b className="form-subtitle">
                Application for Admission into NCE Programme (LVSP) - Agent Portal
              </b>
              <ConfigProvider
                theme={{
                  token: {
                    // Seed Token
                    colorPrimary: '#028f64',
                    borderRadius: 2,

                    // Alias Token
                    colorText: 'white',
                    colorBgContainer: '#f6ffed',
                  },
                }}
              >
                {/* <Steps current={current} items={items} style={{color:'white'}} /> */}
              </ConfigProvider>
            </div>
            {step === 'step1' && (
              <div style={{ padding: '1% 2%' }}>
                <ConfigProvider
                  theme={{
                    token: {
                      // Seed Token
                      colorPrimary: '#028f64',
                      borderRadius: 2,

                      // Alias Token
                      colorText: '#028f64',
                      colorBgContainer: '#f6ffed',
                    },
                  }}
                >
                  <Steps
                    items={[
                      {
                        title: 'Personal Particulars',
                        status: 'process',
                        icon: <UserOutlined />,
                      },
                      {
                        title: 'School Details',
                        status: 'wait',
                        icon: <SolutionOutlined />,
                      },
                      {
                        title: 'Educational Qualifications',
                        status: 'wait',
                        icon: <SolutionOutlined />,
                      },
                      {
                        title: 'Done',
                        status: 'wait',
                        icon: <SmileOutlined />,
                      },
                    ]}
                    style={{ marginBottom: '2%' }}
                  />
                </ConfigProvider>
                <Row gutter={[16, 16]} style={{ justifyContent: 'space-between' }}>
                  <div style={{ width: '50%', margin: 'auto', display: 'flex', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        border: "1px dashed #d9d9d9",
                        padding: 20,
                        borderRadius: 10,
                        background: "#f5f5f5",
                        marginBottom: 20,
                      }}
                    >
                      {imageUrl ? (
                        <div style={{ width: '100px', height: 'auto' }}>
                          <img
                            src={imageUrl}
                            alt="passport"
                            style={{ width: "100%", height: 'auto', borderRadius: 10 }}
                          />
                        </div>
                      ) : (
                        <div style={{ width: '100px', height: '100px', display: 'flex' }}>
                          <UserOutlined style={{ fontSize: 48, color: "#999", margin: 'auto' }} />
                        </div>
                      )}
                    </div>
                    <Upload
                      name="passport"
                      listType="picture"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      {...props(setUploadedAL1, 'passport')}
                      accept="image/*"
                    >
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: '#028f64',
                            borderRadius: 2,
                            margin: '20px',
                            colorBgContainer: '#f6ffed',
                          },
                        }}
                      >
                        <Button
                          icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
                          disabled={uploading}
                        >
                          {uploading ? 'Uploading...' : 'Upload Passport'}
                        </Button>
                      </ConfigProvider>
                    </Upload>
                  </div>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Surname"
                      name="surname"
                      rules={[{ required: true, message: 'Please enter your surname' }]}
                    >
                      <Input placeholder="Enter your surname" />
                    </Form.Item>

                    <Form.Item
                      label="Other Names"
                      name="other_names"
                      rules={[{ required: true, message: 'Please enter your other names' }]}
                    >
                      <Input placeholder="Enter your other names" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Marital Status"
                      name="marital_status"
                      rules={[{ required: true, message: 'Please select your marital status' }]}
                    >
                      <Select placeholder="Select marital status">
                        <Option value="single">Single</Option>
                        <Option value="married">Married</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Date of Birth"
                      name="date_of_birth"
                      rules={[{ required: true, message: 'Please select your date of birth' }]}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={24}>
                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[{ required: true, message: 'Please enter your Address' }]}
                    >
                      <Input placeholder="Enter your Address" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Form.Item
                    label="State Of Origin"
                    name="state_of_origin"
                    rules={[{ required: true, message: 'Please enter your State Of Origin' }]}
                  >
                    <Select
                      style={{ width: 300, marginBottom: 16 }}
                      placeholder="Select State"
                      onChange={handleStateChange}
                      loading={loadingStates}
                    >
                      {states?.map((state) => (
                        <Option key={state} value={state}>
                          {state}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* LGA Select */}
                  <Form.Item
                    label="Local Government"
                    name="local_government"
                    rules={[{ required: true, message: 'Please enter your Local Government area' }]}
                  >
                    <Select
                      style={{ width: 300 }}
                      placeholder={selectedState ? "Select LGA" : "Please select a state first"}
                      disabled={!selectedState}
                      loading={loadingLGAs}
                    >
                      {lgas?.map((lga) => (
                        <Option key={lga} value={lga}>
                          {lga}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Ethnic Group"
                      name="ethnic_group"
                      rules={[{ required: true, message: 'Please enter your Ethnic Group' }]}
                    >
                      <Input placeholder="Enter your Ethnic Group" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Religion"
                      name="religion"
                      rules={[{ required: true, message: 'Please enter your religion' }]}
                    >
                      <Input placeholder="Enter your religion" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Phone Number"
                      name="phone_number"
                      rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                      <Input placeholder="Enter your phone number" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ required: true, message: 'Please enter your email' }]}
                    >
                      <Input placeholder="Enter your Email" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Name of Father"
                      name="name_of_father"
                      rules={[{ required: true, message: "Please enter your Father's name" }]}
                    >
                      <Input placeholder="Enter your Father's name" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Father's State of Origin"
                      name="father_state_of_origin"
                      rules={[{ required: true, message: "Please enter your Father's State of Origin" }]}
                    >
                      <Input placeholder="Enter your Father's State of Origin" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Father's Place of Birth"
                      name="father_place_of_birth"
                      rules={[{ required: true, message: "Please enter your Father's Place of Birth" }]}
                    >
                      <Input placeholder="Enter your Father's Place of Birth" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mother's Place of Birth"
                      name="mother_place_of_birth"
                      rules={[{ required: true, message: "Please enter your Mother's Place of Birth" }]}
                    >
                      <Input placeholder="Enter your Mother's Place of Birth" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mother's State of Origin"
                      name="mother_state_of_origin"
                      rules={[{ required: true, message: "Please enter your Mother's State of Origin" }]}
                    >
                      <Input placeholder="Enter your Mother's State of Origin" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Applicant's Occupation"
                      name="applicant_occupation"
                      rules={[{ required: true, message: "Please enter your Occupation" }]}
                    >
                      <Input placeholder="Enter your Occupation" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Working Experience"
                      name="working_experience"
                      rules={[{ required: true, message: "Please enter your Working Experience" }]}
                    >
                      <Input placeholder="Enter your Working Experience" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={8}>
                    <Form.Item
                      label="Centre Location"
                      name="desired_study_cent"
                      rules={[{ required: true, message: "Please enter your Centre Location" }]}
                    >
                      <Select placeholder="Select Location">
                        {["suleja",
                          "Minna",
                          // "Mokwa",
                          // "Tegina",
                          // "Kontogora",
                          // "New Bussa",
                        ].map(
                          (month) => (
                            <Option key={month} value={month}>
                              {month}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}
            {step === 'step2' && (
              <div style={{ padding: '1% 2%' }}>
                <ConfigProvider
                  theme={{
                    token: {
                      // Seed Token
                      colorPrimary: '#028f64',
                      borderRadius: 2,

                      // Alias Token
                      colorText: '#028f64',
                      colorBgContainer: '#f6ffed',
                    },
                  }}
                >
                  <Steps
                    items={[
                      {
                        title: 'Personal Particulars',
                        status: 'finish',
                        icon: <UserOutlined />,
                      },
                      {
                        title: 'School Details',
                        status: 'process',
                        icon: <SolutionOutlined />,
                      },
                      {
                        title: 'Educational Qualifications',
                        status: 'wait',
                        icon: <SolutionOutlined />,
                      },
                      {
                        title: 'Done',
                        status: 'wait',
                        icon: <SmileOutlined />,
                      },
                    ]}
                    style={{ marginBottom: '2%' }}
                  />
                </ConfigProvider>

                <div style={{ padding: "20px" }}>
                  <h2>School and Course Selection</h2>

                  {/* School Dropdown */}
                  <h4>School Attended</h4>
                  <h5>Primary</h5>
                  <Row gutter={[16, 16]}>
                    <b>1</b>
                    <Col xs={12} md={8}>
                      <Form.Item
                        label="School Name"
                        name="p_school_name_1"
                        rules={[{ required: true, message: "Please enter School Name" }]}
                      >
                        <Input placeholder="Enter School name" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        label="From"
                        name="p_school_from_1"
                        rules={[{ required: true, message: "Please enter your arrival date in the school" }]}
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        label="To"
                        name="p_school_to_1"
                        rules={[{ required: true, message: "Please enter when you exited the school" }]}
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <b>2</b>
                    <Col xs={12} md={8}>
                      <Form.Item
                        label="School Name"
                        name="p_school_name_2"
                      >
                        <Input placeholder="Enter School name" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        label="From"
                        name="p_school_from_2"
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        label="To"
                        name="p_school_to_2"
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <h5>Secondary</h5>
                  <Row gutter={[16, 16]}>
                    <b>1</b>
                    <Col xs={12} md={8}>
                      <Form.Item
                        label="School Name"
                        name="s_school_name_1"
                        rules={[{ required: true, message: "Please enter School Name" }]}
                      >
                        <Input placeholder="Enter School name" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        label="From"
                        name="s_school_from_1"
                        rules={[{ required: true, message: "Please enter your Father's State of Origin" }]}
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        label="To"
                        name="s_school_to_1"
                        rules={[{ required: true, message: "Please enter your Father's Place of Birth" }]}
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <b>2</b>
                    <Col xs={12} md={8}>
                      <Form.Item
                        label="School Name"
                        name="s_school_name_2"
                      >
                        <Input placeholder="Enter School name" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        label="From"
                        name="s_school_from_2"
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        label="To"
                        name="s_school_to_2"
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <h3>Select Diploma Programme of choice</h3>
                  <div className="choice">
                    <div>
                      <h5>First Choice</h5>
                      <div className="choice-sub">
                        {/* Course Dropdown */}
                        <div style={{ marginBottom: "20px" }}>
                          <Form.Item
                            label="Select Course"
                            name="first_course"
                            rules={[
                              {
                                required: true,
                                message: "Please select a course!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="-- Select a Course --"
                              value={selectedCourse}
                              allowClear
                              style={{ width: "120%" }}
                            >
                              {newSchoolsData.map((school, index) => (
                                <Option key={index} value={school}>
                                  {school}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5>Second Choice</h5>
                      <div className="choice-sub">
                        {/* Course Dropdown */}
                        <div style={{ marginBottom: "20px" }}>
                          <Form.Item
                            label="Select Course"
                            name="second_course"
                            rules={[
                              {
                                required: true,
                                message: "Please select a course!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="-- Select a Course --"
                              value={selectedCourse}
                              allowClear
                              style={{ width: "120%" }}
                            >
                              {newSchoolsData.map((school, index) => (
                                <Option key={index} value={school}>
                                  {school}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step === 'step3' && (
              <>
                <div style={{ padding: "30px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                  <ConfigProvider
                    theme={{
                      token: {
                        // Seed Token
                        colorPrimary: '#028f64',
                        borderRadius: 2,

                        // Alias Token
                        colorText: '#028f64',
                        colorBgContainer: '#f6ffed',
                      },
                    }}
                  >
                    <Steps
                      items={[
                        {
                          title: 'Personal Particulars',
                          status: 'finish',
                          icon: <UserOutlined />,
                        },
                        {
                          title: 'School Details',
                          status: 'finish',
                          icon: <SolutionOutlined />,
                        },
                        {
                          title: 'Educational Qualifications',
                          status: 'process',
                          icon: <SolutionOutlined />,
                        },
                        {
                          title: 'Done',
                          status: 'wait',
                          icon: <SmileOutlined />,
                        },
                      ]}
                      style={{ marginBottom: '2%' }}
                    />
                  </ConfigProvider>
                  <Card
                    style={{
                      maxWidth: "1200px",
                      margin: "0 auto",
                      borderRadius: "10px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h2 style={{ textAlign: "center", color: "#028f64", marginBottom: "20px" }}>
                      Examination Details Form
                    </h2>

                    <Row gutter={24}>
                      <Col xs={12} md={8}>
                        <Form.Item
                          label="Examination Type"
                          name="exam_type"
                          rules={[{ required: true, message: "Please select an exam type!" }]}
                        >
                          <Select placeholder="Select Type" onChange={handleExamTypeChange}>
                            {examTypes.map((exam) => (
                              <Option key={exam.id} value={exam.exam_type}>
                                {exam.exam_type}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={8}>
                        <Form.Item
                          label="Examination Number"
                          name="exam_number"
                          rules={[{ required: true, message: "Please enter the exam number!" }]}
                        >
                          <Input placeholder="Enter Examination Number" />
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={8}>
                        <Form.Item
                          label="Examination Month"
                          name="exam_month"
                          rules={[{ required: true, message: "Please select the month!" }]}
                        >
                          <Select placeholder="Select Month">
                            {["JUN/JUL", "May/Jun", "Oct/Nov", "Nov/Dec"].map(
                              (month) => (
                                <Option key={month} value={month}>
                                  {month}
                                </Option>
                              )
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={12} md={8}>
                        <Form.Item
                          label="Examination Year"
                          name="exam_year"
                          rules={[{ required: true, message: "Please enter the year!" }]}
                        >
                          <Input placeholder="Enter Examination Year" />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={8} style={{ marginTop: '2%' }}>
                        <Upload {...props(setUploadedAL1, 'olevel')} style={{ marginBlock: '2%' }}>
                          <ConfigProvider
                            theme={{
                              token: {
                                // Seed Token
                                colorPrimary: '#028f64',
                                borderRadius: 2,

                                // Alias Token
                                margin: '20px',
                                colorBgContainer: '#f6ffed',
                              },
                            }}
                          >
                            <Button ghost type="primary" className=" btn-block outline " style={{ marginBottom: '5%' }} icon={<CloudUploadOutlined />}>Click to Upload O Level </Button>
                          </ConfigProvider>
                        </Upload>
                      </Col>
                      <Col xs={12} md={8} style={{ marginTop: '2%' }}>
                        <Upload {...props(setUploadedAL1, 'nin')} style={{ marginTop: '2%' }}>
                          <ConfigProvider
                            theme={{
                              token: {
                                // Seed Token
                                colorPrimary: '#028f64',
                                borderRadius: 2,

                                // Alias Token
                                margin: '20px',
                                colorBgContainer: '#f6ffed',
                              },
                            }}
                          >
                            <Button ghost type="primary" className=" btn-block outline " style={{ marginBottom: '5%' }} icon={<FileFilled />}>Click to additional O Level (optional) </Button>
                          </ConfigProvider>
                        </Upload>
                      </Col>
                    </Row>

                    <div style={{ margin: '1%' }}></div>
                    {[...Array(9)].map((_, index) => (
                      <Row gutter={24} key={index}>
                        <Col span={12}>
                          <Form.Item
                            label={`Subject ${index + 1}`}
                            name={`subject_${index + 1}`}
                            rules={[{ required: index < 5, message: "Please select a subject!" }]}
                          >
                            <Select placeholder="Select Subject">
                              {subjects.map((subject) => (
                                <Option key={subject.id} value={subject.course}>
                                  {subject.course}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={`Grade ${index + 1}`}
                            name={`grade_${index + 1}`}
                            rules={[{ required: index < 5, message: "Please select a grade!" }]}
                          >
                            <Select placeholder="Select Grade" disabled={!selectedExamType}>
                              {(grades[selectedExamType] || []).map((grade) => (
                                <Option key={grade} value={grade}>
                                  {grade}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </Card>
                </div>
              </>
            )}

            {step === 'step4' && (
              <div style={{ padding: '1% 2%' }}>
                <ConfigProvider
                  theme={{
                    token: {
                      // Seed Token
                      colorPrimary: '#028f64',
                      borderRadius: 2,

                      // Alias Token
                      colorText: '#028f64',
                      colorBgContainer: '#f6ffed',
                    },
                  }}
                >
                  <Steps
                    items={[
                      {
                        title: 'Personal Particulars',
                        status: 'finish',
                        icon: <UserOutlined />,
                      },
                      {
                        title: 'School Details',
                        status: 'finish',
                        icon: <SolutionOutlined />,
                      },
                      {
                        title: 'Educational Qualifications',
                        status: 'finish',
                        icon: <SolutionOutlined />,
                      },
                      {
                        title: 'Review & Submit',
                        status: 'process',
                        icon: <SmileOutlined />,
                      },
                    ]}
                    style={{ marginBottom: '2%' }}
                  />
                </ConfigProvider> 
                
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
                  <Card
                    style={{
                      borderRadius: 10,
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                    title={
                      <Title level={3} style={{ textAlign: "center", color: "#028f64", marginBottom: "20px" }}>
                        Application Preview
                      </Title>
                    }
                  >
                    <Alert
                      message="Review Your Application"
                      description="Please review all the information below before submitting your application. This is the final step."
                      type="info"
                      showIcon
                      style={{ marginBottom: '20px' }}
                    />

                    {/* Personal Details Preview */}
                    <div style={{ marginBottom: '30px' }}>
                      <Title level={4} style={{ color: '#028f64', borderBottom: '2px solid #028f64', paddingBottom: '8px' }}>
                        Personal Particulars
                      </Title>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Text strong>Name:</Text> {firstStep.surname} {firstStep.other_names}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Phone Number:</Text> {firstStep.phone_number}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Email:</Text> {firstStep.email}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Date of Birth:</Text> {firstStep.date_of_birth?.format('DD/MM/YYYY')}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Marital Status:</Text> {firstStep.marital_status}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>State of Origin:</Text> {firstStep.state_of_origin}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Local Government:</Text> {firstStep.local_government}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Address:</Text> {firstStep.address}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Ethnic Group:</Text> {firstStep.ethnic_group}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Religion:</Text> {firstStep.religion}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Occupation:</Text> {firstStep.applicant_occupation}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Working Experience:</Text> {firstStep.working_experience}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Study Centre:</Text> {firstStep.desired_study_cent}
                        </Col>
                      </Row>
                    </div>

                    {/* School Details Preview */}
                    <div style={{ marginBottom: '30px' }}>
                      <Title level={4} style={{ color: '#028f64', borderBottom: '2px solid #028f64', paddingBottom: '8px' }}>
                        School Details
                      </Title>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Text strong>Primary School 1:</Text> {secondStep?.p_school_name_1}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Primary School 1 Period:</Text> {secondStep?.p_school_from_1?.format('DD/MM/YYYY')} - {secondStep?.p_school_to_1?.format('DD/MM/YYYY')}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Secondary School 1:</Text> {secondStep?.s_school_name_1}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Secondary School 1 Period:</Text> {secondStep?.s_school_from_1?.format('DD/MM/YYYY')} - {secondStep?.s_school_to_1?.format('DD/MM/YYYY')}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>First Choice Course:</Text> {secondStep?.first_course}
                        </Col>
                        <Col xs={24} md={12}>
                          <Text strong>Second Choice Course:</Text> {secondStep?.second_course}
                        </Col>
                      </Row>
                    </div>

                    {/* Educational Qualifications Preview */}
                    <div style={{ marginBottom: '30px' }}>
                      <Title level={4} style={{ color: '#028f64', borderBottom: '2px solid #028f64', paddingBottom: '8px' }}>
                        Educational Qualifications
                      </Title>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                          <Text strong>Exam Type:</Text> {thirdStep?.exam_type}
                        </Col>
                        <Col xs={24} md={8}>
                          <Text strong>Exam Number:</Text> {thirdStep?.exam_number}
                        </Col>
                        <Col xs={24} md={8}>
                          <Text strong>Exam Year:</Text> {thirdStep?.exam_year}
                        </Col>
                        <Col xs={24} md={8}>
                          <Text strong>Exam Month:</Text> {thirdStep?.exam_month}
                        </Col>
                      </Row>
                      
                      <Divider />
                      <Title level={5}>Subjects and Grades</Title>
                      <Row gutter={[16, 16]}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                          <Col xs={24} md={12} key={index}>
                            {thirdStep?.[`subject_${index}`] && (
                              <div style={{ marginBottom: '8px' }}>
                                <Text strong>{thirdStep[`subject_${index}`]}:</Text> {thirdStep[`grade_${index}`]}
                              </div>
                            )}
                          </Col>
                        ))}
                      </Row>
                    </div>

                    <Divider />
                    
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <Alert
                        message="Agent Registration"
                        description="This application will be submitted without payment as it's being processed by an authorized agent."
                        type="success"
                        showIcon
                        style={{ marginBottom: '20px' }}
                      />
                      
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: '#028f64',
                            borderRadius: 2,
                          },
                        }}
                      >
                        <Button
                          type="primary"
                          size="large"
                          onClick={sendDetails}
                          loading={loading}
                          style={{
                            backgroundColor: "#028f64",
                            borderColor: "#028f64",
                            padding: "12px 40px",
                            height: 'auto',
                            fontSize: '16px'
                          }}
                        >
                          {loading ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </ConfigProvider>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', padding: '2%' }}>
              <Button color='danger' onClick={stepback}>
                Back
              </Button> &nbsp;
              <ConfigProvider
                theme={{
                  token: {
                    // Seed Token
                    colorPrimary: '#028f64',
                    borderRadius: 2,

                    // Alias Token
                    colorText: 'white',
                    colorBgContainer: '#f6ffed',
                  },
                }}
              >
                <Button
                  // type="primary"
                  htmlType="submit"
                  block
                  style={{
                    backgroundColor: "#028f64",
                    borderColor: "#028f64",
                    padding: "10px 40px",
                    color: 'white',
                    width: 'max-content'
                  }}
                >
                  Proceed
                </Button>
              </ConfigProvider>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AgentRegistration;
