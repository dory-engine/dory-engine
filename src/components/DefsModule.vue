<script>
export default {
  name: 'DefsModule',
  functional: true,
  props: ['modules', 'projectName'],
  render (createElement, context) {
    const keysSorted = [ 'build', 'package', 'artifact', 'deploy', 'deployArtifact' ]
    var newD = {}
    if(Object.entries(context.props.modules).length > 0){
      for(let i=0;i<keysSorted.length;i++){
        newD[keysSorted[i]]=context.props.modules[keysSorted[i]];
      }
    }else{
      newD = {}
    }
    const modules = Object.assign(newD, context.props.modules) || {}
    const projectName = context.props.projectName
    return createElement('div', Object.entries(modules).map(([key, value]) => {
      if(modules[key].length > 0){
        return <div class="d-flex my-2">
          <div class="mr-4 font-weight-black">
            { key } :
          </div>
          { value.map(item => {
            if(item.moduleEnable == undefined){
              return <div>
                <VChip color='gray' small class="mr-2">
                  {item.moduleName || item}
                </VChip>
              </div>
            }else{
            return <div>
              <VChip color={(item.moduleEnable)?'primary':'gray'} small class="mr-2">
                {item.moduleName || item}
              </VChip>
            </div>
            }
          })}
        </div>
      }
    }))
  }
}
</script>

<style scoped>

</style>
