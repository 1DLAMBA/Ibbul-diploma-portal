import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Button, Typography, Descriptions, Divider } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RegSuccess.css";
import API_ENDPOINTS from "../Endpoints/environment";
import logo from '../assets/logo2.png';

const { Title } = Typography;

const Reg_Success = () => {
  const [data, setData] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(true);
  const { id } = useParams();
  const printRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        setData(response.data);
        setImage(`${API_ENDPOINTS.IMAGE}/${response.data.passport}`)
        const studDetails = await axios.get(`${API_ENDPOINTS.SCHOOL_DETAILS}/${id}`)
        setStudentDetails(studDetails.data)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id]);

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;

    document.body.innerHTML = `
      <div class="print-content">
        ${printContents}
      </div>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="reg-success-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="reg-success-container">
        <p>No data available</p>
      </div>
    );
  }

  const {
    passport,
    application_number,
    application_reference,
    surname,
    other_names,
    date_of_birth,
    phone_number,
    marital_status,
    address,
    state_of_origin,
    local_government,
    first_school,
    first_course,
    second_school,
    second_course,
    religion,
    desired_study_cent,
  } = data;

  return (
    <div className="reg-success-container">
      <Card className="reg-success-card" bordered={false}>
        <div ref={printRef} className="printable-content">
          <div className="header-section">
            <Title level={3} style={{ color: "green", textAlign: "center" }}>
              <img
                src={logo}
                alt="College Logo"
                className="form-logo"
              /><br/>
              College Of Education NCE Programme Application Slip
            </Title>
          </div>
          <Title level={5} style={{ color: "black", textAlign: "right" }}>
            Payment Reference: {application_reference}
          </Title>
          <Row gutter={[16, 16]} justify="center">
            <Col span={6}>
              <div className="passport-container">
                {passport ? (
                  <img
                    src={image}
                    alt="Passport"
                    className="passport-image"
                  />
                ) : (
                  <div className="passport-placeholder">No Passport</div>
                )}
              </div>
            </Col>
            <Col span={18}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Application Number">
                  {application_number || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Surname">
                  {surname || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Other Names">
                  {other_names || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {date_of_birth || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {phone_number || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Divider />
          <Descriptions
            title="Personal Details"
            column={1}
            bordered
            size="small"
          >
            <Descriptions.Item label="Address">{address || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="State of Origin">
              {state_of_origin || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Local Government">
              {local_government || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Religion">{religion || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Desired Study Center">
              {desired_study_cent || "N/A"}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            title="Education Details"
            column={1}
            bordered
            size="small"
          >
            <Descriptions.Item label="First School">
              {studentDetails.first_school || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="First Course">
              {studentDetails.first_course || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Second School">
              {studentDetails.second_school || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Second Course">
              {studentDetails.second_course || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="footer-section">
          <Button
            type="primary"
            onClick={handlePrint}
            style={{
              backgroundColor: "green",
              borderColor: "green",
              color: "white",
              marginTop: "16px",
            }}
          >
            Print
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Reg_Success;
