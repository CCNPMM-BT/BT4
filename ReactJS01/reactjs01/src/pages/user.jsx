import { getUserApi } from '../util/apis';
import { useEffect, useState } from 'react';
import { Table, notification, Spin } from 'antd';

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await getUserApi();
                if (res && (res.EC === 0 || res.success === true)) {
                    const raw = res?.data ?? res?.DT ?? res?.users ?? res?.items ?? res;
                    const arrayData = Array.isArray(raw) ? raw : [];
                    setDataSource(arrayData);
                } else {
                    notification.error({
                        message: 'Error',
                        description: res?.EM ?? 'Failed to fetch users'
                    });
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                notification.error({
                    message: 'Error',
                    description: 'Network error or server error'
                });
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role'
        }
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>User Management</h2>
            <Table 
                columns={columns} 
                dataSource={dataSource} 
                rowKey={'_id'}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true
                }}
            />
        </div>
    );
}

export default UserPage;