<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            {{ $vuetify.lang.t('$vuetify.lang_view_module_type') }}
          </th>
          <th class="text-left">
            {{ $vuetify.lang.t('$vuetify.lang_view_module_name') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(mods, moduleType) in moduleDatas"
          :key="moduleType"
        >
          <td>{{ moduleType }}</td>
          <td>
            <v-chip outlined v-for="(item,index) in mods" :key="index" :color="(item.isLatest || item.moduleEnable)?'primary':'gray'" small class="ma-1" :to="{name: 'CicdModule', params: { projectName: projectName, moduleName: item.moduleName || item, moduleType: moduleType }}">
              {{ item.moduleName }}
            </v-chip>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'ModuleInfos',
  props: ['modules', 'projectName'],
  data () {
    return {
      moduleDatas: [],
    }
  },
  created () {
    const vm = this
    let keysSorted = [ 'build', 'package', 'deploy', 'artifact', 'deployArtifact', 'testApi', 'testPerformace', 'testWebui' ]
    let newD = {}
    if(Object.entries(vm.modules).length > 0){
      let keyArr = Object.keys(vm.modules)
      let newArr = []
      for (let i = 0; i < keysSorted.length; i++) {
        for (let j = 0; j < keyArr.length; j++) {
          if(keyArr[j] === keysSorted[i]){
              newArr.push(keyArr[j]);
          }
        }
      }
      for(let i=0;i<newArr.length;i++){
        newD[newArr[i]]=vm.modules[newArr[i]];
      }
    }else{
      newD = {}
    }
    vm.moduleDatas = Object.assign(newD, vm.modules) || {}
  },
}
</script>