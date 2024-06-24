import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Menu, Button } from 'antd';
import {  
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const App = () => {
  const [menuData, setMenuData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginResp = await axios.post('http://appnox-tm.it/api/login', {
          user: 'AdminPro',
          password: 'Mnop@1234',
        });

        const accessToken = loginResp.data.result.key;
        console.log('accessToken:', accessToken);

        const menuTreeResponse = await axios.get('http://appnox-tm.it/api/v1/menu/tree', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log('Menu Tree:', menuTreeResponse.data.result.data);

        const formattedMenuData = formatMenuData(menuTreeResponse.data.result.data);
        setMenuData(formattedMenuData);
      } catch (error) {
        console.log('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const formatMenuData = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          key: item.menuId,
          label: item.item,
          children: formatMenuData(item.children),
        };
      } else {
        return {
          key: item.menuId,
          label: item.item,
        };
      }
    });
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        width: 256,
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={menuData}
      />
    </div>
  );
};

export default App;
