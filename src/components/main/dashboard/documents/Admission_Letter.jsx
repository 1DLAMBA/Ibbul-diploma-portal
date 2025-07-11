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

const Admission_Letter = () => {
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
            pdf.save("admission_letter.pdf");
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

            <Breadcrumb style={{ margin: ' 1% auto', backgroundColor: 'white', width: '82.5%', color: 'white', borderRadius: '15px', padding: '0.5%' }} itemRender={itemRender} items={items} />
            <div className="" style={{ padding: 20, textAlign: "center", backgroundColor: 'white', backgroundSize: "contain" }}>

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
                    <Button type="primary" icon={<PrinterFilled />} ghost onClick={handlePrint} >
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
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Row align="middle" justify="space-around">
                            <Col span={16}>
                                <Title type="success" level={3} className="text-green-600 m-auto">NIGER STATE COLLEGE OF EDUCATION</Title>
                            </Col>

                        </Row>
                        <Row className="mt-2" gutter={[0, 4]} justify="space-between" >
                            <Col style={{ textAlign: "left" }} span={10}>
                                <Text strong>Provost:</Text> Professor Yakubu M. Auna
                                <br />
                                <Text>B. Sc, MSc</Text>
                                <br />
                                <Text strong>Registrar:</Text> Haj. Zainab Sidi Aliyu

                            </Col>
                            <Col span={4}>

                                <img src={logo} alt="User" style={{ width: '100px' }} />
                            </Col>


                            <Col style={{ textAlign: "right" }} span={9} className="text-right">
                                <Text>Private mail bag 39,</Text>
                                <br />
                                <Text>Telephone: 080-232060 222205</Text>

                                <br />
                                <Text>E-mail: coedu@yahoo.com</Text>
                                <br />
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
                    <Title level={3} style={{ textAlign: "center", color: "#333" }}>Offer of Provisional Admission for 2024/2025</Title>
                    <Paragraph>
                        Hello, <b>{application.surname + ' ' + application.other_names}</b> <br />
                        After due consideration of your recent application seeking admission into this college,
                        we are pleased to inform you that you have been offered provisional admission for the academic session of 2024/2025
                        for Nigeria Certificate in Education(NCE) in the department of <b> {application.course}</b> with Matric Number <b>{application.matric_number}</b>.
                    </Paragraph>
                    <Paragraph>You are expected to report to the college with the following documents for registration:</Paragraph>
                    <ul>
                        <li>Letter of offer of provisional admission</li>
                        <li>Original copies of Certificates or Statement of Results</li>
                        <li>Original Birth Certificate or Declaration of Age</li>
                        <li>Medical Certificate of Fitness</li>
                        <li>Proof of State of Origin</li>
                        <li>Six (6) Passport-size Photographs</li>
                        <li>Four (4) File Jackets (Available in the College)</li>
                    </ul>
                    <Paragraph>Late registration will attract a penalty.</Paragraph>
                    <Paragraph>
                        If any false declaration is discovered, the admission will be withdrawn and the student expelled. No change of name is allowed after registration.
                    </Paragraph>
                    <Paragraph>All admitted students must pay the required registration fee immediately.</Paragraph>
                    <Divider />
                    <Title level={4} style={{ textAlign: "center", color: "#028f64" }}>Congratulations!</Title>
                    <Paragraph style={{ textAlign: "right" }}><strong>Academic Secretary</strong></Paragraph>
                </Card>
            </div>
        </>
    );
};

export default Admission_Letter;
