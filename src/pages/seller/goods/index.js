import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Table, Divider ,Select, Modal, Input } from 'antd'
import EllipsisTooltip from '@/components/ellipsisTooltip'

const namespace = 'shop'
const { Option } = Select
const { confirm } = Modal
const { Search } = Input

@connect(({ shop, loading }) => ({ shop, dataLoading: loading.effects[`${namespace}/fetchGoodsList`] }))
class GoodsManage extends Component {
    state = {
        storeId: null,
    }

    componentDidMount() {
      document.title = '钱塘投资之家 - 商品列表'
        this.props.dispatch({
            type: `${namespace}/fetchGoodsList`
        })
        let data = {
            currentPage: 1,
            pageSize: 100,
            status: ''
        }
        this.props.dispatch({
            type: `${namespace}/changeStoreListConf`,
            payload: data
        })
        this.props.dispatch({
            type: `${namespace}/fetchStoreList`
        })
    }

    componentWillUnmount() {
        let storeConf = {
          currentPage: 1,
          pageSize: 10,
          status: ''
        }
        this.props.dispatch({
          type: `${namespace}/changeStoreListConf`,
          payload: storeConf,
        })
        let goodsConf = {
            currentPage: 1,
            pageSize: 10,
            storeid: null,
            state: null
        }
        this.props.dispatch({
            type: `${namespace}/changeGoodsConf`,
            payload: goodsConf,
          })
      } 

    onCheckStatus = value => {
        const { goodsConf } = this.props[namespace];
        goodsConf.currentPage = 1;
        goodsConf.state = value
        this.props.dispatch({
          type: `${namespace}/changeGoodsConf`,
          payload: goodsConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchGoodsList`,
        })
    }

    searchName = value => {
      const { goodsConf } = this.props[namespace];
      goodsConf.currentPage = 1;
      goodsConf.name = value
      this.props.dispatch({
        type: `${namespace}/changeGoodsConf`,
        payload: goodsConf,
      });
      this.props.dispatch({
        type: `${namespace}/fetchGoodsList`,
      })
    }

    onCheckStore = value => {
        const { goodsConf } = this.props[namespace];
        goodsConf.currentPage = 1;
        goodsConf.storeid = value
        this.props.dispatch({
          type: `${namespace}/changeGoodsConf`,
          payload: goodsConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchGoodsList`,
        })
    }

    handleTableChange = pagination => {
        const { goodsConf } = this.props[namespace];
        goodsConf.currentPage = pagination.current;
        goodsConf.pageSize = pagination.pageSize;
        this.props.dispatch({
          type: `${namespace}/changeGoodsConf`,
          payload: goodsConf,
        });
        this.props.dispatch({
          type: `${namespace}/fetchGoodsList`,
        })
    }

    onEdit = (record) => {
       this.props.dispatch({
          type: `${namespace}/changeGoodsId`,
          payload: record.id
       })
       this.props.history.push("/personCenter/editGoods/")
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
       let statusName = state === 0 ? '下架' : '上架'
       confirm({
        title: `确定要${statusName}此商品`,
        okText: '确定',
        cancelText: '取消',
        onOk :() => {
          this.props.dispatch({
           type: `${namespace}/toChangeGoodsState`,
           payload: data
          })
        }
      })
    }

    render() {
        const { goodsList, goodsListTotal, goodsConf, storeList } = this.props[namespace]
        const { dataLoading } = this.props
        let storeOptions = []
        if(storeList.length > 0) {
            storeList.forEach(item => {
              storeOptions.push(<Option key={item.id}>{item.name}</Option>)
            })
          }
        storeOptions.unshift(<Option key={''}>{'全部'}</Option>)  
        const columns = [
          { title: '序号',
            width: 70,
            render:(text,record,index)=>`${index+1}`   
            },
            { title: '商品名称',
              dataIndex: 'name',
              align: 'center',
              width: 180,
              onCell: () => ({
                  style: {
                    whiteSpace: 'nowrap',
                    maxWidth: 180,
                  },
                }),
              render: text => (
                <EllipsisTooltip title={text}>{text}</EllipsisTooltip>
              ),
            },
        { title: '商品状态',width: '150px', dataIndex: 'stateStr', align: 'center' },
        { title: '商品库存',width: '150px', dataIndex: 'storage', align: 'center' },
        { title: '商品价格',width: '150px', dataIndex: 'price', align: 'center', render:(text, record) => {
            if(text === 0) {
                return '免费'
            }else if(text === -1) {
                return '面议'
            }else {
                return text
            }
        } },
        { title: '申请时间',width: '150px', dataIndex: 'addtime', align: 'center' },
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
                    <Button type="primary" disabled={(record.state === 0 || record.verify === 10 ) ? true : false}  onClick={() => { this.onEdit(record) }}> 修改 </Button> 
                    {(record.state === 0 || record.state === 1)  && <Divider type="vertical" />}   
                    {
                      record.state === 0 &&  <Button  onClick={() => { this.onChangeState(record) }}> 上架 </Button>
                    }      
                    {
                        record.state === 1 &&  <Button onClick={() => { this.onChangeState(record) }}> 下架 </Button>
                    }
                </span>
            )
          }
         }
        ]  
        const pagination = {
            pageSize: goodsConf.pageSize,
            total: goodsListTotal,
            showQuickJumper: true,
            current: goodsConf.currentPage,
            showTotal: (total, range) => (
              <span>
                目前显示{range[0]}-{range[1]} 条,共 {total} 条
              </span>
            )
        }

        return (
             <div>
                <div style={{display: 'flex', alignContent: 'center', marginTop: '10px'}}>
                <div style={{margin: '5px 15px 0 10px'}}>店铺</div> 
                <Select
                    style={{ width: 150, marginBottom: '20px'}}
                    placeholder="请选择店铺"
                    onChange={this.onCheckStore}>  
                      {storeOptions}
                </Select>
               <div style={{margin: '5px 15px 0 15px'}}>商品状态</div> 
                <Select
                    style={{ width: 150, marginBottom: '20px'}}
                    placeholder="请选择商品状态"
                    onChange={this.onCheckStatus}>   
                    <Option value="">全部</Option>
                    <Option value="1">上架</Option>
                    <Option value="0">下架</Option>
                    <Option value="10">违规（禁售）</Option>
                </Select>
                <Search
                    style={{width: '360px', marginLeft: '20px'}}
                    placeholder="请输入商品名称"
                    enterButton="搜索"
                    size="middle"
                    allowClear={true}
                    onSearch={value => this.searchName(value)}
                  />
               </div>
                <Table
                    className="gobal-table"
                    rowKey="id"
                    columns={columns}
                    dataSource={goodsList}
                    loading={dataLoading}
                    pagination={pagination}
                    onChange={this.handleTableChange}
               />   
            </div>  
        )
    }
}

export default GoodsManage
