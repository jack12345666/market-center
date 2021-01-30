import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Select, Divider, TimePicker,Radio, message, InputNumber  } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import style from './index.scss'
import moment from 'moment'
import { BASEURL } from '@/utils/config'
import { getArrayProps } from '@/utils/utils'
import MyUpload from '@/components/upload'
import UploadImg from '@/components/uploadImg'
import Editor from '@/components/editor/Editor'

const namespace = 'shop'
const { Option } = Select
const { TextArea } = Input
const format = 'HH:mm'
const { RangePicker } = TimePicker
const layout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 21, 
      offset: 1,
    }
}
const twoLayout = {
    labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 18, 
        offset: 2,
      }
}
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 14,
  }
 }

 
@connect(({ shop }) => ({ shop }))
class AddGoods extends Component {
    state = {
      description: '',
      images: [],
      imagesUrl: '',
      delImages: '',
      categoryOneId: null,
      goodsImg: '',
      goodsImgUrl: '',
      storename: '',
      storeId: null,
      isInputPrice: false,
      priceRadio: null,
    }
    formRef = React.createRef()
    descEditor = React.createRef()
    componentDidMount() {
      document.title = '钱塘投资之家 - 添加商品'
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
        }).then(() => {
          const { storeList } = this.props[namespace]
          if(storeList.length > 0) {
            this.setState({
             storeId: storeList[0].id,
             storename: storeList[0].name
           })  
          }
          this.getStoreInfo()  
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
    }
    
    uploadGoodsImg = (data) => {
      this.setState({
        goodsImg: BASEURL + data,
        goodsImgUrl: data
      })
    }

    uploadMoreImg = (data, delData) => {
      let str = ''
      let arr = []
      let delStr = ''
      if(data.length > 0) {
          data.forEach(item => {
            if(item.id) {
             arr.push(item.id)
            }
        })
        str = arr.join(',')
      }
      if(delData.length > 0) {
        delStr = delData.join(',')
    }
      this.setState({
        images: data,
        imagesUrl: str,
        delImages: delStr
      })
    }

    
    getStoreInfo = () => {
      if(this.state.storeId) {
        this.props.dispatch({
          type: `${namespace}/fetchStoreDetail`,
          payload: this.state.storeId
        }).then(() => {
          const { storeDetail } = this.props[namespace]
          this.formRef.current.setFieldsValue({
            storeid: `${this.state.storeId}`,
            contact: storeDetail.sellername,
            email: storeDetail.email,
            phone: storeDetail.phone,
            tel: storeDetail.tel,
            categoryOne: storeDetail.categorys.length > 0 ? storeDetail.categorys[0].commoncategoryname : '',
            categoryOneId: storeDetail.categorys.length > 0 ? storeDetail.categorys[0].commoncategoryid : null,
            beginTime: storeDetail.workingtime ? moment(storeDetail.workingtime.split('-')[0], format) : undefined,
            endTime: storeDetail.workingtime ? moment(storeDetail.workingtime.split('-')[1], format) : undefined,
          })
          if(this.formRef.current.getFieldValue('beginTime') && this.formRef.current.getFieldValue('endTime')) {
            this.formRef.current.setFieldsValue({
                workingtime: [this.formRef.current.getFieldValue('beginTime'), this.formRef.current.getFieldValue('endTime')]
            })
        }
          if(this.formRef.current.getFieldValue('categoryOneId')) {
            let id = this.formRef.current.getFieldValue('categoryOneId') 
            this.props.dispatch({
               type: `${namespace}/fetchCategoryList`,
               payload: id
            })
            this.setState({
              categoryOneId: this.formRef.current.getFieldValue('categoryOneId')
            })
           }
        })
      }
    }

    goBack = () => {
        this.props.history.push('/personCenter/goodsList/')
    }
  
    onFinish = values => {
       const { serviceObjList, orgSizeList } = this.props[namespace]
       const { categoryOneId, storename, priceRadio, goodsImgUrl, imagesUrl, delImages } = this.state
       values['description'] = this.descEditor.current.getEditorValue()
       values['marketprice'] = 0
       values['promotionprice'] = 0
       values['storename'] = storename
       values['image'] = goodsImgUrl
       values['imageIds'] = imagesUrl
       values['delImageIds'] = delImages
       values['price'] = priceRadio
       let priceCategory = ''
       if(priceRadio === 0) {
         priceCategory = 361
       }else if(priceRadio === -1) {
        priceCategory = 363
       }else {
        priceCategory = 362
       }
       values['workingtime'] =values['workingtime'] && values['workingtime'][0] && values['workingtime'][1]  ? `${moment(values['workingtime'][0]).format(format)}-${moment(values['workingtime'][1]).format(format)}` : ''
      if(!values['categoryTwo']) {
        values['commonCategoryIds'] = priceCategory + ',' + getArrayProps(serviceObjList, 'id').join(',') + ',' + getArrayProps(orgSizeList, 'id').join(',') + ',' + categoryOneId + ',' + values['categoryType']
      }else {
        values['commonCategoryIds'] = priceCategory + ',' + getArrayProps(serviceObjList, 'id').join(',') + ',' + getArrayProps(orgSizeList, 'id').join(',') + ',' + categoryOneId + ',' + values['categoryType'] + ',' + values['categoryTwo'] 
      }
       delete values['categoryObj']
       delete values['categoryOrg']
       delete values['categoryType']
      //  delete values['categoryTwo']
       delete values['categoryOne']
       if(!values['name']) {
          message.error('请填写商品名称')
       }else if(priceRadio !== 0 && priceRadio !== -1) {
         message.error('请选择价格')
       }else if(!values['categoryTwo']) {
         message.error('请选择服务类别')
       }else if(!(/^1[3456789]\d{9}$/.test(values['phone']))){ 
        message.error("手机号码有误") 
       }else if(!values['workingtime']) {
        message.error('请选择工作时间')
      }else if(!values['storage']) {
        message.error('请填写商品库存')
       }else if(!values['storage']) {
        message.error('请填写商品库存')
       }else if(!values['image']) {
        message.error('请上传商品主图')
       }else if(!values['description']) {
        message.error('请填写商品描述')
       }  else {
         this.props.dispatch({
           type: `${namespace}/toEditGoods`,
           payload: values
         }).then(rsp => {
          if(rsp && rsp.code === 0) {
             message.success('操作成功')
             this.props.history.push('/personCenter/goodsList/')
           }
         })
       }
    }

    changeStore = (value,option)  => {
      this.setState({
        storeId: value,
        storename: option.children
      })
      this.getStoreInfo()
    }

    onRadioChange = e  => {
      this.setState({
        priceRadio: e.target.value
      })
      // if(e.target.value === -1 || e.target.value === 0) {
      //   this.formRef.current.setFieldsValue({
      //     price: e.target.value
      //   })
      //   this.setState({
      //     isInputPrice: false
      //   })
      // }else {
      //   this.setState({
      //     isInputPrice: true
      //   })
      //   this.formRef.current.setFieldsValue({
      //     price: 1
      //   })
      // }   
    }

    render() {
        const { storeList, serviceTypeList, serviceObjList, orgSizeList, serviceClassList, priceRadio} = this.props[namespace]
        const { description, goodsImg, images } = this.state
        const storeOptions = []
        if(storeList.length > 0) {
            storeList.forEach(item => {
              storeOptions.push(<Option key={item.id}>{item.name}</Option>)
            })
        }
        const serviceTypeOptions = []
        if(serviceTypeList.length > 0) {
            serviceTypeList.forEach(item => {
                serviceTypeOptions.push(<Option key={item.id}>{item.name}</Option>)
            })
        }
        const serviceObjOptions = []
        if(serviceObjList.length > 0) {
            serviceObjList.forEach(item => {
                serviceObjOptions.push(<Option key={item.id}>{item.name}</Option>)
            })
        }
        const orgSizeOptions = []
        if(orgSizeList.length > 0) {
            orgSizeList.forEach(item => {
                orgSizeOptions.push(<Option key={item.id}>{item.name}</Option>)
            })
        }
        const serviceClassOptions = []
        if(serviceClassList.length > 0) {
            serviceClassList.forEach(item => {
                serviceClassOptions.push(<Option key={item.id}>{item.name}</Option>)
            })
        }

        return (
            <div className={style.box}>
                <div className={style.top}>
                <CloseOutlined style={{fontSize: '20px'}} title="关闭" onClick={this.goBack}/>
           </div>
             <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
                <Row>
                <Col span={11}>
                  <Form.Item {...twoLayout} name="storeid" label="店铺名称" rules={[ { required: true, message: '请选择店铺'  } ]}>
                  <Select onChange={this.changeStore}  placeholder="请选择店铺">
                      {storeOptions}
                  </Select>
                  </Form.Item> 
                </Col>
                <Col span={11} offset={2}>
                <Form.Item {...twoLayout} name="name" label="商品名称"  rules={[ { required: true, message: '请填写商品名称'  } ]}>
                    <Input placeholder="请填写商品名称"/>
                 </Form.Item>
                </Col>    
                <Col span={11}>
                  <Form.Item {...twoLayout} name="priceRadio" label="收费模式"  rules={[ { required: true, message: '请选择收费模式'  } ]}>
                  <Radio.Group onChange={this.onRadioChange} value={priceRadio}>
                    <Radio value={0}>免费</Radio>
                    {/* <Radio value={1}>收费</Radio> */}
                    <Radio value={-1}>面议</Radio>
                </Radio.Group>
                 </Form.Item>
                </Col>
                {/* <Col span={11} offset={2}>
                </Col>   
                <Col span={11}>
                 <Form.Item {...twoLayout} name="price" label="商品价格"  rules={[ { required: true, message: '请填写商品价格'  } ]}>
                    <InputNumber style={{width: '320px'}} disabled={!isInputPrice} min={priceRadio}  placeholder="请填写商品价格"/>
                 </Form.Item>
                </Col> */}
                <Col span={11} offset={2}>
                 <Form.Item {...twoLayout} name="storage" label="商品库存"  rules={[ { required: true, message: '请填写商品库存'} ]}>
                    <InputNumber  style={{width: '320px'}} min={0} max={9999999999} placeholder="请填写商品库存"/>
                 </Form.Item>
                </Col>   
                <Col span={11}>
                 <Form.Item {...twoLayout} name="contact" label="联系人"  rules={[ { required: true, message: '请填写联系人' } ]}>
                    <Input  placeholder="请填写联系人"/>
                 </Form.Item>
                </Col>
                <Col span={11} offset={2}>
                <Form.Item {...twoLayout} name="phone" label="手机" rules={[{required: true, message:'手机号格式不正确',pattern: /^1(3|4|5|6|7|8|9)\d{9}$/}]}>
                        <Input type="number"  placeholder="请填写手机"/>
                    </Form.Item>
                </Col>    
                <Col span={11}>
                  <Form.Item {...twoLayout} name="tel" label="电话" rules={[{message:'电话格式不正确',pattern: /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/}]}>
                    <Input type="number"  placeholder="请填写电话"/>
                 </Form.Item>
                </Col>  
                <Col span={11} offset={2}>
                    <Form.Item {...twoLayout} name="email" label="邮箱" rules={[{message:'邮箱格式不正确',pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/}]}>
                        <Input  placeholder="请填写邮箱"/>
                    </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item {...twoLayout} name="categoryOne" label="服务分类">
                    <Input disabled />
                 </Form.Item>
                </Col>  
                <Col span={11} offset={2}>
                    <Form.Item {...twoLayout} name="categoryTwo" label="服务类别" rules={[{required: true, message:'请选择服务类别'}]}>
                       <Select  placeholder="请选择服务类别">
                         {serviceTypeOptions}
                       </Select>
                    </Form.Item>
                </Col>
                {/* <Col span={11}>
                  <Form.Item {...twoLayout} name="categoryObj" label="服务对象">
                   <Select mode="multiple" placeholder="请选择服务对象">
                         {serviceObjOptions}
                    </Select>
                 </Form.Item>
                </Col>  
                <Col span={11} offset={2}>
                    <Form.Item {...twoLayout} name="categoryOrg" label="机构规模">
                       <Select mode="multiple"  placeholder="请选择机构规模">
                         {orgSizeOptions}
                       </Select>
                    </Form.Item>
                </Col> */}
                <Col span={11}>
                  <Form.Item {...twoLayout} name="categoryType" label="服务类型"  rules={[{required: true, message:'请选择服务类型'}]}>
                   <Select placeholder="请选择服务类型">
                         {serviceClassOptions}
                    </Select>
                 </Form.Item>
                </Col>  
                <Col span={11} offset={2}>
                    <Form.Item {...twoLayout} name="workingtime" label="工作时间" rules={[{required: true, message:'请选择工作时间'}]}>
                      <RangePicker placeholder={['开始时间','结束时间']}  format={format}/>
                    </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item {...layout} name="advword" label="商品广告词">
                    <TextArea style={{marinLeft: '-10px'}} rows={2} placeholder="请填写商品广告词"/>
                 </Form.Item>
                </Col> 
                
                <Col span={6} style={{paddingLeft: '10px'}}>
                  <div className={style.img}>
                     <div className={style.imgMainTitle}>商品主图</div> 
                     <div className={style.imgTips}>推荐大小：210*180</div>
                  </div>
                  <UploadImg imgUrl={goodsImg} fn={this.uploadGoodsImg}/>
                </Col>
                <Col span={24} style={{paddingLeft: '10px'}}>
                  <div className={style.img}>
                     <div className={style.imgTitle}>商品介绍图</div> 
                     <div className={style.imgTips}>推荐大小：210*180</div>
                  </div>
                  <MyUpload imgList={images} limit={4} fn={this.uploadMoreImg}/>
                </Col>
                <Col span={24}>
                  <div className={style.title}>商品描述<span style={{color: '#999', marginLeft: '5px'}}>(商品描述应阐明产品本身优势,特性,不应填写具体价格)</span></div>
                  <Editor value={description} goodsDescription={true} id={'desEditor'} width={'100%'} height={'350'} ref={this.descEditor}/>
                </Col>
            </Row>
            <Form.Item {...tailLayout} style={{marginTop: '20px'}}>
             <Button type="primary" htmlType="submit">提交</Button><Divider type="vertical" />
             <Button htmlType="button" onClick={this.goBack}>取消</Button>
            </Form.Item>
         </Form>   
         </div>
        )
    }
}

export default AddGoods