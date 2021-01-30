import React, { Component } from 'react';
import { Menu, Breadcrumb } from 'antd';
import { Route, Link  } from 'dva/router';
import { GiftOutlined, FileTextOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import MyHeader from '@/components/header/Header'
import MyFooter from '@/components/footer/Footer'
import MyOrder from '@/pages/customer'
import OrderManage from '@/pages/seller/order'
import StoreList from '@/pages/seller/store'
import EditStore from '@/pages/seller/store/edit'
import AddStore from '@/pages/seller/store/add'
import GoodsList from '@/pages/seller/goods'
import EditGoods from '@/pages/seller/goods/edit'
import AddGoods from '@/pages/seller/goods/add'

import { LOGINURL } from '@/utils/config'
import Style  from './index.scss'

const { SubMenu } = Menu;

class Index extends Component {
 
    render() {
        const openKeysObj  = {
            // '#/personCenter/': ['sub1'],
            // '#/personCenter/orderManage/': ['sub2'],
            '#/personCenter/addStore/': ['sub1'],
            '#/personCenter/storeList/': ['sub1'],
            '#/personCenter/addGoods/': ['sub2'],
            '#/personCenter/goodsList/': ['sub2'],
        }
        const selectedKeyObj = {
            '#/personCenter': ['1'],
            '#/personCenter/orderManage/': ['2'],
            '#/personCenter/addStore/': ['3'],
            '#/personCenter/storeList/': ['4'],
            '#/personCenter/addGoods/': ['5'],
            '#/personCenter/goodsList/': ['6'],
        }
        return (
            <div className={Style.container}>
                <div style={{ background: '#fff', height: '115px' }}>
                    <MyHeader />
                </div>
                <Breadcrumb style={{ background: '#fff', borderTop: '1px solid #f5f5f5', padding: '10px 10%' }}>
                    <Breadcrumb.Item>你所在的位置</Breadcrumb.Item>
                    <Breadcrumb.Item><a style={{ color: '#000' }} href={LOGINURL + '/user/mcenter.html'}>个人中心</a></Breadcrumb.Item>
                    <Breadcrumb.Item>资源/服务管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className={Style.content}>
                    <div className={Style.left}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={selectedKeyObj[window.location.hash]}
                            defaultOpenKeys={openKeysObj[window.location.hash]}
                            style={{ height: '100%', width: '200px' }}
                        >
                            <Menu.Item style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <UserOutlined style={{ fontSize: '20px' }} />
                                <span style={{ fontSize: '18px' }}>买家中心</span>
                            </Menu.Item>
                            <Menu.Item key="1" icon={<FileTextOutlined />}><Link to="/personCenter">订单管理</Link></Menu.Item>
                            <div style={{ height: '10px', background: '#f0f2f5' }}></div>
                            <Menu.Item style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <ShopOutlined style={{ fontSize: '20px' }} />
                                <span style={{ fontSize: '18px' }}>卖家中心</span>
                            </Menu.Item>
                            <Menu.Item key="2" icon={<FileTextOutlined />}><Link to="/personCenter/orderManage/">订单管理</Link></Menu.Item>
                            <SubMenu key="sub1" icon={<ShopOutlined />} title="店铺管理">
                                <Menu.Item key="3"><Link to="/personCenter/addStore/">新增店铺</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="/personCenter/storeList/">店铺列表</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<GiftOutlined />} title="商品管理">
                                <Menu.Item key="5"><Link to="/personCenter/addGoods/">新增商品</Link></Menu.Item>
                                <Menu.Item key="6"><Link to="/personCenter/goodsList/">商品列表</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                    <div className={Style.right} style={{ minHeight: window.innerHeight - 360 }}>
                       <Route exact path="/personCenter"  component={MyOrder} />
                       <Route exact path="/personCenter/orderManage/"  component={OrderManage} />
                       <Route exact path="/personCenter/storeList/"  component={StoreList} />
                       <Route exact path="/personCenter/editStore/"  component={EditStore} />
                       <Route exact path="/personCenter/addStore/"  component={AddStore} />
                       <Route exact path="/personCenter/goodsList/"  component={GoodsList} />
                       <Route exact path="/personCenter/editGoods/"  component={EditGoods} />
                       <Route exact path="/personCenter/addGoods/"  component={AddGoods} />
                    </div>
                </div>
                <div className={Style.footer}>
                    <MyFooter />
                </div>
            </div>
        )
    }
}

export default Index;