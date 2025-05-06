import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FrownOutlined } from '@ant-design/icons'; // Ant Design icon

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Result
      icon={<FrownOutlined style={{ fontSize: '64px', color: '#f5222d' }} />}
      title="Unauthorized Access"
      subTitle="Sorry, you do not have permission to view this page."
      extra={
        <Button type="primary"  style={{backgroundColor: "#035E7B"}} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      }
    />
  );
};

export default Unauthorized;
