import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginScreen = ({ onLoginSuccess }) => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const handleLogin = async (values) => {
   setLoading(true);
   try {
     const response = await axios.post('http://localhost:1337/api/auth/local', {
       identifier: values.identifier,
       password: values.password,
     });

     if (response.data.jwt) {
       localStorage.setItem('token', response.data.jwt);
       onLoginSuccess();
     } else {
       setError('ไม่สามารถเข้าสู่ระบบได้');
     }
   } catch (err) {
     setError('ข้อมูลไม่ถูกต้อง');
   } finally {
     setLoading(false);
   }
 };

 return (
   <div style={{ 
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     minHeight: '100vh',
     background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)', // พื้นหลังสีอ่อน
   }}>
     <Card
       style={{
         width: 420,
         boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
         borderRadius: 16,
         border: 'none',
         background: 'rgba(255, 255, 255, 0.98)'
       }}
     >
       <div style={{ textAlign: 'center', marginBottom: 36 }}>
         <Title level={2} style={{ 
           color: '#2c3e50', // สีเข้มแบบสุภาพ
           marginBottom: 0,
           fontWeight: 500,
           fontSize: '28px'
         }}>
           Finance Management
         </Title>
         <p style={{ 
           color: '#7f8c8d', 
           marginTop: 12,
           fontSize: '15px'
         }}>
           เข้าสู่ระบบเพื่อจัดการข้อมูลการเงินของคุณ
         </p>
       </div>

       {error && (
         <Alert
           message={error}
           type="error"
           showIcon
           style={{ 
             marginBottom: 24,
             borderRadius: 8 
           }}
         />
       )}

       <Form
         name="login"
         onFinish={handleLogin}
         layout="vertical"
         size="large"
       >
         <Form.Item
           name="identifier"
           rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้หรืออีเมล' }]}
         >
           <Input 
             prefix={<UserOutlined style={{ color: '#95a5a6' }} />}
             placeholder="ชื่อผู้ใช้หรืออีเมล"
             style={{ 
               borderRadius: 8,
               height: '45px',
               border: '1px solid #e0e0e0'
             }}
           />
         </Form.Item>

         <Form.Item
           name="password"
           rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
         >
           <Input.Password
             prefix={<LockOutlined style={{ color: '#95a5a6' }} />}
             placeholder="รหัสผ่าน"
             style={{ 
               borderRadius: 8,
               height: '45px',
               border: '1px solid #e0e0e0'
             }}
           />
         </Form.Item>

         <Form.Item style={{ marginTop: 24 }}>
           <Button
             type="primary"
             htmlType="submit"
             loading={loading}
             block
             style={{ 
               height: '45px', 
               borderRadius: 8,
               fontSize: '16px',
               fontWeight: 500,
               background: '#2c3e50', // สีเข้มแบบสุภาพ
               border: 'none',
               boxShadow: '0 2px 10px rgba(44, 62, 80, 0.15)'
             }}
           >
             เข้าสู่ระบบ
           </Button>
         </Form.Item>
       </Form>

       <div style={{ 
         textAlign: 'center', 
         marginTop: 16,
         color: '#95a5a6',
         fontSize: '14px' 
       }}>
         ระบบจัดการข้อมูลการเงินส่วนบุคคล
       </div>
     </Card>
   </div>
 );
};

export default LoginScreen;