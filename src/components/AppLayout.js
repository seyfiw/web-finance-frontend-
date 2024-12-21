import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  TransactionOutlined,
  UserOutlined,
  LogoutOutlined 
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">แดชบอร์ด</Link>
    },
    {
      key: 'transactions',
      icon: <TransactionOutlined />,
      label: <Link to="/transactions">รายการธุรกรรม</Link>
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">โปรไฟล์</Link>
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ออกจากระบบ',
      className: 'mt-auto'
    }
  ];

  return (
    <Layout className="min-h-screen">
      <Sider collapsible>
        <div className="p-4 text-white text-xl font-bold">Finance App</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white p-0" />
        <Content className="m-6 p-6 bg-white">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;