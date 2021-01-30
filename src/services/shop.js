import request from '@/utils/request';
import { stringify } from 'qs'

// 买家订单列表
export function getListForBuyer(data) {
    return request({
        url: '/order/listForBuyer',
        method: 'post',
        data: stringify(data)
      })
}

// 卖家订单列表
export function getListForSeller(data) {
    return request({
        url: '/order/listForSeller',
        method: 'post',
        data: stringify(data)
    })
}

// 订单详情
export function getOrderDetail(id) {
    return request({
        url: '/order/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 取消订单
export function cancelOrder(id) {
    return request({
        url: '/order/cancel',
        method: 'post',
        data: `id=${id}`
    })
}

// 商品列表
export function MyGoodslist(data) {
    return request({
        url: '/goods/listMy',
        method: 'post',
        data: stringify(data)
    })
}

// 商品详情
export function getGoodsDetail(id) {
    return request({
        url: '/goods/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 新增、修改商品
export function editGoods(data) {
    return request({
        url: '/goods/saveOrUpdate',
        method: 'post',
        data: stringify(data)
    })
}

// 卖家审核订单
export function sellerCheckOrder(data) {
    return request({
        url: '/order/check',
        method: 'post',
        data: stringify(data)
    })
}

// 店铺列表
export function getMyStoreList(data) {
    return request({
        url: '/store/listMy',
        method: 'post',
        data: stringify(data)
    })
}

// 新增、修改店铺
export function editStore(data) {
    return request({
        url: '/store/addStore',
        method: 'post',
        data: stringify(data)
    })
}

//  审核店铺列表
export function checkStoreList(data) {
    return request({
        url: '/audit/listCheckStore',
        method: 'post',
        data: stringify(data)
    })
}

// 审核商品列表
export function checkGoodsList(data) {
    return request({
        url: '/audit/listCheckGoods',
        method: 'post',
        data: stringify(data)
    })
}

// 修改商品状态
export function changeGoodsState(data) {
    return request({
        url: '/goods/changeState',
        method: 'post',
        data: stringify(data)
    })
}

// 执行审核操作
export function check(data) {
    return request({
        url: '/audit/check',
        method: 'post',
        data: stringify(data)
    })
}

// 修改店铺状态
export function changeStoreState(data) {
    return request({
        url: '/store/changeState',
        method: 'post',
        data: stringify(data)
    })
}

// 店铺详情
export function getStoreDetail(id) {
    return request({
        url: '/store/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 全部category
export function getCateGory() {
    return request({
        url: '/common/treeGoodsCategorys',
        method: 'post',
    })
}

// 获取可创建店铺企业列表
export function getCorps() {
    return request({
        url: '/store/getCorps',
        method: 'post'
    })
}

export function uploadFile(data) {
    return request({
        url: '/common/uploadFiles',
        method: 'post',
        data: data
    })
}