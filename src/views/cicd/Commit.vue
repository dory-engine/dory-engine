<template>
  <div>
    <div style="padding: 20px">
      <MonacoDiff :monacoOptions="monacoOptions"
                  :original="diffs[0].original"
                  :modified="diffs[0].modified"
                  :height="diffHeight"></MonacoDiff>
    </div>
  </div>
</template>

<script>
  // import monaco from "@/lib//monaco/Monaco";
  import MonacoDiff from "@/lib//monaco/MonacoDiff";
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/theme/base16-dark.css'
    export default {
      name: "Commit",
      components: {
        MonacoDiff
      },
      data(){
        return {
          page:1,
          monacoOptions: {
            automaticLayout:true,
            readOnly: true,
            theme: "vs"
          },
          commit: {},
          basisTab: null,
          diffs: [],
          runs: [],
          cmOptions: {
            tabSize: 4,
            mode: 'text/plain',
            theme: 'base16-dark',
            lineNumbers: true,
            line: true
          },
        }
      },
      created() {
      },
      mounted() {
      },
      methods:{
      },
      computed:{
        diffHeight(){
          return window.innerHeight - 200
        }
      }
    }
</script>

<style scoped>

</style>
