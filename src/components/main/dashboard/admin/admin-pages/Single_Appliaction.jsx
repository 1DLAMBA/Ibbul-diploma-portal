import React, { useEffect, useState } from "react";
import { Select, Form, Card, Row, Col, Modal, Button, message, Typography, ConfigProvider, Descriptions, Divider, Space } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../../../Reg_Success";
import API_ENDPOINTS from "../../../../../Endpoints/environment";
import logo from '../../../../../assets/logo2.png';
import { BookFilled, CheckCircleFilled, CloseCircleFilled, EyeFilled } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;
const schoolsData = {
  "School of Sciences": [
    "Mathematics / Geography",
    "Maths / Economics",
    "Maths / Biology",
    "Maths / Computer Science",
    "Maths / Special Education",
    "Biology / Inter Science",
    "Integrated Sciences (Double Major)",
    "Biology / Geography",
    "PHE (Double Major)",
    "Biology / Special Education",
  ],
  "School of Technical Education": [
    "Technical Education Double Major",
    "Electrical / Electronics",
    "Automobile",
    "Building",
    "Wood Work",
    "Metal Work",
  ],
  "School of Arts and Social Sciences": [
    "Geography / History",
    "Geography / Economics",
    "Geography / Social Studies",
    "History / CRS",
    "History / Islamic Studies",
    "Social Studies / Economics",
    "Social Studies / CRS",
    "Social Studies / Islamic Studies",
    "Islamic Studies / Special Education",
    "Eco / Special Education",
    "CRS / Special Education",
    "History / Special Education",
  ],
  "School of Education": [
    "Primary Education Studies (Double Major)",
    "Early Childhood Care Education (Double Major)",
  ],
  "School of Languages": [
    "English / History",
    "English / CRS",
    "English / Arabic",
    "English / Hausa",
    "English / Social Studies",
    "Hausa / Islamic Studies",
    "Hausa / Arabic",
    "Hausa / Social Studies",
    "Arabic / Islamic Studies",
    "English / Islamic Studies",
    "Arabic / Social Studies",
    "English / Special Education",
    "Hausa / Special Education",
  ],
  "School of Vocational Education": [
    "Agricultural Science Education (Double Major)",
    "Home Economics (Double Major)",
    "Business Education (Double Major)",
  ],
};

const Single_Application = () => {
  const [data, setData] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [educationDetails, setEducationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [olevel, setOlevel] = useState(true);
  const [nin, setNin] = useState(true);
  const [image, setImage] = useState(true);
  const { id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState("");

  async function approve(id) {
    try {
      const personalResponse = await axios.get(`${API_ENDPOINTS.APPROVE}/${id}`);
      console.log(personalResponse)
      window.location.reload();
    } catch (error) {
      console.error("Error :", error);
    }
  }

  async function approve_prence() {
    const formData = {
      application_number: studentDetails.application_number,
      mode_of_entry: 'pre_nce'
    }
    try {
      const personalResponse = await axios.post(`${API_ENDPOINTS.APPROVE_PRENCE}`, formData);
      console.log(personalResponse)
      window.location.reload();
    } catch (error) {
      console.error("Error :", error);

    }
  }

  async function reject(id) {
    try {
      const personalResponse = await axios.get(`${API_ENDPOINTS.REJECT}/${id}`);
      console.log(personalResponse)
      window.location.reload();
    } catch (error) {
      console.error("Error :", error);
    }
  }

  async function view(type) {
    if (type == 'olevel') {
      window.open(`${API_ENDPOINTS.IMAGE}/${data.olevel1}`, '_blank');
    } else {
      window.open(`${API_ENDPOINTS.IMAGE}/${data.nin}`, '_blank');

    }
  }

  const getData = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
      setData(response.data);
      setImage(`${API_ENDPOINTS.IMAGE}/${response.data.passport}`)
      const studDetails = await axios.get(`${API_ENDPOINTS.SCHOOL_DETAILS}/${id}`)
      setStudentDetails(studDetails.data)
      const eduDetails = await axios.get(`${API_ENDPOINTS.EDUCATIONALS_APPLICATION}/${id}`)
      setEducationDetails(eduDetails.data)
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    getData();
  }, [id]);

  const handlePrint = () => {
    window.print();
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
    name_of_father,
    father_state_of_origin,
    father_place_of_birth,
    mother_place_of_birth,
    mother_state_of_origin,

  } = data;

  const onFinish = async (values) => {
    setButtonDisabled(true)
    const formData = {
      new_school: values.first_school,
      new_course: values.first_course
    }
    console.log(formData);
    const courseChange= await axios.put(`${API_ENDPOINTS.SCHOOL_DETAILS}/${id}`, formData);
    console.log(courseChange);
    if(courseChange){
      setIsModalVisible(false)
      setButtonDisabled(false)
      setLoading(true);
    }else{
      setButtonDisabled(false)
      
    }
    getData();
    setButtonDisabled(false)


  }
  const handleSchoolChange = (value) => {
    setSelectedSchool(value); // Update the state when a school is selected
  };
  const handleOk = () => {

  };
  return (
    <div className="reg-success-container">
      <Modal
         title="Change Student Course"
         open={isModalVisible}
         onCancel={() => setIsModalVisible(false)}
         footer={null}
         centered
      >
        <div className="choice-sub">
          <Form
            layout="vertical"
            onFinish={onFinish}
            className="application-form"
          >
            <div style={{ marginBottom: "20px", marginRight: '1%' }}>



              <Form.Item
                label="Select School"
                name="first_school"
                rules={[
                  { required: true, message: "Please select a school!" },
                ]}
              >
                <Select
                  placeholder="-- Select a School --"
                  value={selectedSchool}
                  onChange={handleSchoolChange}
                  allowClear
                >
                  {Object.keys(schoolsData).map((school, index) => (
                    <Option key={index} value={school}>
                      {school}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

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
                  allowClear
                  value={selectedCourse}
                  disabled={!selectedSchool} // Disable if no school is selected
                >
                  {selectedSchool &&
                    schoolsData[selectedSchool].map((course, index) => (
                      <Option key={index} value={course}>
                        {course}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Button
                // type="primary"
                htmlType="submit"
                block
                disabled={buttonDisabled}
                style={{
                  backgroundColor: "#028f64",
                  borderColor: "#028f64",
                  padding: "10px 40px",
                  color: 'white',
                  width: 'max-content'
                }}
              >
                Proceed
              </Button>          </div>
          </Form>

        </div>

      </Modal>
      <Card className="" bordered={false} style={{ width: "82%", margin: 'auto' }}>
        <div className="header-section">
          <Title level={3} style={{ color: "green", textAlign: "right" }}>
            {data.has_admission ? (
              <>

              </>
            ) : (
              <>

                <Button
                  type="primary"
                  onClick={() => approve(data.id)}
                  style={{
                    backgroundColor: "green",
                    borderColor: "green",
                    color: "white",
                    marginTop: "16px",
                    marginRight: "16px",
                  }}
                >
                  <CheckCircleFilled />
                  Approve
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsModalVisible(true)}
                  style={{
                    backgroundColor: "tan",
                    borderColor: "tan",
                    color: "white",
                    marginTop: "16px",
                    marginRight: "16px",
                  }}
                >
                  <BookFilled />
                  Change Course
                </Button>
                <Button
                  type="primary"
                  onClick={() => approve_prence()}
                  style={{
                    backgroundColor: "#009999",
                    borderColor: "#009999",
                    color: "white",
                    marginTop: "16px",
                    marginRight: "16px",
                  }}
                >
                  <CheckCircleFilled />
                  Approve Pre NCE
                </Button>
                <Button
                  type="primary"
                  onClick={handlePrint}
                  style={{
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                    marginTop: "16px",
                  }}
                  disabled
                ><CloseCircleFilled />
                  Reject
                </Button>
              </>
            )}
          </Title>
        </div>
        <Divider />
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
          <Col span={12}>
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

          <Col span={12}>
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
              <Button ghost type="primary" className=" btn-block outline " style={{ marginBottom: '5%' }} onClick={() => view('olevel')} icon={<EyeFilled />}>View SSCE </Button>
              <Button ghost type="primary" className=" btn-block outline " style={{ marginBottom: '5%' }} onClick={() => view('nin')} icon={<EyeFilled />}> View NIN Slip </Button>
            </ConfigProvider>
          </Col>

        </Row>
        <Descriptions
          title="Course Application Details"
          column={1}
          bordered
          size="small"
        >
          <Descriptions.Item label="First School Choice">
            {studentDetails.first_school || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="First Course">
            {studentDetails.first_course || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Second School Choice">
            {studentDetails.second_school || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Second Course">
            {studentDetails.second_course || "N/A"}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Row gutter={[20, 20]}>
          <Col span={12}>

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
          </Col>
          <Col span={12}>

            <Descriptions
              title="Guardian Details "
              column={1}
              bordered
              size="small"
            >
              <Descriptions.Item label="Name Of Father">{name_of_father || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Father's State of Origin">
                {father_state_of_origin || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Father'Place of Birth">
                {father_place_of_birth || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Mother'State of Origin">{mother_state_of_origin || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Mother's'Place of Birth">
                {mother_place_of_birth || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Col>

        </Row>
        <Divider />
        <Descriptions
          title="Previous Education "
          column={1}
          bordered
          size="small"
        >
          <Descriptions.Item label="Primary School (1)">
            {studentDetails.p_school_name_1 || "N/A"} From {studentDetails.p_school_from_1} To {studentDetails.p_school_to_1}
          </Descriptions.Item>
          <Descriptions.Item label="Primary School (2)">
            {studentDetails.p_school_name_2 + ' From ' + studentDetails.p_school_from_2 + 'To ' + studentDetails.p_school_to_2 || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Secondary School (1)">
            {studentDetails.s_school_name_1 || "N/A"} From {studentDetails.s_school_from_1} To {studentDetails.s_school_to_1}
          </Descriptions.Item>
          <Descriptions.Item label="Secondary School (2)">
            {studentDetails.s_school_name_2 || "N/A"} From {studentDetails.s_school_from_2} To {studentDetails.s_school_to_2}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Col span={18} style={{ margin: 'auto' }}>
          <Descriptions title='SSCE' justify='center' column={1} bordered size="small">
            <Descriptions.Item label="Exam Type">
              {educationDetails.exam_type || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Exam Number">
              {educationDetails.exam_number || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Exam Month">
              {educationDetails.exam_month || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Exam Year">
              {educationDetails.exam_year || "N/A"}
            </Descriptions.Item>
            {[...Array(9)].map((_, index) => (
              <Descriptions.Item
                key={`subject_${index + 1}`}
                label={`Subject ${index + 1}`}
              >
                {educationDetails[`subject_${index + 1}`] || "N/A"} -{" "}
                {educationDetails[`grade_${index + 1}`] || "N/A"}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Col>


        <div className="footer-section">
        </div>
      </Card>
    </div>
  );
};

export default Single_Application;
