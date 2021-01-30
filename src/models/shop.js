import { getListForBuyer, cancelOrder, getOrderDetail, getListForSeller, sellerCheckOrder, getMyStoreList, 
    changeStoreState, getStoreDetail, getCateGory, getCorps, editStore, MyGoodslist, changeGoodsState,
    getGoodsDetail, editGoods } from '@/services/shop'
import { message } from 'antd'
const namespace = 'shop'
export default {
  namespace,
  state: {
    myOrderList: [],
    myOrderConf: {
        currentPage: 1,
        pageSize: 10,
        status: ''
    },
    myOrderTotal: 0,
    orderDetail: null,
    orderManageConf: {
        currentPage: 1,
        pageSize: 10,
        status: ''
    },
    orderManageTotal: 0,
    orderManageList: [],
    showCheck: false,
    storeListConf: {
        currentPage: 1,
        pageSize: 10,
        state: ''
    },
    storeList: [],
    storeListTotal: 0,
    storeId: null,
    storeDetail: null,
    storeType: [],
    companyList: [],
    goodsList: [],
    goodsListTotal: 0,   
    goodsConf: {
        currentPage: 1,
        pageSize: 10,
        storeid: null,
        state: null
    },
    goodsId: null,
    goodsDetail: null,
    serviceTypeList: [], // 服务类别
    serviceObjList: [], // 服务对象
    orgSizeList: [], // 机构规模
    serviceClassList: [], // 服务类型
  },

  effects: {
    *fetchMyOrderList(_, {call, put, select}) { 
      const searchCond = yield select(state => state[namespace].myOrderConf);
      const rsp = yield call(getListForBuyer, searchCond) 
      if(rsp && rsp.code === 0) {
        yield put({ 
            type: 'changeMyOrderList',
            payload: {
                myOrderList: rsp.data.data.items,
                myOrderTotal: rsp.data.data.totalNum
            }
         })
      }
    },
    *delMyOrder({payload}, {call , put}) {
        const rsp = yield call(cancelOrder, payload)
        if(rsp && rsp.code === 0) {                                                                                                                                                                                   
           yield put({ type: 'fetchMyOrderList' }) 
           message.success('操作成功') 
        }
    },
    *fetchOrderDetail({payload}, {call, put}) {
        const rsp = yield call(getOrderDetail, payload)
        if(rsp && rsp.code === 0) {
            yield put({
                type: 'changeOrderDetail',
                payload: rsp.data.data
            })
        }
    },
    *fetchOrderManageList(_, {call, put, select}) {
        const searchCond = yield select(state => state[namespace].orderManageConf);
        const rsp = yield call(getListForSeller, searchCond) 
        if(rsp && rsp.code === 0) {
          yield put({ 
              type: 'changeOrderManageList',
              payload: {
                  orderManageList: rsp.data.data.items,
                  orderManageTotal: rsp.data.data.totalNum
              }
           })
        }
    },
    *toCheckOrder({payload}, {call, put}) {
        const rsp = yield call(sellerCheckOrder, payload)
        if(rsp && rsp.code === 0) {
            message.success('审核成功')
            yield put({
                type: 'changeShowCheck',
                payload: false
            })
            yield put({
                type: 'fetchOrderManageList'
            })
        }
    },
    *fetchStoreList(_, {call, put, select}) { 
        const searchCond = yield select(state => state[namespace].storeListConf);
        const rsp = yield call(getMyStoreList, searchCond) 
        if(rsp && rsp.code === 0) {
          yield put({ 
              type: 'changeStoreList',
              payload: {
                  storeList: rsp.data.data.items,
                  storeListTotal: rsp.data.data.totalNum
              }
           })
        }
      },
      *toChangeStoreStatus({payload}, {call, put}) {
          const rsp = yield call(changeStoreState, payload)
          if(rsp && rsp.code === 0) {
              message.success('店铺状态修改成功')
              yield put({
                  type: 'fetchStoreList'
              })
          }
      },
      *fetchStoreDetail({payload}, {call, put}) {
          const rsp = yield call(getStoreDetail, payload) 
              if(rsp && rsp.code === 0) {
                yield put({
                    type: 'changeStoreDetail',
                    payload: rsp.data.data
               })
          }
      },
      *fetchStoreType(_, {call, put}) {
          const rsp = yield call(getCateGory)
          if(rsp && rsp.code === 0) {
            if(rsp.data.data.length > 0) {
             let arr = rsp.data.data.filter(item => item.category === '0151')
             yield put({
                 type: 'changeStoreType',
                 payload: arr
             }) 
            }
          }
      },
      *fetchCompanyList(_, {call, put}) {
          const rsp = yield call(getCorps) 
          if(rsp && rsp.code === 0) {
             yield put({
                 type: 'changeCompanyList',
                 payload: rsp.data.data
             })
          }
      },
      *editStoreInfo({payload}, {call}) {
          const rsp = yield call(editStore, payload)
          return rsp
      },
      *fetchGoodsList(_, {call, put, select}) {
        const searchCond = yield select(state => state[namespace].goodsConf);
        const rsp = yield call(MyGoodslist, searchCond) 
        if(rsp && rsp.code === 0) {
          yield put({ 
              type: 'changeGoodsList',
              payload: {
                  goodsList: rsp.data.data.items,
                  goodsListTotal: rsp.data.data.totalNum
              }
           })
        }
      },
      *toChangeGoodsState({ payload }, {call, put}) {
          const rsp = yield call(changeGoodsState, payload)
          if(rsp && rsp.code === 0) {
              message.success('商品状态修改成功')
              yield put({
                  type: 'fetchGoodsList'
              })
          }
      },
      *fetchGoodsDetail({payload}, {call, put}) {
          const rsp = yield call(getGoodsDetail, payload)
          if(rsp && rsp.code === 0) {
              yield put({
                  type: 'changeGoodsDetail',
                  payload: rsp.data.data
              })
          }
      },
      *fetchCategoryList({payload}, {call, put}) {
          const rsp = yield call(getCateGory)
          if(rsp && rsp.code === 0) {
            let firstArr = []
            let secondArr = []
            if(rsp.data.data.length > 0) {
                firstArr = rsp.data.data.filter(item => item.category === '0151')
                firstArr.forEach(ritem => {
                  if(payload == ritem.id) {
                      secondArr = ritem.items
                   }
                })
                yield put({
                    type: 'changeServiceTypeList',
                    payload: secondArr
                }) 
                yield put({
                    type: 'changeServiceObjList',
                    payload: rsp.data.data.filter(item => item.category === '0152')
                })
                yield put({
                    type: 'changeOrgSizeList',
                    payload: rsp.data.data.filter(item => item.category === '0153')
                })
                yield put({
                    type: 'changeServiceClassList',
                    payload: rsp.data.data.filter(item => item.category === '0154')
                })
            } 
          } 
      },
      *toEditGoods({ payload }, {call}) {
          const rsp = yield call(editGoods, payload)
          return rsp
      }
          
  },

  reducers: {
    changeMyOrderConf(state, { payload }) {
        return {
            ...state, 
            myOrderConf: payload
        }
    },
    changeMyOrderList(state, {payload}) {
      return { 
        ...state, 
        myOrderList: payload.myOrderList,
        myOrderTotal: payload.myOrderTotal
       }
  },
  changeOrderDetail(state, { payload }) {
      return {
          ...state,
          orderDetail: payload
      }
  },
  changeOrderManageList(state, {payload}) {
      return {
          ...state,
          orderManageList: payload.orderManageList,
          orderManageTotal: payload.orderManageTotal
      }
   },
   changeOrderManageConf(state, { payload }) {
    return {
        ...state, 
        orderManageConf: payload
    }
  },
  changeShowCheck(state, { payload }) {
      return {
          ...state,
          showCheck: payload
      }
   },
   changeStoreList(state, { payload }) {
       return {
           ...state,
           storeList: payload.storeList,
           storeListTotal: payload.storeListTotal 
       }
   },
   changeStoreListConf(state, { payload }) {
       return {
           ...state,
           storeListConf: payload
       }
   },
   changeStoreId(state, { payload }) {
       return {
           ...state,
           storeId: payload
       }
    },
    changeStoreDetail(state, { payload }) {
        return {
            ...state,
            storeDetail: payload
        }
    },
    changeStoreType(state, { payload }) {
        return {
            ...state,
            storeType: payload
        }
    },
    changeCompanyList(state, { payload }) {
        return {
            ...state,
            companyList: payload
        }
    },
    changeGoodsConf(state, { payload }) {
        return {
            ...state,
            goodsConf: payload
        }
    },
    changeGoodsList(state, { payload }) {
        return {
            ...state,
            goodsList: payload.goodsList,
            goodsListTotal: payload.goodsListTotal
        }
    },
    changeGoodsId(state, { payload }) {
        return {
            ...state,
            goodsId: payload
        }
    },
    changeGoodsDetail(state, { payload }) {
        return {
            ...state,
            goodsDetail: payload
        }
    },
    changeServiceTypeList(state, { payload }) {
        return {
            ...state,
            serviceTypeList: payload
        }
    },
    changeServiceObjList(state, { payload }) {
        return {
            ...state,
            serviceObjList: payload
        }
    },
    changeOrgSizeList(state, { payload }) {
        return {
            ...state,
            orgSizeList: payload
        }
    },
    changeServiceClassList(state, { payload }) {
        return {
            ...state,
            serviceClassList: payload
        }
    }
 }
}
