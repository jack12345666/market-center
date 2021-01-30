import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Divider ,Select, Modal } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import OrderDetail from '../components/orderDetail'

const namespace = 'shop'
const { Option } = Select
const { confirm } = Modal

@connect(({ shop, loading }) => ({ shop, dataLoading: loading.effects[`${namespace}/fetchMyOrderList`] }))
class MyOrder extends Component {
    state = {
        showDetial: false,
        orderId: null,
        storeId: null,
    }

    componentDidMount() {
      document.title = '钱塘投资之家 - 我的订单'
        this.props.dispatch({
            type: `${namespace}/fetchMyOrderList`
        })
    }

    componentWillUnmount() {
      let searchConf = {
        currentPage: 1,
        pageSize: 10,
        status: ''
      }
      this.props.dispatch({
        type: `${namespace}/changeMyOrderConf`,
        payload: searchConf,
      });
    } 

    onSearchChange = value => {
        const { myOrderConf } = this.props[namespace];
        myOrderConf.currentPage = 1;
        myOrderConf.status = value
        this.props.dispatch({
          type: `${namespace}/changeMyOrderConf`,
          payload: myOrderConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchMyOrderList`,
        })
    }

    handleTableChange = pagination => {
      console.log(pagination)
        const { myOrderConf } = this.props[namespace];
        myOrderConf.currentPage = pagination.current;
        myOrderConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeMyOrderConf`,
          payload: myOrderConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchMyOrderList`,
        })
    }

    onDetail = (record) => {
        this.setState({
            orderId: record.id,
            storeId: record.storeid
        })
        this.setState({
            showDetial: true
        })
    }

    cancelDetail = () => {
        this.setState({
            showDetial: false
        })
        this.setState({
            orderId: null,
            storeId: null,
        })
    }

    ondel = (record) => {
    confirm({
        title: '确定取消此订单吗？',
        okText: '确定',
        cancelText: '取消',
        onOk :() => {
            this.props.dispatch({
                type: `${namespace}/delMyOrder`,
                payload: record.id
            })
        },
        onCancel() {
            console.log('Cancel');
        }
     })
    }

    render() {
        const { showDetial, orderId, storeId } = this.state
        const { myOrderList, myOrderTotal, myOrderConf } = this.props[namespace]
        const { dataLoading } = this.props
        const columns = [
            { title: '订单编号', dataIndex: 'no', align: 'center' },
            { title: '商品名称',
              dataIndex: 'goodsNames',
              align: 'center',
              width: 200,
              onCell: () => ({
                  style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 200,
                  },
                }),
              render: text => (
                <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
              ),
            },
            { title: '店铺名称',
            dataIndex: 'storename',
            align: 'center',
            width: 150,
            onCell: () => ({
                style: {
                  whiteSpace: 'nowrap',
                  maxWidth: 150,
                },
              }),
            render: text => (
              <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
            ),
          },
        { title: '状态',width: '150px', dataIndex: 'statusStr', align: 'center' },
        { title: '下单时间',width: '150px', dataIndex: 'addtime', align: 'center' },
        {
        title: '操作',
        dataIndex: 'x',
        align: 'center',
        onCell: () => ({
            style: {
              whiteSpace: 'nowrap',
              maxMin: 150,
            },
          }),
        render: (text, record) => {
            return (
                <span>
                    <Button type="primary"  onClick={() => { this.onDetail(record) }}> 查看 </Button> 
                    <Divider type="vertical" />
                    <Button type="danger" disabled={record.status === 10 ? false : true}  onClick={() => { this.ondel(record) }}> 取消 </Button>
                </span>
            )
          }
         }
        ]  
        const pagination = {
            pageSize: myOrderConf.pageSize,
            total: myOrderTotal,
            showQuickJumper: true,
            current: myOrderConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }

        return (
             <div>
               <span style={{marginRight: '15px'}}>订单状态</span> 
                <Select
                    style={{ width: 150, marginBottom: '20px', marginTop: '10px'}}
                    placeholder="请选择订单状态"
                    onChange={this.onSearchChange}
                >   <Option value="">全部</Option>
                    <Option value="10">待确认</Option>
                    <Option value="20">已完成</Option>
                    <Option value="0">已取消</Option>
                    <Option value="30">审核驳回</Option>
                </Select>
                <Table
                    className="gobal-table"
                    rowKey="id"
                    columns={columns}
                    dataSource={myOrderList}
                    loading={dataLoading}
                    pagination={pagination}
                    onChange={this.handleTableChange}
               />   
               { showDetial && <OrderDetail  onCancel={this.cancelDetail} orderId={orderId} storeId={storeId} showStoreInfo={true}/>} 
            </div>  
        )
    }
}

export default MyOrder
