import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Divider ,Select, Modal } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'

const namespace = 'shop'
const { Option } = Select
const { confirm } = Modal

@connect(({ shop, loading }) => ({ shop, dataLoading: loading.effects[`${namespace}/fetchStoreList`] }))
class OrderManage extends Component {
    state = {
        storeId: null,
    }

    componentDidMount() {
        document.title = '钱塘投资之家 - 店铺列表'
        this.props.dispatch({
            type: `${namespace}/fetchStoreList`
        })
    }

    componentWillUnmount() {
        let searchConf = {
          currentPage: 1,
          pageSize: 10,
          status: ''
        }
        this.props.dispatch({
          type: `${namespace}/changeStoreListConf`,
          payload: searchConf,
        });
      } 

    onSearchChange = value => {
        const { storeListConf } = this.props[namespace];
        storeListConf.currentPage = 1;
        storeListConf.state = value
        this.props.dispatch({
          type: `${namespace}/changeStoreListConf`,
          payload: storeListConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchStoreList`,
        })
    }

    handleTableChange = pagination => {
        const { storeListConf } = this.props[namespace];
        storeListConf.currentPage = pagination.current;
        storeListConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeStoreListConf`,
          payload: storeListConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchstoreList`,
        })
    }

    onEdit = (record) => {
       this.props.dispatch({
          type: `${namespace}/changeStoreId`,
          payload: record.id
       })
       this.props.history.push("/personCenter/editStore/")
    }

    onChangeState = (record) => {
        let state  = ''
        if(record.state === 1) {
            state = 0
        }else {
            state = 1
        }
       let data = {
           id: record.id,
           state
       }
       let statusName = state === 0 ? '关闭' : '开启'
       confirm({
        title: `确定要${statusName}此店铺`,
        okText: '确定',
        cancelText: '取消',
        onOk :() => {
           this.props.dispatch({
           type: `${namespace}/toChangeStoreStatus`,
           payload: data
          })
        }
      })

      
    }

    render() {
        const { storeList, storeListTotal, storeListConf } = this.props[namespace]
        const { dataLoading } = this.props
        const columns = [
          { title: '序号',
            width: 70,
            render:(text,record,index)=>`${index+1}`   
            },
            { title: '店铺名称',
              dataIndex: 'name',
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
        { title: '联系人',width: '150px', dataIndex: 'username', align: 'center' },
        { title: '联系方式',width: '150px', dataIndex: 'phone', align: 'center' },
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
                    <Button type="primary" disabled={(record.state === 0 || record.state === 2 ) ? true : false}  onClick={() => { this.onEdit(record) }}> 修改 </Button> 
                    {(record.state === 0 || record.state === 1)  && <Divider type="vertical" />}   
                    {
                      record.state === 0 &&  <Button  onClick={() => { this.onChangeState(record) }}> 开启 </Button>
                    }      
                    {
                        record.state === 1 &&  <Button onClick={() => { this.onChangeState(record) }}> 关闭 </Button>
                    }
                </span>
            )
          }
         }
        ]  
        const pagination = {
            pageSize: storeListConf.pageSize,
            total: storeListTotal,
            showQuickJumper: true,
            current: storeListConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }

        return (
             <div>
               <span style={{marginRight: '15px', marginTop: '10px'}}>店铺状态</span> 
                <Select
                    style={{ width: 150, marginBottom: '20px', marginTop: '10px'}}
                    placeholder="请选择店铺状态"
                    onChange={this.onSearchChange}
                >   <Option value="">全部</Option>
                    <Option value="0">关闭</Option>
                    <Option value="1">营业中</Option>
                    <Option value="2">审核中</Option>
                    <Option value="3">审核不通过</Option>
                </Select>
                <Table
                    className="gobal-table"
                    rowKey="id"
                    columns={columns}
                    dataSource={storeList}
                    loading={dataLoading}
                    pagination={pagination}
                    onChange={this.handleTableChange}
               />   
            </div>  
        )
    }
}

export default OrderManage
