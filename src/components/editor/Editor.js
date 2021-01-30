import React, {Component } from 'react';

export default class Editor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ueEditor: null,
            editorValue: '<p></p>'
        }
        this.editorRef = React.createRef();
    }

    componentDidMount() {
        var UE = window.UE;
        let { id, height, value, goodsDescription } = this.props;
        if (id) {
            try {
                UE.delEditor(id);
            } catch (error) { }
            let ueEditor = UE.getEditor(id, {
                initialFrameHeight: height || 360,
                serverUrl: '',
                initialFrameWidth: '100%',
                enableAutoSave: false,
                autoFloatEnabled:false,
            });
            this.setState({ 
                ueEditor
             }); 
             if(!goodsDescription || (goodsDescription && value)) {
                 ueEditor.ready((ueditr) => {
                let defaultValue= value || '<p></p>';
                ueEditor.setContent(defaultValue);
             })
            }
            // ueEditor.ready((ueditr) => {
            //     let defaultValue= value || '<p></p>';
            //     ueEditor.setContent(defaultValue);
            //  })
            
            // if(goodsDescription) {
            //     ueEditor.ready((ueditr) => {
            //         if(!value || value === '<p></p>')
            //         ueEditor.setContent('<p style="color: #CDCDCD">' + '商品描述应阐明产品本身优势,特性,不应填写具体价格' + '</p>');
            //      })
            //         ueEditor.addListener("focus", function () {
            //             ueEditor.setContent("");
            //             // var localHtml = ueEditor.getPlainTxt();
            //             // if (localHtml === '商品描述应阐明产品本身优势,特性,不应填写具体价格') {
            //             //     ueEditor.setContent("");
            //             // }
            //         })
            //         ueEditor.addListener("blur", function () {
            //             var localHtml = ueEditor.getContent();
            //             if (!localHtml) {
            //                 ueEditor.setContent('<p style="color: #CDCDCD">' + '商品描述应阐明产品本身优势,特性,不应填写具体价格' + '</p>');//提示语字体灰色
            //             }
            //         });
            //         ueEditor.ready(function () {
            //             ueEditor.fireEvent("blur");
            //         })
               
            // }
            //将文本回调回去
            ueEditor.addListener('selectionchange', (type) => {
                this.setState({
                    editorValue: ueEditor.getContent()
                })
            })
        }
    }

    getEditorValue = () => {
        return this.state.editorValue
    }


    render() {
        return (
           <div>
            <script id={this.props.id} ref={this.editorRef}></script>
           </div>
        )
    }
}