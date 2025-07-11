import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Avatar, Skeleton, Typography, Divider, Descriptions, Badge, Button, ConfigProvider, Flex } from 'antd';
import { UserOutlined, HomeFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

import './BioDataPage.css'; // Import custom CSS for dark green theme
import { Link, useNavigate, useParams } from 'react-router-dom';
import API_ENDPOINTS from '../../../Endpoints/environment';

const { Title, Text } = Typography;

const BioData = () => {
  // const { xxl } = useResponsive();
  const [viewBio, setViewBio] = useState(true)
  const [editBio, setEditBio] = useState(false)
  const [user, setUser] = useState('' || null);
  const [bio, setBio] = useState('' || null);
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = localStorage.getItem('id');
  const [active, setActive] = useState(false);
  const [loader, setLoader] = useState(true);


  function routeEdit() {
    navigate(`/Dashboard/${id}/Edit`)
  }
  const items = [
    {
      path: `/Dashboard/${id}`,
      title: <HomeFilled />,
    },

    {
      path: `/${id}/Bio-data`,
      title: 'Bio-data',
    },
  ];

  useEffect(() => {
    // console.log('check')
    const fetchUser = async () => {
      // console.log('check')
      try {
        const personalResponse = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        setUser(personalResponse.data); // Assuming the API returns user data in `response.data`

        const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/bio-registrations/${id}`);
        setBio(response.data); // Assuming the API returns user data in `response.data`

        console.log('Data', response.data);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUser(); // Call the async function to fetch data
    }
  }, [userId]); // Only re-run if `userId` changes


  function itemRender(currentRoute, params, items, paths) {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
    );
  }



  return (
    <>
      <Breadcrumb style={{ marginLeft: '8.7%', marginTop: '1%', backgroundColor: 'white', width: '82.5%', color: 'white', borderRadius: '15px', padding: '0.5%' }} itemRender={itemRender} items={items} />

      <div className="bio-data-container">
        <div bordered={false} style={{ padding: '0 !important' }} className="bio-data-card">
          <div style={{ textAlign: 'center', backgroundColor: '#028f64', padding: '10px', color: 'white', display: 'flex', alignItems: 'center', marginBottom: '1%', justifyContent:'space-between' }}>
            <Title level={2} style={{ color: '#fff' }}>Bio Data</Title>

 <ConfigProvider
                theme={{
                    token: {
                        // Seed Token
                        colorPrimary: '#028f64',
                        borderRadius: 2,

                        // Alias Token
                        margin: '20px',
                        colorBgContainer: '#fff',
                    },
                }}
            >
                <Button type="" color='default' style={{backgroundColor:'', color:""}} onClick={routeEdit} >
                    Update
                </Button>
            </ConfigProvider>
          </div>
          {/* <Col className="profile-section" style={{ padding: '1%' }}>
            <div className="div">

              <Title level={4} className="name">
                {user?.fullName}
              </Title>
              <Text className="matric-number">{user?.matricNumber}</Text>
            </div>
          
          </Col> */}
          {/* <hr /> */}

          {/* Profile Section */}

          {/* Basic Information Section */}


          {loader ? (<>
            <Skeleton.Node
              active='true'
              style={{
                width: '80vw',
                marginLeft: '10'
              }}
            />
          </>) : (<>

            {bio.level ? (<>
              <div style={{ padding: '1%' }}>
                <Descriptions
                  title="Personal Information"
                  bordered
                  column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
                  size="small"
                  className="mobile-descriptions"
                  style={{
                    padding: '0',
                    fontSize: '14px',
                    width: '100%'
                  }}
                >
                  <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                  <Descriptions.Item label="Phone Number">{user?.phone_number}</Descriptions.Item>
                  <Descriptions.Item label="Gender">{user?.gender}</Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">{user?.date_of_birth}</Descriptions.Item>
                  <Descriptions.Item label="Place of Birth">{bio?.place_of_birth}</Descriptions.Item>
                  <Descriptions.Item label="Marital Status">{user?.marital_status}</Descriptions.Item>
                  <Descriptions.Item label="Religion">{user?.religion}</Descriptions.Item>
                  <Descriptions.Item label="Nationality">{bio?.nationality}</Descriptions.Item>
                </Descriptions>



                <Divider />

                {/* Academic Information */}
                <Descriptions title="Academic Information" bordered
                  column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
                  size="small"
                  className="mobile-descriptions"
                  style={{
                    padding: '0',
                    fontSize: '14px',
                    width: '100%'
                  }}>

                  <Descriptions.Item label="Level">{bio?.level}</Descriptions.Item>
                  {/* <Descriptions.Item label="Current Semester">{user?.current_semester}</Descriptions.Item> */}
                  <Descriptions.Item label="Session">{bio?.session}</Descriptions.Item>
                  <Descriptions.Item label="Matric Number">{user?.matric_number}</Descriptions.Item>
                  <Descriptions.Item label="Mode of Entry">{bio?.mode_of_entry}</Descriptions.Item>
                  {/* <Descriptions.Item label="Entry Year">{bio?.entry_year}</Descriptions.Item> */}
                  <Descriptions.Item label="Program Duration">{user?.program_duration} years</Descriptions.Item>
                  {/* <Descriptions.Item label="Award in View">{user?.award_in_view}</Descriptions.Item> */}
                </Descriptions>

                <Divider />

                <Descriptions title="Guardian Information" bordered
                  column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
                  size="small"
                  className="mobile-descriptions"
                  style={{
                    padding: '0',
                    fontSize: '14px',
                    width: '100%'
                  }}>

                  <Descriptions.Item label="Father's/Guardian name">{user?.name_of_father}</Descriptions.Item>
                  {/* <Descriptions.Item label="Current Semester">{user?.current_semester}</Descriptions.Item> */}
                  <Descriptions.Item label="Father's/Guardian State">{user?.father_state_of_origin}</Descriptions.Item>
                  <Descriptions.Item label="Father's/Guardian P.O.B">{user?.father_place_of_birth}</Descriptions.Item>
                  <Descriptions.Item label="Applicant Occupation">{user?.applicant_occupation}</Descriptions.Item>
                  {/* <Descriptions.Item label="Entry Year">{bio?.entry_year}</Descriptions.Item> */}
                  {/* <Descriptions.Item label="Program Duration">{user?.program_duration} years</Descriptions.Item> */}
                  {/* <Descriptions.Item label="Award in View">{user?.award_in_view}</Descriptions.Item> */}
                </Descriptions>

                {/* Payment Information */}
                {/* <Descriptions title="Payment Information" bordered column={{ xs: 1, sm: 1, md: 2 }}>
            <Descriptions.Item label="School Fees">
              <Badge status={user?.hasPaidSchoolFee ? "success" : "error"} text={user?.hasPaidSchoolFee ? "Paid" : "Not Paid"} />
            </Descriptions.Item>
            <Descriptions.Item label="Faculty Fee">
              <Badge status={user?.hasPaidFacultyFee ? "success" : "error"} text={user?.hasPaidFacultyFee ? "Paid" : "Not Paid"} />
            </Descriptions.Item>
            <Descriptions.Item label="GST Fee">
              <Badge status={user?.hasPaidGstFee ? "success" : "error"} text={bioData.hasPaidGstFee ? "Paid" : "Not Paid"} />
            </Descriptions.Item>
            <Descriptions.Item label="Entrepreneurship Fee">
              <Badge status={bioData.hasPaidEntrepreneurshipFee ? "success" : "error"} text={bioData.hasPaidEntrepreneurshipFee ? "Paid" : "Not Paid"} />
            </Descriptions.Item>
            <Descriptions.Item label="SUG Fee">
              <Badge status={bioData.hasPaidSugFee ? "success" : "error"} text={bioData.hasPaidSugFee ? "Paid" : "Not Paid"} />
            </Descriptions.Item>
            <Descriptions.Item label="Naniss Fee">
              <Badge status={bioData.hasPaidNanissFee ? "success" : "error"} text={user?.hasPaidNanissFee ? "Paid" : "Not Paid"} />
            </Descriptions.Item>
          </Descriptions> */}

                <Divider />

                {/* Contact Information */}
                <Descriptions title="Sponsorship Information" bordered
                  column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
                  size="small"
                  className="mobile-descriptions"
                  style={{
                    padding: '0',
                    fontSize: '14px',
                    width: '100%'
                  }}>
                  <Descriptions.Item label="Present Address">{user?.present_contact_address}</Descriptions.Item>
                  <Descriptions.Item label="Permanent Address">{user?.address}</Descriptions.Item>
                  <Descriptions.Item label="Next of Kin">{bio?.next_of_kin}</Descriptions.Item>
                  <Descriptions.Item label="Next of Kin Phone">{bio?.next_of_kin_phone_number}</Descriptions.Item>
                  <Descriptions.Item label="Relationship">{bio?.next_of_kin_relationship}</Descriptions.Item>
                  <Descriptions.Item label="Sponsor Address">{bio?.sponsor_address}</Descriptions.Item>
                </Descriptions>
              </div>
            </>) : (<>
              <Card
                style={{
                  maxWidth: '500px',
                  margin: '50px auto',
                  padding: '20px',
                  border: '1px solid #b7eb8f',
                  borderRadius: '10px',
                  backgroundColor: '#f6ffed',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <ExclamationCircleOutlined
                  style={{
                    fontSize: '48px',
                    color: '#52c41a',
                    marginBottom: '20px',
                  }}
                />
                <Typography.Title level={3} style={{ color: '#028f64', marginBottom: '10px' }}>
                  Action Required!
                </Typography.Title>
                <Text style={{ fontSize: '16px', color: '#595959' }}>
                  It looks like you haven't completed the <strong>Student Registration Form</strong> yet. This form is necessary to proceed further.
                </Text>
                <Text style={{ display: 'block', marginTop: '15px', fontSize: '14px', color: '#595959' }}>
                  Completing this form will allow us to process your details and ensure you're fully registered.
                </Text>
                <div style={{ marginTop: '30px' }}>
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
                    <Button block
                      style={{
                        backgroundColor: "#028f64",
                        borderColor: "#028f64",
                        padding: "10px 40px",
                        color: 'white',
                        width: 'max-content'
                      }} onClick={routeEdit} variant="outlined">
                      Update
                    </Button>
                  </ConfigProvider>
                </div>
              </Card>
            </>)}

          </>)}


        </div>
      </div>

    </>

  );
};
export default BioData;
