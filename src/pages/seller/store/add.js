import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input, Select, Divider, TimePicker, message } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import style from './index.scss'
import moment from 'moment'
import { BASEURL } from '@/utils/config'
import MyUpload from '@/components/uploadImg'
import Editor from '@/components/editor/Editor'

const namespace = 'shop'
const { Option } = Select
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
class AddStore extends Component {
    state = {
      storeLogo: '',
      logo: '',
      storeBanner: '',
      banner: '',
      qualifications: '',
      description: '',
    }
    formRef = React.createRef()
    qualiEditor = React.createRef()
    descEditor = React.createRef()
    componentDidMount() {
      document.title = '钱塘投资之家 - 创建店铺'
        this.props.dispatch({
          type: `${namespace}/fetchStoreType`
        })
        this.props.dispatch({
          type: `${namespace}/fetchCompanyList`
        })
    }

    componentWillUnmount() {
      this.props.dispatch({
        type: `${namespace}/changeStoreId`,
        payload: null
     })
     this.props.dispatch({
       type: `${namespace}/changeStoreDetail`,
       payload: null
     })
    }
    
    uploadstoreLogo = (data) => {
      this.setState({
        storeLogo: BASEURL + data,
        logo: data
      })
    }

    uploadstoreBanner = (data) => {
     this.setState({
       storeBanner: BASEURL + data,
       banner: data
     })
    }

    goBack = () => {
        this.props.history.go(-1)
    }
  
    onFinish = values => {
       const {logo, banner} = this.state
       values['workingtime'] =values['workingtime'] && values['workingtime'][0] && values['workingtime'][1]  ? `${moment(values['workingtime'][0]).format(format)}-${moment(values['workingtime'][1]).format(format)}` : ''
       values['avatar'] = ''
       values['logo'] = logo
       values['banner'] = banner
       values['qualifications'] = this.qualiEditor.current.getEditorValue() 
       values['description'] = this.descEditor.current.getEditorValue()
       if(!values['name']) {
           message.error('请填写店铺名称')
       } else if(!values['introduce']) {
          message.error('请填写店铺介绍')
       }else if(!values['deptId']) {
           message.error('请选择关联企业')
       }else if(!values['commonCategoryIds']) {
           message.error('请选择店铺类别')
       }else if(!values['workingtime']) {
        message.error('请选择工作时间')
      }else if(!(/^1[3456789]\d{9}$/.test(values['phone']))){ 
        message.error("手机号码有误") 
       }else if(!values['logo']) {
        message.error('请上传店铺logo')
      }else if(!values['banner']) {
        message.error('请上传店铺banner')
      }else if(!values['description']) {
        message.error('请填写店铺描述')
      }else {
        this.props.dispatch({
            type: `${namespace}/editStoreInfo`,
            payload: values
          }).then(rsp => {
           if(rsp && rsp.code === 0) {
              message.success('操作成功')
              this.props.history.go(-1)
            }
          })
       }
    }

    render() {
        const { storeType, companyList } = this.props[namespace]
        const { storeLogo, storeBanner } = this.state
        const typeList = []
        const companyOptions = []
        if(storeType.length > 0) {
          storeType.forEach(item => {
            typeList.push(<Option key={item.id}>{item.name}</Option>)
          })
        }
        if(companyList.length > 0) {
          companyList.forEach(item => {
            companyOptions.push(<Option key={item.id}>{item.name}</Option>)
          })
        }
   
        return (
            <div className={style.box}>
                <div className={style.top}>
                <CloseOutlined style={{fontSize: '20px'}} title="关闭" onClick={this.goBack}/>
           </div>
             <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
                <Row>
                <Col span={24}>
                  <Form.Item {...layout} name="name" label="店铺名称"  rules={[{required: true, message: '请填写店铺名称'}]}>
                    <Input placeholder="应填: 企业名(店铺名选填) 如浙江太子龙汉格服饰有限公司(太子龙时尚男装)"/>
                 </Form.Item>
                </Col> 
                <Col span={24}>
                  <Form.Item {...layout} name="keywords" label="店铺关键字">
                    <Input placeholder="关键词不超过5个"/>
                 </Form.Item>
                </Col> 
                <Col span={24}>
                  <Form.Item {...layout} name="introduce" label="店铺简介" rules={[{required: true, message: '请填写店铺简介'}]}>
                  <Input placeholder="请填写店铺简介"/>
                 </Form.Item>
                </Col> 
                <Col span={12}>
                  <Form.Item {...twoLayout} name="deptId" label="关联企业" rules={[{required: true, message: '请选择关联企业'}]}>
                  <Select  placeholder="请选择关联企业">
                      {companyOptions}
                  </Select>
                  </Form.Item> 
                </Col>
                <Col span={11} offset={1}>
                <Form.Item  {...twoLayout} name="commonCategoryIds" label="店铺类别" rules={[{required: true, message: '请选择店铺类别'}]}>
                  <Select>
                      {typeList}
                    </Select>
                </Form.Item> 
                </Col>
                <Col span={24}>
                  <Form.Item {...layout} name="companyaddress" label="公司地址">
                    <Input placeholder="请填写公司地址"/>
                 </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item  {...twoLayout} name="phone" label="商家手机" rules={[{required: true, message:'手机号格式不正确',pattern: /^1(3|4|5|6|7|8|9)\d{9}$/}]}>
                   <Input placeholder="请填写商家手机"/>
                </Form.Item> 
                </Col>
                 <Col span={11} offset={1}>
                  <Form.Item {...twoLayout} name="tel" label="商家电话" rules={[{message:'电话格式不正确',pattern: /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/}]}>
                    <Input placeholder="请填写商家电话"/>
                  </Form.Item> 
                </Col> 
                <Col span={12}>
                  <Form.Item {...twoLayout} name="email" label="商家邮件" rules={[{message:'邮箱格式不正确',pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/}]}>
                    <Input placeholder="请填写商家邮件"/>
                  </Form.Item> 
                </Col>
                <Col span={11} offset={1}>
                <Form.Item  {...twoLayout} name="qq" label="店铺QQ">
                   <Input placeholder="请填写店铺QQ"/>
                </Form.Item> 
                </Col>
                <Col span={24}>
                <Form.Item {...layout} name="workingtime" label="工作时间" rules={[{required: true, message:'请选择工作时间'}]}>
                      <RangePicker placeholder={['开始时间','结束时间']}  format={format}/>
                    </Form.Item>
                </Col> 
                <Col span={24} style={{paddingLeft: '10px'}}>
                 <div className={style.img}>
                     <div className={style.imgMainTitle}>店铺LOGO</div> 
                     <div className={style.imgTips}>推荐大小：210*180</div>
                  </div>
                   <MyUpload imgUrl={storeLogo} fn={this.uploadstoreLogo}/>
                </Col>
                <Col span={24} style={{paddingLeft: '10px'}}>
                   <div className={style.img}>
                     <div className={style.imgMainTitle}>店铺banner</div> 
                     <div className={style.imgTips}>推荐大小：1146*222</div>
                  </div>
                  <MyUpload imgUrl={storeBanner} width={800} height={222} fn={this.uploadstoreBanner} sign={2}/>
                </Col> 
                <Col span={24}>
                  <div className={style.title}>店铺描述</div>
                  <Editor id={'desEditor'} width={'100%'} height={'350'} ref={this.descEditor}/> 
                </Col>
                <Col span={24}>
                  <div className={style.mtitle}>相关资质</div>
                  <Editor id={'quaEditor'} width={'100%'} height={'350'} ref={this.qualiEditor}/> 
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

export default AddStore