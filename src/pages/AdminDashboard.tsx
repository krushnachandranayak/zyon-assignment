// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { Layout, Menu, Button, Space, message, Card, Table, Form, Input, Select, DatePicker, Popconfirm } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, // <--- ADDED ResponsiveContainer HERE
  PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

// Dummy data for the table
interface User {
  key: string;
  name: string;
  age: number;
  address: string;
  status: 'active' | 'inactive';
}

const initialUsers: User[] = [
  { key: '1', name: 'John Doe', age: 32, address: 'New York', status: 'active' },
  { key: '2', name: 'Jane Smith', age: 28, address: 'London', status: 'inactive' },
  { key: '3', name: 'Bob Johnson', age: 45, address: 'Sydney', status: 'active' },
  { key: '4', name: 'Alice Williams', age: 23, address: 'Paris', status: 'active' },
  { key: '5', name: 'Krushna', age: 23, address: 'BBSR', status: 'inactive' },
    { key: '6', name: 'Zyon Admin', age: 30, address: 'Zyon HQ', status: 'active' },
    { key: '7', name: 'Test User', age: 29, address: 'Test City', status: 'inactive' },
    { key: '8', name: 'Demo User', age: 35, address: 'Demo Town', status: 'active' },
    { key: '9', name: 'Sample User', age: 40, address: 'Sample Village', status: 'inactive' },
    { key: '10', name: 'Example User', age: 50, address: 'Example Place', status: 'active' }
];
// Dummy data for charts
const monthlyData = [
  { name: 'Jan', users: 4000, new: 2400 },
  { name: 'Feb', users: 3000, new: 1398 },
  { name: 'Mar', users: 2000, new: 9800 },
  { name: 'Apr', users: 2780, new: 3908 },
  { name: 'May', users: 1890, new: 4800 },
  { name: 'Jun', users: 2390, new: 3800 },
  { name: 'Jul', users: 3490, new: 4300 },
];

const statusData = [
  { name: 'Active', value: 3120 },
  { name: 'Inactive', value: 2312 }, // Use a value that makes sense with total users from cards or initialUsers
];
const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#00C49F']; // Colors for pie chart segments

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [form] = Form.useForm(); // For the user form

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        message.info('You have been logged out.');
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success('Successfully logged out!');
    } catch (error) {
      console.error("Logout Error:", error);
      message.error("Failed to log out.");
    }
  };

  // Table Columns definition
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'inactive') => (
        <span className={status === 'active' ? 'text-green-500' : 'text-red-500'}>
          {status.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => message.info(`Editing ${record.name}`)}></Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle delete action (dummy for now)
  const handleDelete = (key: string) => {
    const newUsers = users.filter((user) => user.key !== key);
    setUsers(newUsers);
    message.success(`User with key ${key} deleted.`);
  };

  // Handle form submission (dummy for now)
  interface UserFormValues {
    name: string;
    age: number;
    address?: string;
    dob?: Date;
  }

  const onFinish = (values: UserFormValues) => {
    console.log('Received values of form:', values);
    message.success('User added/updated successfully!');
    form.resetFields(); // Clear the form
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo-vertical p-4 text-white text-xl font-bold">Zyon Admin</div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} className="flex justify-end pr-4">
          <Space>
            <span className="text-lg font-medium">Hello, Admin!</span>
            <Button type="default" icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#fff',
              borderRadius: 8,
            }}
          >
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Data Summary Cards (Responsive & Improved Design) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 w-full">
              <Card
                bordered={false}
                className="w-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
                bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}
                style={{ background: 'linear-gradient(90deg, #e3f0ff 0%, #f9fbff 100%)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <UserOutlined className="text-blue-500 text-2xl" />
                  <span className="text-lg font-semibold text-gray-700">Total Users</span>
                </div>
                <p className="text-4xl font-extrabold text-blue-600">5,432</p>
              </Card>
              <Card
                bordered={false}
                className="w-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
                bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}
                style={{ background: 'linear-gradient(90deg, #e6fffa 0%, #f0fff4 100%)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <DashboardOutlined className="text-green-500 text-2xl" />
                  <span className="text-lg font-semibold text-gray-700">Active Users</span>
                </div>
                <p className="text-4xl font-extrabold text-green-600">3,120</p>
              </Card>
              <Card
                bordered={false}
                className="w-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
                bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}
                style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #faf5ff 100%)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart className="text-purple-500 text-2xl" />
                  <span className="text-lg font-semibold text-gray-700">New Signups</span>
                </div>
                <p className="text-4xl font-extrabold text-purple-600">125</p>
              </Card>
            </div>

            {/* Charts Section */}
            <h2 className="text-2xl font-bold mb-4 mt-8">User Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"> {/* Grid for charts */}
                {/* Bar Chart */}
                <Card title="Monthly User Growth" bordered={false}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={monthlyData}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="users" fill="#8884d8" name="Total Users" />
                            <Bar dataKey="new" fill="#82ca9d" name="New Users" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Pie Chart */}
                <Card title="User Status Distribution" bordered={false}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                            >
                                {statusData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">User Management</h2>
            <Card
                variant="outlined"
                className="shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-8"
                style={{
                    borderRadius: 16,
                    background: 'linear-gradient(90deg, #f0f7ff 0%, #f9fafb 100%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
                styles={{ body: { padding: '2rem', minWidth: 0 } }}
            >
                <div className="w-full">
                    <Table
                        columns={columns}
                        dataSource={users}
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: false,
                            position: ['bottomCenter'],
                            className: 'custom-pagination',
                        }}
                        bordered
                        rowClassName={(_, idx) =>
                            idx % 2 === 0
                                ? 'bg-blue-50 hover:bg-blue-100 transition'
                                : 'bg-white hover:bg-blue-50 transition'
                        }
                        className="rounded-xl"
                        scroll={{ x: true }}
                    />
                </div>
            </Card>
            <style>
                {`
                    .custom-pagination .ant-pagination-item-active {
                        background: #2563eb !important;
                        border-color: #2563eb !important;
                        color: #fff !important;
                    }
                    .custom-pagination .ant-pagination-item:hover {
                        border-color: #2563eb !important;
                        color: #2563eb !important;
                    }
                    .ant-table-thead > tr > th {
                        background: #e0e7ff !important;
                        color: #1e293b !important;
                        font-weight: 700;
                        font-size: 1rem;
                    }
                    .ant-table-tbody > tr > td {
                        font-size: 1rem;
                    }
                    /* Remove left/right margin and make table full width */
                    .ant-table-wrapper {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        width: 100% !important;
                    }
                    /* Responsive tweaks */
                    @media (max-width: 600px) {
                        .ant-table {
                            font-size: 0.9rem;
                        }
                        .ant-table-thead > tr > th,
                        .ant-table-tbody > tr > td {
                            padding: 6px 4px;
                        }
                    }
                    @media (max-width: 1024px) {
                        .ant-table {
                            font-size: 0.95rem;
                        }
                        .ant-table-thead > tr > th,
                        .ant-table-tbody > tr > td {
                            padding: 10px 8px;
                        }
                    }
                    @media (max-width: 768px) {
                        .ant-table {
                            font-size: 0.92rem;
                        }
                        .ant-table-thead > tr > th,
                        .ant-table-tbody > tr > td {
                            padding: 8px 6px;
                        }
                    }
                `}
            </style>

            <h2 className="text-3xl text-center text-blue-400 font-extrabold mb-4 mt-8">Add/Edit User</h2>
            <div className="flex flex-col items-center w-full">
              <Form
                form={form}
                name="user_form"
                onFinish={onFinish}
                layout="vertical"
                initialValues={{ status: 'active' }}
                className="w-full max-w-xl bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 rounded-xl shadow-lg"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '2rem' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    name="name"
                    label={<span className="font-semibold">User Name</span>}
                    rules={[{ required: true, message: 'Please input the user name!' }]}
                  >
                    <Input placeholder="Enter user name" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="age"
                    label={<span className="font-semibold">Age</span>}
                    rules={[{ required: true, message: 'Please input the age!' }]}
                  >
                    <Input type="number" placeholder="Enter age" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label={<span className="font-semibold">Address</span>}
                    className="md:col-span-2"
                  >
                    <Input placeholder="Enter address" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label={<span className="font-semibold">Status</span>}
                    rules={[{ required: true, message: 'Please select a status!' }]}
                  >
                    <Select placeholder="Select status" size="large">
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="dob"
                    label={<span className="font-semibold">Date of Birth</span>}
                  >
                    <DatePicker style={{ width: '100%' }} size="large" />
                  </Form.Item>
                </div>
                <Form.Item className="mb-0 mt-6 flex justify-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Submit User
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Zyon Technology ©2025 Created by Mr. Sunil</Footer>
      </Layout>
    </Layout>
  );
}

export default AdminDashboard;