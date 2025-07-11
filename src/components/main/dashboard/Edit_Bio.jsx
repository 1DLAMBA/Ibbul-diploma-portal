import React, { Children, useState , useEffect} from 'react';
import { Form, Input,Breadcrumb, Button, Col, Card, Row, Select, DatePicker, Typography, Space, Table, notification } from 'antd';
import moment from "moment";
import './BioData.css';
import { IeOutlined, HomeFilled, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_ENDPOINTS from '../../../Endpoints/environment';
import dayjs from 'dayjs'; 

const { Title } = Typography;
const { Option } = Select;



  
  function itemRender(currentRoute, params, items, paths) {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;
  
    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
    );
  }

const Edit_Bio = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [bioData, setBioData] = useState('');
  const userId=localStorage.getItem('id')
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({}); // State for form initial values
  const { id } = useParams();

  const items = [
    {
      path: '/Dashboard',
      title: <HomeFilled />,
    },
    
    {
      path: `/${id}/Bio-data`,
      title: 'Bio-data',
      Children: [{
        
      }]
    },
    {
      path: '/Edit',
      title: 'Edit',
    },
  ];

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (_, record, index) => (
        <Input
          placeholder={`Subject ${index + 1}`}
          value={record.subject}
          onChange={(e) => handleEdit(index, "subject", e.target.value)}
        />
      ),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      render: (_, record, index) => (
        <Input
          placeholder="Grade"
          value={record.grade}
          onChange={(e) => handleEdit(index, "grade", e.target.value)}
        />
      ),
    },
    {
      title: "Exam No",
      dataIndex: "examNumber",
      key: "examNumber",
      render: (_, record, index) => (
        <Input
          placeholder="Exam No"
          value={record.examNumber}
          onChange={(e) => handleEdit(index, "examNumber", e.target.value)}
        />
      ),
    },
    {
      title: "Dates",
      dataIndex: "dates",
      key: "dates",
      render: (_, record, index) => (
        <DatePicker
          value={record.dates}
          onChange={(date) => handleEdit(index, "dates", date)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Exam Centre",
      dataIndex: "examCentre",
      key: "examCentre",
      render: (_, record, index) => (
        <Input
          placeholder="Exam Centre"
          value={record.examCentre}
          onChange={(e) => handleEdit(index, "examCentre", e.target.value)}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, __, index) => (
        <Button type="link" danger onClick={() => handleDelete(index)}>
          Delete
        </Button>
      ),
    },
  ];

  const handleAddRow = () => {
    setData([...data, { subject: "", grade: "", examNumber: "", dates: null, examCentre: "" }]);
  };

  const handleEdit = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
  };

  const handleDelete = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Replace the URL below with your API endpoint
      const response = await fetch("https://api.example.com/qualification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        notification.success({
          message: "Data Submitted",
          description: "Your qualification data has been successfully submitted.",
        });
        setData([]); // Reset table
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      notification.error({
        message: "Submission Failed",
        description: "There was an error submitting your data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };





  const onFinish = async (values) => {
    setLoading(true);
    console.log('Updated Values:', values);

    try {
        const formData = new FormData();
        
        formData.append('application_id', userId);

       Object.keys(values).forEach((key) => {
        if (key === 'date_of_birth' && values[key]) {
            formData.append(key, values[key].format('YYYY-MM-DD'));
        } else {
            formData.append(key, values[key]);
        }
    });
      

        const RegForm = {
          application_number:id,
          next_of_kin:values.next_of_kin,
          sponsor_address:values.sponsor_address,
          next_of_kin_relationship:values.next_of_kin_relationship,
          next_of_kin_phone_number:values.next_of_kin_phone_number,
          next_of_kin_address:values.next_of_kin_address,
          nationality:values.nationality,
          mode_of_entry:values.mode_of_entry,
          session:values.session,
          place_of_birth: values.place_of_birth,
          level:values.level,
          subject_combination:values.subject_combination,          
        }

        const PersonalForm = {
            surname: values.surname,
            other_names: values.other_names,
            email: values.email,
            phone_number:values.phone_number,
            gender: values.gender,
            date_of_birth: values.date_of_birth,
            local_government: values.local_government,
            name_of_father: values.name_of_father,
            father_place_of_birth: values.father_place_of_birth,
            father_state_of_origin: values.father_state_of_origin,
            marital_status: values.marital_status,
            religion: values.religion,
        }

        
        const response = await axios.post(`${API_ENDPOINTS.BIO_REGISTRATION}`, RegForm, {
              headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('Response:', response.data);
            const newDateOfBirth = PersonalForm.date_of_birth.format('YYYY-MM-DD');
            const newPersonalForm = {
              ...PersonalForm,
              date_of_birth: newDateOfBirth
            }
            console.log('BIO REG', RegForm)
            console.log('personal', newPersonalForm)
        const perosnalResponse = await axios.put(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`, newPersonalForm);

        console.log('Response:', response.data);
        // navigate(`/dashboard/${id}`);
        
  window.location.href = `/dashboard/${id}/bio-data`;
    } catch (error) {
        console.error('Error saving bio-data:', error);
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data for:", userId);
        const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/bio-registrations/${id}`);
        const perosnalResponse = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
        setBioData(response.data); // Assuming the API returns an array in `data`
      form.setFieldsValue(response.data);
      form.setFieldsValue({
        surname: perosnalResponse.data.surname,
        other_names: perosnalResponse.data.other_names,
        email: perosnalResponse.data.email,
        phone_number: perosnalResponse.data.phone_number,
        gender: perosnalResponse.data.gender,
        name_of_father:perosnalResponse.data.name_of_father,
        father_place_of_birth:perosnalResponse.data.father_place_of_birth,
        father_state_of_origin:perosnalResponse.data.father_state_of_origin,
        date_of_birth: perosnalResponse.data.date_of_birth ? dayjs(perosnalResponse.date_of_birth): null,
        marital_status: perosnalResponse.data.marital_status,
        place_of_birth: perosnalResponse.data.place_of_birth,
        religion: perosnalResponse.data.religion,
        local_government: perosnalResponse.data.local_government,
      });
      console.log("Fetching user data for:", response);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    if (bioData) {
      setInitialValues({
        full_name: bioData?.full_name,
        email: bioData?.email,
        phone_number: bioData?.phone_number,
        gender: bioData?.gender,
        date_of_birth: bioData?.date_of_birth ? moment(bioData?.date_of_birth) : null,
        place_of_birth: bioData?.place_of_birth,
        marital_status: bioData?.marital_status,
        religion: bioData?.religion,
        nationality: bioData?.nationality,
        faculty: bioData?.faculty,
        department: bioData?.department,
        programme: bioData?.programme,
        level: bioData?.level,
        current_semester: bioData?.current_semester,
        current_session: bioData?.current_session,
        matric_number: bioData?.matric_number,
        mode_of_entry: bioData?.mode_of_entry,
        study_mode: bioData?.study_mode,
        entry_year: bioData?.entry_year,
        program_duration: bioData?.program_duration,
        award_in_view: bioData?.award_in_view,
        present_contact_address: bioData?.present_contact_address,
        permanent_home_address: bioData?.permanent_home_address,
        next_of_kin: bioData?.next_of_kin,
        next_of_kin_phone_number: bioData?.next_of_kin_phone_number,
        next_of_kin_relationship: bioData?.next_of_kin_relationship,
        sponsor_address: bioData?.sponsor_address,
      });

      console.log("Initial values updated:", initialValues);
    }
  }, [bioData]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(bioData);
    }
  }, [initialValues, form]);


  return (
    <>
    
    <Breadcrumb style={{marginLeft:'8.7%', marginTop: '1%', backgroundColor:'white', width:'82.5%', color:'white', borderRadius:'15px', padding:'0.5%'}} itemRender={itemRender} items={items} />
    <div className="bio-data-container">

      <div bordered  className="bio-data-card">
      <div style={{ textAlign: 'center',backgroundColor: '#028f64', padding: '10px', color: 'white', display: 'flex', alignItems: 'center', marginBottom:'1%'}}>
        <Title level={2} style={{ color: '#fff' }}>Edit Bio Data</Title>

        </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
        values={initialValues}
        style={{margin:'5%'}}
      >
        {/* Personal Information */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item label="Surname" name="surname" > 
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Other Names" name="other_names">
              <Input  />
            </Form.Item>
          </Col>
          </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Email" name="email">
              <Input  />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Phone Number" name="phone_number">
              <Input />
            </Form.Item>
          </Col>
          
          </Row>
          <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item label="Gender" name="gender">
              <Select>
                <Option value="M">Male</Option>
                <Option value="F">Female</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Date of Birth" name="date_of_birth">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Marital Status" name="marital_status">
              <Select>
                <Option value="Single">Single</Option>
                <Option value="Married">Married</Option>
              </Select>
            </Form.Item>
          </Col>
          </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Place of Birth" name="place_of_birth"  rules={[{ required: true, message: 'Please enter place of birth' }]}>
              <Input />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item label="Religion" name="religion">
              <Input />
            </Form.Item>
          </Col>
          </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Local Government" name="local_government">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Nationality" name="nationality">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>

        <Col xs={24} sm={8}>
            <Form.Item label="Name Of Father" name="name_of_father">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Father's Place of Birth" name="father_place_of_birth">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Father's State Of Origin" name="father_state_of_origin">
              <Input />
            </Form.Item>
          </Col>
          </Row>
          <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
          <Form.Item label="Next of Kin" name="next_of_kin">
              <Input />
            </Form.Item>
           
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Next Of Kin Address" name="next_of_kin_address">
              <Input />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={8}>
            <Form.Item label="Next of Kin Phone Number" name="next_of_kin_phone_number">
              <Input />
            </Form.Item>
          </Col>
          </Row>
          <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Relationship with Next of Kin" name="next_of_kin_relationship">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Sponsor Address" name="sponsor_address">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Academic Information */}
        <Title level={4} className="section-title">Academic Information</Title>
        <Row gutter={[16, 16]}>
         
         
          <Col xs={24} sm={6}>
            <Form.Item label="Mode Of Entry" name="mode_of_entry">
            <Select disabled={bioData?.mode_of_entry === 'pre_nce'}>
                <Option value="pre_nce">Pre NCE</Option>
                <Option value="direct_nce">Direct NCE</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label="Session" name="session">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label="Level" name="level">
              <Input />
            </Form.Item>
          </Col>
         
          <Col xs={24} md={24}>
            <Form.Item label="Subject Combination" name="subject_combination">
              <Input />
            </Form.Item>
          </Col>
          
        </Row>
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
     
      {/* <Form form={form} layout="vertical">
        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={false}
          bordered
        />
        <Space style={{ marginTop: "20px", justifyContent: "space-between", width: "100%" }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddRow}
            style={{ width: "30%" }}
          >
            Add New Row
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={{ backgroundColor: "#028f64", borderColor: "#028f64" }}
          >
            Submit Data
          </Button>
        </Space>
      </Form> */}
    </div>

       
        <Row justify="center">
          <Button type="primary" htmlType="submit" loading={loading} className="submit-btn">
            Save Changes
          </Button>
        </Row>
      </Form>
      </div >
    </div>
    </>
  );
};

export default Edit_Bio;
