import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Typography, Row, Divider, Col, ConfigProvider, Breadcrumb } from "antd";
import { PrinterOutlined, HomeFilled, PrinterFilled } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API_ENDPOINTS from "../../../../Endpoints/environment";
import axios from "axios";
import './docstyle.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from '../../../../assets/logo2.png';





const { Title, Paragraph, Text } = Typography;

const Acceptance_Receipt = () => {
    const letterRef = useRef(null);
    const [application, setApplication] = useState('');
    const [loader, setLoader] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();


    const items = [
        {
          path: `/Dashboard/${id}`,
          title: <HomeFilled />,
        },
    
        {
          path: '/admission-letter',
          title: 'Admission Letter',
    
        },
    
      ];

    useEffect(() => {
        // console.log('check')
        const fetchUser = async () => {
            // console.log('check')
            try {
                const response = await axios.get(`${API_ENDPOINTS.PERSONAL_DETAILS}/${id}`);
                setApplication(response.data); // Assuming the API returns user data in `response.data`


                if (!response.data.matric_number) {
                    navigate('/');

                }


                console.log('Data', response.data.data);
                setLoader(false);

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser(); // Call the async function to fetch data

    }, []); // Only re-run if `userId` changes



    const handlePrint = () => {
        const input = letterRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save("Acceptance_Receipt.pdf");
        });
    };

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
        
      <Breadcrumb style={{margin: ' 1% auto', backgroundColor: 'white', width: '82.5%', color: 'white', borderRadius: '15px', padding: '0.5%' }} itemRender={itemRender} items={items} />
        <div className="" style={{ padding: 20, textAlign: "center",backgroundColor:'white', backgroundSize: "contain"}}>

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
                <Button type="primary" icon={<PrinterFilled/>}ghost onClick={handlePrint} >
                    Print Letter
                </Button>
            </ConfigProvider>
            <Card
                ref={letterRef}
                className="admission-letter" 
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    padding: "40px",
                    textAlign: "left",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ddd",
                    margin: "20px auto",
                    fontFamily: "Arial, sans-serif",
                    backgroundImage: "url('../../../../assets/logo2.png') !important"
                }}
                align="middle" justify="space-around"
            >
                <div  style={{ textAlign: "center", marginBottom: 20 }}>
                    <Row align="middle" justify="space-around">
                        <Col span={16}>
                            <Title type="success" level={3} className="text-green-600 m-auto">NIGER STATE COLLEGE OF EDUCATION</Title>
                        </Col>

                    </Row>
                        <Row className="mt-2" gutter={[0, 4]} justify="space-between" >
                            <Col style={{ textAlign: "left" }} span={10}>
                                <Text strong>Provost:</Text> Professor Yakubu M. Auna
                                <br/>
                                <Text>B. Sc, MSc</Text>
                                <br/>
                                <Text strong>Registrar:</Text> Haj. Zainab Sidi Aliyu
                           
                            </Col>
                            <Col span={4}>

                        <img src={logo} alt="User" style={{ width: '100px' }} />
                       </Col>


                            <Col style={{ textAlign: "right" }} span={9} className="text-right">
                                <Text>Private mail bag 39,</Text>
                                <br/>
                                <Text>Telephone: 080-232060 222205</Text>
                               
                                <br/>
                                <Text>E-mail: coedu@yahoo.com</Text>
                                <br/>
                                <Text>Minna, Niger State</Text>
                            </Col>
                        </Row>
                    

                    <Row className="mt-4 mb-2">
                        <Col span={24} className="text-right">
                            <Text>Date: {new Date(application.created_at).toLocaleDateString()}</Text>
                        </Col>
                    </Row>

                    <Divider />


                </div>
                <Title level={3} style={{ textAlign: "center", color: "#333" }}>ACCEPTANCE FEE RECEIPT</Title>
                <Divider />
                <Paragraph>
                    <Text strong>Student Name:</Text> {application.surname + ' ' + application.other_names}<br/>
                    <Text strong>Matric Number:</Text> {application.matric_number}<br/>
                    <Text strong>Department:</Text> {application.course}<br/>
                    <Text strong>Academic Session:</Text> 2024/2025
                </Paragraph>
                <Divider />
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Amount (₦)</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Date</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>Acceptance Fee</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>3,000.00</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{new Date(application.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{application.application_reference || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
                <Divider />
                <Paragraph>
                    <Text strong>Total Amount Paid:</Text> ₦3,000.00<br/>
                    <Text strong>Payment Method:</Text> Online Payment
                </Paragraph>
                <Divider />
                <Paragraph>
                    This receipt serves as confirmation of your acceptance fee payment. Please keep it for your records.
                </Paragraph>
                <Divider />
                <Paragraph style={{ textAlign: "center" }}>
                    <Text strong>OFFICIAL RECEIPT</Text><br/>
                    <Text>Niger State College of Education</Text>
                </Paragraph>
                <Paragraph style={{ textAlign: "right" }}>
                    <Text strong>Bursary Department</Text><br/>
                    <Text>Date: {new Date().toLocaleDateString()}</Text>
                </Paragraph>
            </Card>
        </div>
        </>
    );
};

export default Acceptance_Receipt;
