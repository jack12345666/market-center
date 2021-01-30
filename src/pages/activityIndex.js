import React, { Component } from 'react';
import { Menu, Breadcrumb } from 'antd';
import { Route, Link  } from 'dva/router';
import { FileTextOutlined, UserOutlined, FormOutlined, HddOutlined } from '@ant-design/icons';
import MyHeader from '@/components/header/Header'
import MyFooter from '@/components/footer/Footer'
import MyActivity from  '@/pages/activity/myActivity'
import ActivityList from  '@/pages/activity/activityList'
import AddActivity from '@/pages/activity/add'
import EditActivity from '@/pages/activity/edit'

import { LOGINURL } from '@/utils/config'
import Style  from './index.scss'

class Index extends Component {
    render() {
        const openKeysObj  = {}
        const selectedKeyObj = {
            '#/activity': ['1'],
            '#/activity/addActivity/': ['2'],
            '#/activity/activityList/': ['3'],
        }
        return (
            <div className={Style.container}>
                <div style={{ background: '#fff', height: '115px' }}>
                    <MyHeader />
                </div>
                <Breadcrumb style={{ background: '#fff', borderTop: '1px solid #f5f5f5', padding: '10px 10%' }}>
                    <Breadcrumb.Item>你所在的位置</Breadcrumb.Item>
                    <Breadcrumb.Item><a style={{ color: '#000' }} href={LOGINURL + '/user/mcenter.html'}>个人中心</a></Breadcrumb.Item>
                    <Breadcrumb.Item>活动安排</Breadcrumb.Item>
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
                                <span style={{ fontSize: '18px' }}>活动安排</span>
                            </Menu.Item>
                            <Menu.Item key="1" icon={<FileTextOutlined />}><Link to="/activity">参与的活动</Link></Menu.Item>
                            <Menu.Item key="2" icon={<FormOutlined />}><Link to="/activity/addActivity/">发布新活动</Link></Menu.Item>
                            <Menu.Item key="3" icon={<HddOutlined />}><Link to="/activity/activityList/">发布的活动</Link></Menu.Item>
                        </Menu>
                    </div>
                    <div className={Style.right} style={{ minHeight: window.innerHeight - 360 }}>
                       <Route exact path="/activity"  component={MyActivity} />
                       <Route exact path="/activity/addActivity/" component={AddActivity} />
                       <Route exact path="/activity/activityList/" component={ActivityList} />
                       <Route exact path="/activity/editActivity/" component={EditActivity} />
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