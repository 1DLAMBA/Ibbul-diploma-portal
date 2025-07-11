import React, { useState, useEffect } from "react";
import { Form, Select, Input, Row, Col, Button, Card, message } from "antd";

const { Option } = Select;

const ExaminationForm = () => {
  const [examTypes, setExamTypes] = useState([]);
  const [grades, setGrades] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [selectedExamType, setSelectedExamType] = useState("");

  useEffect(() => {
    // Mock API data
    setExamTypes([
      { id: 1, exam_type: "WAEC", exam_code: "W" },
      { id: 3, exam_type: "NECO", exam_code: "N" },
      { id: 6, exam_type: "NABTEB", exam_code: "T" },
      { id: 7, exam_type: "GRADE II TEACHERS CERT.", exam_code: "G" },
      { id: 8, exam_type: "NBAIS", exam_code: "NB" },
    ]);

    setGrades({
      W: ["A1", "B2", "B3", "C4", "C5", "C6", "A.R"],
      N: ["A1", "B2", "B3", "C4", "C5", "C6", "A.R"],
      T: ["A1", "B2", "B3", "C4", "C5", "C6", "A.R"],
      G: ["A", "B", "C", "D", "A.R"],
      NB: ["A", "B2", "B3", "C5", "C6", "A.R"],
    });

    setSubjects([
      "Mathematics",
      "English Language",
      "Biology",
      "Chemistry",
      "Physics",
      "Geography",
      "Economics",
    ]);
  }, []);

  const handleExamTypeChange = (value) => {
    setSelectedExamType(value);
  };

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
    message.success("Form submitted successfully!");
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
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
        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label="Examination Type"
                name="examType"
                rules={[{ required: true, message: "Please select an exam type!" }]}
              >
                <Select placeholder="Select Type" onChange={handleExamTypeChange}>
                  {examTypes.map((exam) => (
                    <Option key={exam.id} value={exam.exam_code}>
                      {exam.exam_type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Examination Number"
                name="examNumber"
                rules={[{ required: true, message: "Please enter the exam number!" }]}
              >
                <Input placeholder="Enter Examination Number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Examination Month"
                name="examMonth"
                rules={[{ required: true, message: "Please select the month!" }]}
              >
                <Select placeholder="Select Month">
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(
                    (month) => (
                      <Option key={month} value={month}>
                        {month}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Examination Year"
                name="examYear"
                rules={[{ required: true, message: "Please enter the year!" }]}
              >
                <Input placeholder="Enter Examination Year" />
              </Form.Item>
            </Col>
          </Row>

          {[...Array(9)].map((_, index) => (
            <Row gutter={24} key={index}>
              <Col span={12}>
                <Form.Item
                  label={`Subject ${index + 1}`}
                  name={`subject${index + 1}`}
                  rules={[{ required: index < 5, message: "Please select a subject!" }]}
                >
                  <Select placeholder="Select Subject">
                    {subjects.map((subject) => (
                      <Option key={subject} value={subject}>
                        {subject}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={`Grade ${index + 1}`}
                  name={`grade${index + 1}`}
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

          <Row justify="center">
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#028f64",
                  borderColor: "#028f64",
                  padding: "10px 40px",
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ExaminationForm;
