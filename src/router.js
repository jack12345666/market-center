import React from 'react';
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { Router, Route, Switch } from 'dva/router'
import Index from './pages/index'
import Activity from './pages/activityIndex'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

function RouterConfig({ history }) {
  return (
    <ConfigProvider locale={zhCN}>
    <Router history={history}>
      <Switch>
        <Route path="/personCenter/"  component={Index} />
        <Route path="/activity/"  component={Activity} />
      </Switch>
    </Router>
    </ConfigProvider>
  );
}

export default RouterConfig;
