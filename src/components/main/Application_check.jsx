import React, { useState } from 'react';
import './style.css';
import logo from '../../assets/logo2.png';
import { useNavigate } from 'react-router-dom';
import { PaystackButton } from "react-paystack";
import axios from 'axios';
import { message, Result, Button, Layout, ConfigProvider, Card, Alert, Modal, Input, Typography, Space, Divider } from "antd";
import { WarningFilled, UserOutlined, CreditCardFilled, ArrowLeftOutlined } from "@ant-design/icons";
import API_ENDPOINTS from '../../Endpoints/environment';
import PaystackVerification from './dashboard/Verify_payment';

const { Content } = Layout;
const { Title, Text } = Typography;

const ApplicationCheck = () => {
  const [applicationNumber, setApplicationNumber] = useState('');
  const navigate = useNavigate();
  // const publicKey = "pk_test_3fbb14acfe497c070f67293c2f7f6bcb1b9228a9";
  const publicKey = "pk_live_a0e748b1c573eab4ee5c659fe004596ecd25a232";
  const amount = 300000;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [view, setView] = useState('form'); // 'form', 'acceptance', 'dashboard', 'notFound'
  const componentProps = {
    email,
    amount,
    metadata: {
      phone,
      id: applicationNumber.id,
      pay_type: "acceptance_fees",
    },
    split: {
      type: "flat",
      subaccounts: [
        // Daniel Alamba
        { subaccount: "ACCT_1hli5sgrrcfuas9", share: 41000 },
        // COE ACCOUNT
        { subaccount: "ACCT_aan2ehxiej239du", share: 200000 },

        // { subaccount: "ACCT_32iz48sbi1fshex", share: 50000 },
      ]
    },
    publicKey,
    text: "Pay Now",
    onSuccess: async (reference) => {
      const paidOn = new Date();
      const formData = {
        application_reference: reference.reference,
        email: email,
        application_date: paidOn.toISOString().split('T')[0],

      };



      // Store temporary data in localStorage
      localStorage.setItem('UserData', JSON.stringify(formData)); // Ensure the data is stored as JSON
      localStorage.setItem('app_number', applicationNumber);

      try {
       
          // Navigate to the dashboard
        window.location.href = await `/dashboard/${applicationNumber.id}/acceptance-receipt`;       
      } catch (error) {
        console.error("Error sending user data:", error);
        alert("An error occurred while processing your payment. Please try again.");
      }finally {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${applicationNumber.id}`);
        console.log(response);
        if (response.data) {
          message.loading("redirecting to fees receipt");
          window.location.href = await `/dashboard/${applicationNumber.id}/fees-receipt`;


        }
          // window.location.href = await `/dashboard/${applicationNumber.id}/fees-receipt`;

        // setLoading(false);
      }
    },
    onClose: () => alert("Wait! Don't leave :("),
  };
  const correctPasskey = "coe@admin11";
  const handleOk = () => {
    if (passkey === correctPasskey) {
      message.success("Access granted!");
      navigate("/admin");
    } else {
      message.error("Incorrect passkey!");
    }
  };

  const handleInputChange = (e) => {
    setApplicationNumber(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const back = () => {
    setView('form')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hide = message.loading("Checking student details...", 0); // Display a loading indicator

    try {
      const response = await axios.post(`${API_ENDPOINTS.STUDENT_CHECK}`, {
        application_number: applicationNumber,
      });

      if (response.status === 200) {
        hide();
        if (response.data.matric_number) {
          // Student has matric number, redirect to dashboard
          localStorage.setItem("id", response.data.id);
          console.log("Student ID:", response);
          message.success("Student found! Redirecting to dashboard...");
          navigate(`/dashboard/${response.data.id}`);
        } else if (response.data.message === "acceptance") {
          // Student found but acceptance fee is required
          hide();
          message.success("Student found! Redirecting to Acceptance...");
          console.log("Student Details:", response);
          setApplicationNumber(response.data.user)
          setEmail(response.data.user.email)
          setView("acceptance"); // Show acceptance fee prompt
        }
      } else if (response.status === 425) {
        // Pending status
        hide();
        message.warning("Student admission is pending.");
        setView("pending"); // Set the view to show a pending status
      }
    } catch (error) {
      hide();

      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          // Handle 404 (not found)
          message.warning("Student not found. Proceeding to fee payment.");

        } else if (data.message === "pending") {
          // Handle pending response
          message.info("Student admission is pending.");
          setView("pending");
        } else {
          // Handle unexpected backend errors
          console.error("Error checking student details:", error);
          message.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        // Handle network or unexpected errors
        console.error("Error checking student details:", error);
        message.error("A network error occurred. Please try again later.");
      }
    }

  };


  return (
    <div className="application-check-container">
      <Modal
        title="Admin Authentication"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Login"
        centered
      >
        <Input.Password
          placeholder="Enter Admin Passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
        />
      </Modal>
      
      <div className="application-card">
        <div className="card-header">
          <img src={logo} width="80px" alt="Logo" className="logo" />
          <Title level={3} style={{marginBottom: '0', marginTop: '0'}} className="text-center text-green ">College of Education Study Centre</Title>
        </div>

        <div className="card-content">
          {view === 'form' && (
            <Space direction="vertical" size="medium" style={{ width: '100%' }}>
              <form onSubmit={handleSubmit} style={{  marginBottom:'2%', marginTop:'0%'}} className="application-form">
                <div className="form-group">
                  <label htmlFor="applicationNumber">Application Number/Matric Number</label>
                  <Input
                    size="large"
                    id="applicationNumber"
                    value={applicationNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your application number or Matric Number"
                    required
                  />
                </div>
                <Button type="primary" htmlType="submit" block size="large" className="btn-green">
                  Continue
                </Button>
              </form>
              
              <Alert
                message="Important Information"
                description="New Applicants should input their Application Number, returning students should input their Matriculation Number"
                type="info"
                showIcon
                className="info-alert"
              />
            </Space>
          )}

          {view === 'acceptance' && (
            <div className="acceptance-view">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card className="acceptance-card">
                  <Title level={4} className="text-green">Acceptance Fee Payment</Title>
                  <Text>
                    Congratulations! You have been offered admission to study <b>{applicationNumber.course}</b>
                  </Text>
                  <Text>
                    Please proceed to pay your acceptance fee of ₦3,000 to continue with application and registration
                  </Text>
                  
                  <Divider />
                  
                  <Space direction="vertical" size="small">
                    <Text strong>Student Details:</Text>
                    <Text>Name: {applicationNumber.other_names}</Text>
                    <Text>Application Number: {applicationNumber.application_number}</Text>
                    <Text>Email: {applicationNumber.email}</Text>
                  </Space>

                  <div className="action-buttons">
                    <Button 
                      icon={<ArrowLeftOutlined />} 
                      onClick={back}
                      className="back-button"
                    >
                      Back
                    </Button>
                    <PaystackButton className='btn btn-green' {...componentProps} />
                  </div>
                </Card>
              </Space>
            </div>
          )}

          {view === 'pending' && (
            <div className="pending-view">
              <Card className="pending-card">
                <Result
                  icon={<WarningFilled className="icon-style" />}
                  title={
                    <Title level={3} className="title-text">
                      Admission Status: Not Offered
                    </Title>
                  }
                  subTitle={
                    <Text className="subtitle-text">
                      We regret to inform you that you have not been offered admission yet. However, keep checking for updates, as statuses may change over time.
                    </Text>
                  }
                  extra={
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Button type="primary" block onClick={() => window.location.reload()}>
                        Refresh Status
                      </Button>
                      <Button block onClick={() => console.log("Contact Support")}>
                        Contact Support
                      </Button>
                    </Space>
                  }
                />
              </Card>
            </div>
          )}

          {view === 'verification' && (
            <Layout>
              <Content className="verification-content">
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                  Payment Verification
                </Title>

                <PaystackVerification
                  userEmail={email}
                  id={applicationNumber.id}
                  applicationNumber={applicationNumber}
                />

                <Text type="secondary" className="verification-info">
                  Please enter the reference code from your payment receipt and the amount you paid.
                </Text>
              </Content>
            </Layout>
          )}
        </div>

        <div className="card-footer">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text>New to the portal?</Text>
            <Button 
              type="primary" 
              block 
              onClick={() => navigate('/registration')}
              className="register-button"
            >
              Register Now
            </Button>
            <Button
              icon={<UserOutlined />}
              onClick={() => setIsModalVisible(true)}
              block
              className="admin-button"
            >
              Admin Portal
            </Button>
            {view === 'acceptance' && (

            <Button
              icon={<UserOutlined />}
              onClick={() => setView('verification')}
              block
              className="admin-button"
            >
              Payment Verification
            </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCheck;
