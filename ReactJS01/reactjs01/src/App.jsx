import { useContext, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import AppHeader from './components/layout/header.jsx';
import { AuthContext } from './components/context/auth.context';
import { Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

function App() {
  const { appLoading } = useContext(AuthContext);

  useEffect(() => {
    // fetchUser đã được gọi trong AuthWrapper, không cần gọi lại ở đây
  }, []);

  return (
    <>
      {appLoading === true ? (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Spin />
        </div>
      ) : (
        <Layout>
          <Header>
            <AppHeader />
          </Header>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      )}
    </>
  );
}

export default App;