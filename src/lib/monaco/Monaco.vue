<template>
  <div
    ref="container"
    class="monaco-editor"
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
            theme: "vs-dark", // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
            roundedSelection: false, // 右侧不显示编辑器预览框
            autoIndent: true // 自动缩进
          };
        }
      },
      height: {
        type: Number,
        default: 300
      },
      // code:{
      //   type:String,
      //   required:true
      // }
    },
    mounted() {
      this.$nextTick(()=>{
        this.init();
      })
    },
    data () {
      return {
        monacoEditor: null,
        // model: null
      }
    },
    methods: {
      init() {
        const vm = this
        // 初始化container的内容，销毁之前生成的编辑器
        vm.$refs.container.innerHTML = "";

        vm.editorOptions = vm.monacoOptions;
        // 生成编辑器对象
        // vm.model = monaco.editor.createModel(vm.code, "yaml");
        vm.monacoEditor = monaco.editor.create(
          vm.$refs.container,
          vm.editorOptions
        );
        // // 编辑器内容发生改变时触发
        // this.monacoEditor.onDidChangeModelContent(() => {
        //   this.$emit("change", this.monacoEditor.getValue());
        //   this.$emit("input", this.monacoEditor.getValue());
        // });
      },
      // 供父组件调用手动获取值
      getVal() {
        return this.monacoEditor.getValue();
      }
    }
  };
</script>
