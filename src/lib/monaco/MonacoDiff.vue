<template>
  <div
    ref="container"
    class="monaco-editor"
    style="width: 100%;"
    :style="`height: ${height}px`"
  ></div>
</template>

<script>
  import * as monaco from "monaco-editor";
  export default {
    name: "Monaco",
    props: {
      monacoOptions: {
        type: Object,
        default: () => {
          return {
            value: "", // 编辑器的值
            theme: "vs", // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
            roundedSelection: false, // 右侧不显示编辑器预览框
            autoIndent: true, // 自动缩进
          };
        }
      },
      height: {
        type: Number,
        default: 300
      },
      original:{
        type:String,
        required:true
      },
      modified:{
        type:String,
        required:true
      }
    },
    data(){
      return {
        diffEditor:null,
        originalModel: null,
        modifiedModel: null
      }
    },
    mounted() {
      this.$nextTick(()=>{
        this.init();
      })
    },
    methods: {
      init() {
        const vm = this;
        // 初始化container的内容，销毁之前生成的编辑器
        vm.$refs.container.innerHTML = "";

        // 生成编辑器对象
        vm.originalModel = monaco.editor.createModel(vm.original, "yaml");
        vm.modifiedModel = monaco.editor.createModel(vm.modified, "yaml");

        let options = Object.assign({
          // You can optionally disable the resizing
          enableSplitViewResizing: false,

          // Render the diff inline
          renderSideBySide: true,
        },vm.monacoOptions);

        vm.diffEditor = monaco.editor.createDiffEditor(vm.$refs.container,options);

        vm.diffEditor.setModel({
          original: vm.originalModel,
          modified: vm.modifiedModel
        });
      },
    }
  };
</script>
