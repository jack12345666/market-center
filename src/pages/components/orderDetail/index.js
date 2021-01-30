import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Modal, Table } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'
import style from './index.scss'
import { BASEURL } from '@/utils/config'

const namespace = 'shop'

@connect(({ shop }) => ({ shop }))
class MyOrderDetail extends Component {
    componentDidMount() {
        const { orderId, storeId, showStoreInfo } = this.props
        this.props.dispatch({
            type: `${namespace}/fetchOrderDetail`,
            payload: orderId
        })
        if(showStoreInfo) {
           this.props.dispatch({
            type: `${namespace}/fetchStoreDetail`,
            payload: storeId
          }) 
        }
       
    }
    render() {
        const { onCancel, showStoreInfo } = this.props
        const { orderDetail, storeDetail } = this.props[namespace]
        const columns = [
            {
                title: '序号',
                width: 70,
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '商品图片',
                dataIndex: 'goodsimage',
                align: 'center',
                width: 100,
                render: text => (
                    <img alt="商品图片" src={`${BASEURL}${text}`} width='100px' />
                )
            },
            { title: '商品名称',
            dataIndex: 'goodsname',
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
            { title: '商品数量', width: '100px', dataIndex: 'goodsnum', align: 'center' },
            {
              title: '商品价格', width: '100px', dataIndex: 'goodsprice', align: 'center',
                render: text => {
                    if (text === 0) {
                        return '免费'
                    } else if (text > 0) {
                        return '收费'
                    } else {
                        return '面议'
                    }
                }
            },
            { title: '联系方式', width: '180px', dataIndex: 'x', align: 'center', render:(text, record) => {
                return (
                    <div>
                        <div>{record.contact}</div>
                        <div>{record.phone}</div>
                    </div>
                )
            } },
        ]
        return (
            <Modal
                visible={true}
                title="订单详情"
                onCancel={onCancel}
                width="860px"
                maskClosable={false}
                footer={null}
            >
                <div className={style.detail}>
                {orderDetail &&
                        <>
                        <div className={style.title}>订单信息</div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div className={style.item}>
                                        <div className={style.label}>订单号</div>
                                        <div className={style.value}>{orderDetail.no}</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className={style.item}>
                                        <div className={style.label}>状态</div>
                                        <div className={style.value}>{orderDetail.statusStr}</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className={style.item}>
                                        <div className={style.label}>购买日期</div>
                                        <div className={style.value}>{orderDetail.addtime}</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className={style.item}>
                                        <div className={style.label}>收货人</div>
                                        <div className={style.value}>{orderDetail.username}</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className={style.item}>
                                        <div className={style.label}>手机</div>
                                        <div className={style.value}>{orderDetail.userphone}</div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className={style.item}>
                                        <div className={style.label}>邮箱</div>
                                        <div className={style.value}>{orderDetail.useremail}</div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                     }
                        { storeDetail && showStoreInfo &&
                            <>
                               <div className={style.title}>店铺信息</div>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <div className={style.item}>
                                            <div className={style.label}>店铺</div>
                                            <div className={style.value}>{storeDetail.name}</div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className={style.item}>
                                            <div className={style.label}>联系人</div>
                                            <div className={style.value}>{storeDetail.sellername}</div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className={style.item}>
                                            <div className={style.label}>联系方式</div>
                                            <div className={style.value}>{storeDetail.phone}</div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className={style.item}>
                                            <div className={style.label}>营业时间</div>
                                            <div className={style.value}>{storeDetail.workingtime}</div>
                                        </div>
                                    </Col>
                                </Row>      
                            </>
                        }
                        
                    
                    {
                      orderDetail && orderDetail.mallordergoods.length > 0 &&
                        <>
                            <div className={style.title}>商品信息</div>
                            <Table
                                rowKey="id"
                                columns={columns}
                                dataSource={orderDetail.mallordergoods}
                                pagination={false}
                            />
                        </>
                    } 
                </div>
            </Modal>
        )
    }
}

export default MyOrderDetail