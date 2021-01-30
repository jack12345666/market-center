import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Divider ,Select, Modal, Input, Radio, message } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import style from './index.scss'
import OrderDetail from '../../components/orderDetail'

const namespace = 'shop'
const { Option } = Select
const { TextArea } = Input

@connect(({ shop, loading }) => ({ shop, dataLoading: loading.effects[`${namespace}/fetchOrderManageList`] }))
class OrderManage extends Component {
    state = {
        showDetial: false,
        orderId: null,
        checkRadio: null,
        remark: '',
        storeId: null,
    }

    componentDidMount() {
       document.title = '钱塘投资之家 - 订单管理'
        this.props.dispatch({
            type: `${namespace}/fetchOrderManageList`
        })
    }

    componentWillUnmount() {
        let searchConf = {
          currentPage: 1,
          pageSize: 10,
          status: ''
        }
        this.props.dispatch({
          type: `${namespace}/changeOrderManageConf`,
          payload: searchConf,
        });
      } 

    onSearchChange = value => {
        const { orderManageConf } = this.props[namespace];
        orderManageConf.currentPage = 1;
        orderManageConf.status = value
        this.props.dispatch({
          type: `${namespace}/changeOrderManageConf`,
          payload: orderManageConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchOrderManageList`,
        })
    }

    handleTableChange = pagination => {
        const { orderManageConf } = this.props[namespace];
        orderManageConf.currentPage = pagination.current;
        orderManageConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeOrderManageConf`,
          payload: orderManageConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchOrderManageList`,
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
            storeId: null
        })
    }

    onCheck = (record) => {
     this.setState({
        orderId: record.id
     })  
     this.props.dispatch({
         type: `${namespace}/changeShowCheck`,
         payload: true
     })
    }

    onRadioChange = e => {
        this.setState({
          checkRadio: e.target.value,
        })
      }

    onRemarkChange = ({ target: { value } }) => {
        this.setState({ remark: value })
    }

    handleCheckCancel = () => {
      this.props.dispatch({
          type: `${namespace}/changeShowCheck`,
          payload: false
      })
      this.setState({
        orderId: null
      })  
    }

    toCheck = () => {
      const {remark, checkRadio, orderId} = this.state
      if(checkRadio === null) {
        message.error('请选择审核意见')
        return
      }
      if(checkRadio === 0 && !remark) {
            message.error('请填写审核说明')
            return
      }
      let data = {
        objId: orderId,
        status: checkRadio,
        type: 2,
        cont: remark
      }
      this.props.dispatch({
          type: `${namespace}/toCheckOrder`,
          payload: data
      })
    }

    render() {
        const { showDetial, orderId, remark, checkRadio, storeId } = this.state
        const { orderManageList, orderManageTotal, orderManageConf, showCheck } = this.props[namespace]
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
        width: 150,
        onCell: () => ({
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 150,
            },
          }),
        render: (text, record) => {
            return (
                <span>
                    <Button type="primary"  onClick={() => { this.onDetail(record) }}> 查看 </Button> 
                    <Divider type="vertical" />
                    <Button type="danger" disabled={record.status === 10 ? false : true}  onClick={() => { this.onCheck(record) }}> 审核 </Button>
                </span>
            )
          }
         }
        ]  
        const pagination = {
            pageSize: orderManageConf.pageSize,
            total: orderManageTotal,
            showQuickJumper: true,
            current: orderManageConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }

        return (
             <div className={style.box}>
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
                    dataSource={orderManageList}
                    loading={dataLoading}
                    pagination={pagination}
                    onChange={this.handleTableChange}
               />   
               { showDetial && <OrderDetail  onCancel={this.cancelDetail} orderId={orderId} storeId={storeId} showStoreInfo={false}/>} 
               {
                 <Modal
                    title="审核订单"
                    visible={showCheck}
                    onOk={this.toCheck}
                    onCancel={this.handleCheckCancel}
                    okText ='确定'
                    cancelText= '取消'
                    
                >
                    <div className={style.textArea}>   
                    <div className={style.item}>
                       <div className={style.label}>审核意见</div>
                        <div className={style.value}>
                        <Radio.Group onChange={this.onRadioChange} value={checkRadio}>
                            <Radio value={1}>审核通过</Radio>
                            <Radio value={0}>审核不通过</Radio>
                        </Radio.Group>
                     </div>
                    </div>
                      <div className={style.item}>
                       <div className={style.label}>审核说明</div>
                        <div className={style.value}>
                         <TextArea
                            value={remark}
                            onChange={this.onRemarkChange}
                            placeholder="请填写审核说明"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                     </div>
                    </div>
                </div> 
                </Modal>   
               } 
            </div>  
        )
    }
}

export default OrderManage
