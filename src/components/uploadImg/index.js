import React from 'react';
import { Upload, message } from 'antd';
import './index.scss'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadFile } from '@/services/shop'
import { LIMITFILE } from '@/utils/config'

const MyUpload = ({ type = "image", imgUrl="", width = 180, height = 180, sign = 0, fn }) => {
    let loading = false;
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">上传照片</div>
        </div>
    )

    const classObj = {
        0: 'defaultImg',
        1: 'activityImg',
        2: 'bannerImg'
    }

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('请上传jpg或者png格式的图片');
        }
        const isLtM = file.size / 1024 / 1024 < LIMITFILE;
        if (!isLtM) {
          message.error(`图片最大不超过${LIMITFILE}M`);
        }
        return isJpgOrPng && isLtM;
      }
    

    function toUpload(data) {
        let formData = new window.FormData() 
        formData.append("files", data.file);
        uploadFile(formData).then(rsp => {
            if(rsp && rsp.length > 0) {
                message.success('上传成功')    
                fn(rsp[0].url)
            }
        })
    }
    return (
        <div >
            <Upload
                name="content"
                data={{
                    type: type
                }}
                accept="image/*"
                listType="picture-card"
                showUploadList={false}
                customRequest={toUpload}
                beforeUpload={beforeUpload}
                className={imgUrl && classObj[sign]}
            >
                {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: width , height: height }} /> : uploadButton}
            </Upload>
        </div>
    );
};

export default MyUpload;