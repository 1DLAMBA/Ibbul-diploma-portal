import React, { useState } from 'react';
import './style.css';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { PaystackButton } from "react-paystack";
import axios from 'axios';
import { message, Result, Button, Layout, ConfigProvider, Card, Alert, Modal, Input, Typography, Space, Divider, Row, Col } from "antd";
import { WarningFilled, UserOutlined, CreditCardFilled, ArrowLeftOutlined, SearchOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import API_ENDPOINTS from '../../Endpoints/environment';
import PaystackVerification from './dashboard/Verify_payment';

const { Content } = Layout;
const { Title, Text } = Typography;

const ApplicationCheck = () => {
  const [applicationNumber, setApplicationNumber] = useState('');
  const navigate = useNavigate();
  const publicKey = "pk_test_3fbb14acfe497c070f67293c2f7f6bcb1b9228a9";
  const amount = 300000;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [view, setView] = useState('form');
  
  const componentProps = {
    email,
    amount,
    metadata: {
      phone,
      id: applicationNumber.id,
      pay_type: "acceptance_fees",
    },
    // split: {
    //   type: "flat",
    //   subaccounts: [
    //     { subaccount: "ACCT_1hli5sgrrcfuas9", share: 41000 },
    //     { subaccount: "ACCT_aan2ehxiej239du", share: 200000 },
    //   ]
    // },
    publicKey,
    text: "Pay Now",
    onSuccess: async (reference) => {
      const paidOn = new Date();
      const formData = {
        application_reference: reference.reference,
        email: email,
        application_date: paidOn.toISOString().split('T')[0],
      };

      localStorage.setItem('UserData', JSON.stringify(formData));
      localStorage.setItem('app_number', applicationNumber);

      try {
        window.location.href = await `/dashboard/${applicationNumber.id}/acceptance-receipt`;       
      } catch (error) {
        console.error("Error sending user data:", error);
        alert("An error occurred while processing your payment. Please try again.");
      } finally {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${applicationNumber.id}`);
        console.log(response);
        if (response.data) {
          message.loading("redirecting to fees receipt");
          window.location.href = await `/dashboard/${applicationNumber.id}/fees-receipt`;
        }
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
    const hide = message.loading("Checking student details...", 0);

    try {
      const response = await axios.post(`${API_ENDPOINTS.STUDENT_CHECK}`, {
        application_number: applicationNumber,
      });

      if (response.status === 200) {
        hide();
        if (response.data.matric_number) {
          localStorage.setItem("id", response.data.id);
          console.log("Student ID:", response);
          message.success("Student found! Redirecting to dashboard...");
          navigate(`/dashboard/${response.data.id}`);
        } else if (response.data.message === "acceptance") {
          hide();
          message.success("Student found! Redirecting to Acceptance...");
          console.log("Student Details:", response);
          setApplicationNumber(response.data.user)
          setEmail(response.data.user.email)
          setView("acceptance");
        }
      } else if (response.status === 425) {
        hide();
        message.warning("Student admission is pending.");
        setView("pending");
      }
    } catch (error) {
      hide();

      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          message.warning("Student not found. Proceeding to fee payment.");
        } else if (data.message === "pending") {
          message.info("Student admission is pending.");
          setView("pending");
        } else {
          console.error("Error checking student details:", error);
          message.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        console.error("Error checking student details:", error);
        message.error("A network error occurred. Please try again later.");
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      overflow: 'hidden'
    }}>
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
      
      <div style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '95vh',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #028f64 0%, #00b894 100%)',
          padding: '20px 15px',
          textAlign: 'center',
          color: 'white',
          flexShrink: 0
        }}>
          <img src={logo} alt="Logo" style={{ width: '40px', marginBottom: '8px' }} />
          <Title level={3} style={{ color: 'white', margin: 0, fontSize: '20px' }}>
            IBBU Diploma Programme
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
            Student Application Portal
          </Text>
        </div>

        {/* Content */}
        <div style={{ 
          padding: '20px 15px', 
          flex: 1,
          overflow: 'auto',
          minHeight: 0
        }}>
          {view === 'form' && (
            <Row gutter={[20, 15]} align="middle" style={{ height: '100%' }}>
              {/* Welcome Section */}
              <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <SearchOutlined style={{ fontSize: '32px', color: '#028f64', marginBottom: '12px' }} />
                  <Title level={4} style={{ margin: '0 0 8px 0', color: '#333', fontSize: '18px' }}>
                    Welcome to IBBU Portal
                  </Title>
                  <Text style={{ color: '#666', fontSize: '13px', display: 'block', marginBottom: '12px' }}>
                    Check your application status, pay fees, and manage your academic journey with ease.
                  </Text>
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '12px', 
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    <Text strong style={{ color: '#028f64', fontSize: '12px' }}>
                      Quick Access Features:
                    </Text>
                    <ul style={{ 
                      textAlign: 'left', 
                      margin: '6px 0 0 0', 
                      paddingLeft: '18px',
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      <li>Application Status Check</li>
                      <li>Acceptance Fee Payment</li>
                      <li>Registration Management</li>
                      <li>Document Verification</li>
                    </ul>
                  </div>
                </div>
              </Col>

              {/* Form Section */}
              <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%' }}>
                  <Title level={5} style={{ margin: '0 0 12px 0', color: '#333', textAlign: 'center', fontSize: '16px' }}>
                    Check Your Status
                  </Title>

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '5px', 
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '12px'
                      }}>
                        Application Number / Matric Number
                      </label>
                      <Input
                        size="middle"
                        value={applicationNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your application or matric number"
                        required
                        style={{
                          borderRadius: '6px',
                          border: '2px solid #e8e8e8',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      block 
                      size="middle"
                      style={{
                        background: 'linear-gradient(135deg, #028f64 0%, #00b894 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        height: '36px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      Check Status
                    </Button>
                  </form>

                  <Alert
                    message="Important Information"
                    description="New applicants should input their Application Number, returning students should input their Matriculation Number"
                    type="info"
                    showIcon
                    size="small"
                    style={{ 
                      marginTop: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e6f7ff',
                      background: '#f6ffed',
                      fontSize: '11px'
                    }}
                  />
                </div>
              </Col>
            </Row>
          )}

          {view === 'acceptance' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                <Title level={4} style={{ margin: 0, color: '#333', fontSize: '18px' }}>
                  Congratulations! 🎉
                </Title>
                <Text style={{ color: '#666', fontSize: '12px' }}>
                  You have been offered admission
                </Text>
              </div>

              <Card style={{ 
                borderRadius: '10px', 
                border: '2px solid #f0f0f0',
                marginBottom: '15px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong style={{ fontSize: '14px', color: '#333' }}>
                    Course: {applicationNumber.course}
                  </Text>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <Text style={{ color: '#666', fontSize: '12px' }}>
                    Please proceed to pay your acceptance fee of <Text strong style={{ color: '#028f64' }}>₦3,000</Text> to continue with application and registration
                  </Text>
                </div>

                <Divider style={{ margin: '10px 0' }} />
                
                <div style={{ marginBottom: '12px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Student Details:</Text>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    <div style={{ marginBottom: '2px' }}>Name: {applicationNumber.other_names}</div>
                    <div style={{ marginBottom: '2px' }}>Application Number: {applicationNumber.application_number}</div>
                    <div>Email: {applicationNumber.email}</div>
                  </div>
                </div>
              </Card>

              <div style={{ display: 'flex', gap: '6px' }}>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={back}
                  size="small"
                  style={{
                    flex: 1,
                    borderRadius: '6px',
                    height: '32px',
                    fontSize: '11px'
                  }}
                >
                  Back
                </Button>
                <PaystackButton 
                  className='btn btn-green' 
                  {...componentProps}
                  style={{
                    flex: 2,
                    borderRadius: '6px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #028f64 0%, #00b894 100%)',
                    border: 'none',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}
                />
              </div>
            </div>
          )}

          {view === 'pending' && (
            <div style={{ 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              justifyContent: 'center' 
            }}>
              <ClockCircleOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '12px' }} />
              <Title level={4} style={{ margin: '0 0 10px 0', color: '#333', fontSize: '18px' }}>
                Admission Status: Pending
              </Title>
              <Text style={{ color: '#666', fontSize: '12px', display: 'block', marginBottom: '15px' }}>
                We regret to inform you that you have not been offered admission yet. However, keep checking for updates, as statuses may change over time.
              </Text>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Button 
                  type="primary" 
                  onClick={() => window.location.reload()}
                  size="small"
                  style={{
                    background: 'linear-gradient(135deg, #028f64 0%, #00b894 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    height: '32px',
                    fontSize: '11px'
                  }}
                >
                  Refresh Status
                </Button>
                <Button 
                  onClick={() => console.log("Contact Support")}
                  size="small"
                  style={{
                    borderRadius: '6px',
                    height: '32px',
                    fontSize: '11px'
                  }}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          )}

          {view === 'verification' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <CreditCardFilled style={{ fontSize: '40px', color: '#028f64', marginBottom: '10px' }} />
                <Title level={4} style={{ margin: 0, color: '#333' }}>
                  Payment Verification
                </Title>
                <Text style={{ color: '#666', fontSize: '13px' }}>
                  Enter your payment details for verification
                </Text>
              </div>

              <PaystackVerification
                userEmail={email}
                id={applicationNumber.id}
                applicationNumber={applicationNumber}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          background: '#f8f9fa',
          padding: '12px 15px',
          borderTop: '1px solid #e8e8e8',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Text style={{ textAlign: 'center', color: '#666', fontSize: '11px', marginBottom: '2px' }}>
              New to the portal?
            </Text>
            <Button 
              type="primary" 
              block 
              onClick={() => navigate('/registration')}
              size="small"
              style={{
                background: 'linear-gradient(135deg, #028f64 0%, #00b894 100%)',
                border: 'none',
                borderRadius: '6px',
                height: '28px',
                fontSize: '11px'
              }}
            >
              Register Now
            </Button>
            <Button
              icon={<UserOutlined />}
              onClick={() => navigate('/agent-registration')}
              block
              size="small"
              style={{
                borderRadius: '6px',
                height: '28px',
                fontSize: '11px',
                border: '2px solid #028f64',
                color: '#028f64'
              }}
            >
              Agent Registration
            </Button>
            <Button
              icon={<UserOutlined />}
              onClick={() => setIsModalVisible(true)}
              block
              size="small"
              style={{
                borderRadius: '6px',
                height: '28px',
                fontSize: '11px',
                border: '2px solid #666',
                color: '#666'
              }}
            >
              Admin Portal
            </Button>
            {view === 'acceptance' && (
              <Button
                icon={<UserOutlined />}
                onClick={() => setView('verification')}
                block
                size="small"
                style={{
                  borderRadius: '6px',
                  height: '28px',
                  fontSize: '11px',
                  border: '2px solid #1890ff',
                  color: '#1890ff'
                }}
              >
                Payment Verification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCheck;
