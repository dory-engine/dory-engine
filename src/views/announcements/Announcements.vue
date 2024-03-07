<template>
  <PageCard :name="$vuetify.lang.t('$vuetify.lang_view_announcements')">
    <v-card class="" flat>
      <v-card-title>
        <v-form ref="form">
          <v-container class="d-flex flex-wrap">
            <v-select
              :items="[
                { text: $vuetify.lang.t('$vuetify.lang_form_all'), value: '' },
                { text: $vuetify.lang.t('$vuetify.lang_view_read'), value: 'read' },
                { text: $vuetify.lang.t('$vuetify.lang_view_unread'), value: 'unread' },
              ]"
              :label="$vuetify.lang.t('$vuetify.lang_form_is_read')"
              class="mr-8"
              dense
              v-model="announcementsForm.readMode"
              @blur="getList(true)"
            ></v-select>
            <v-select
              :items="pageData.levels || []"
              :label="$vuetify.lang.t('$vuetify.lang_form_announcement_level')"
              class="mr-8"
              dense
              small-chips
              multiple
              v-model="announcementsForm.levels"
              @blur="getList(true)"
            ></v-select>
            <template>
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateRangeText"
                    :label="$vuetify.lang.t('$vuetify.lang_form_announcement_time')"
                    prepend-icon="mdi-calendar"
                    readonly
                    dense
                    class="mr-8"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dates"
                  range
                  no-title
                  @change="dateRangeSubmit()"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    small
                    @click="clearDates()"
                  >
                    {{ $vuetify.lang.t('$vuetify.lang_form_clear') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </template>
            <v-btn color="primary" v-if="isAdmin" @click="opneEditor()">{{$vuetify.lang.t('$vuetify.lang_menu_new_announcement')}}</v-btn>
          </v-container>
        </v-form>
      </v-card-title>
      <v-card-title>
        {{$vuetify.lang.t('$vuetify.lang_view_announcement_detail')}}
        <v-spacer></v-spacer>
        <v-btn small color="primary" @click="setRead()">{{$vuetify.lang.t('$vuetify.lang_menu_set_read')}}</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="pageHeaders"
          :items="pageData.announcements"
          :single-expand="false"
          :page="announcementsForm.page"
          :items-per-page="announcementsForm.perPage"
          :server-items-length="pageData.totalCount"
          item-key="announcementID"
          show-expand
          show-select
          selectable-key="selectableKey"
          :footer-props="{
            showCurrentPage: true,
            itemsPerPageOptions: [ 5, 10, 15, 20 ]
          }"
          :loading="tableLoading"
          @update:options="changeOptions($event)"
          :value="selectList"
          @input="checkRow($event)"
        >
          <template v-slot:item.isRead="{ item }">
            <v-chip small class="my-1" color="primary" v-if="item.isRead">{{$vuetify.lang.t('$vuetify.lang_view_read')}}</v-chip>
            <v-chip small class="my-1" color="error" v-else>{{$vuetify.lang.t('$vuetify.lang_view_unread')}}</v-chip>
          </template>
          <template v-slot:item.level="{ item }">
            <v-chip small class="my-1" text-color="white" color="orange" v-if="item.level === 'high'">{{item.level}}</v-chip>
            <v-chip small class="my-1" text-color="white" color="blue" v-else-if="item.level === 'medium'">{{item.level}}</v-chip>
            <v-chip small class="my-1" text-color="white" color="green" v-else>{{item.level}}</v-chip>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="pa-1">
              <v-card class="rounded-0">
                <v-card-title>
                  {{$vuetify.lang.t('$vuetify.lang_view_announcement_content')}}
                  <v-spacer></v-spacer>
                  <v-btn color="error" v-if="isAdmin" @click="openDeleteAnnouncement(item.title, item.announcementID)">{{$vuetify.lang.t('$vuetify.lang_menu_delete_announcement')}}</v-btn>
                </v-card-title>
                <v-card-text class="content-wrap">
                  <mavon-editor
                    :value="item.content"
                    defaultOpen="preview"
                    :boxShadow="false"
                    style="z-index:4;"
                    :editable="false"
                    :subfield="false"
                    :toolbarsFlag="false"
                  >
                  </mavon-editor>
                </v-card-text>
                <v-card-title>
                  {{$vuetify.lang.t('$vuetify.lang_view_attachments')}}
                </v-card-title>
                <v-card-text>
                  <v-chip v-for="(row, index) in item.attachments" :key="index" class="mr-2" small color="primary" @click="downloadFile(row.attachmentID, row.fileName)">
                    {{ row.fileName }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
        v-model="editorDialog"
        max-width="1200px"
        persistent
      >
        <v-card :loading="cardLoading">
          <v-card-title>
            <span class="headline">{{$vuetify.lang.t('$vuetify.lang_menu_new_announcement')}}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="editorRef">
              <div>
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.lang_form_new_announcement_title')"
                  dense
                  required
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  v-model="announcementForm.title"
                ></v-text-field>
              </div>
              <div class="mt-4">
                <small>{{$vuetify.lang.t('$vuetify.lang_form_new_announcement_content')}}</small>
                <mavon-editor v-model="announcementForm.content" :toolbars="toolbars" :placeholder="$vuetify.lang.t('$vuetify.lang_form_new_announcement_content_tip_1')" :language="language" @imgAdd="handleEditorImgAdd" @imgDel="handleEditorImgDel" @save="release" />
              </div>
              <div class="mt-6">
                <v-select
                  :items="levelList"
                  :label="$vuetify.lang.t('$vuetify.lang_form_new_announcement_level')"
                  dense
                  required
                  :rules="[v => !!v || $vuetify.lang.t('$vuetify.lang_form_required')]"
                  v-model="announcementForm.level"
                />
              </div>
              <div class="mt-4">
                <v-file-input
                  :label="$vuetify.lang.t('$vuetify.lang_form_new_announcement_attachments')"
                  dense
                  multiple
                  small-chips
                  show-size
                  v-model="attachments"
                ></v-file-input>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="() => {
                this.editorDialog = false
                this.announcementForm.content = ''
                this.$refs.editorRef.reset()
              }"
              :disabled="btnLoading"
              :loading="btnLoading"
            >
              {{$vuetify.lang.t('$vuetify.lang_menu_cancel')}}
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="release()"
              :disabled="btnLoading"
              :loading="btnLoading"
            >
              {{$vuetify.lang.t('$vuetify.lang_menu_confirm')}}
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteAnnouncementDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{$vuetify.lang.t('$vuetify.lang_form_delete_announcement')}}</span>
        </v-card-title>
        <v-card-text>
          <div>
            {{$vuetify.lang.t('$vuetify.lang_form_delete_announcement_tip_1', targetAnnouncementTitle)}}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteAnnouncementDialog = false"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteAnnouncement()"
          >
            {{ $vuetify.lang.t('$vuetify.lang_menu_confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </PageCard>
</template>

<script>
import PageCard from '@/lib/ui-lib/page-templates/PageCard';
import request from '@/utils/request';
import {vuetify} from '@/plugins/vuetify'
export default {
  inject: ['successTip', 'errorTip', 'warnTip'],
  name: "Project",
  components: {
    PageCard,
  },
  data () {
    return {
      announcementsForm: {
        readMode: '',
        levels: [],
        createTimeRange: {
          startDate: '',
          endDate: ''
        },
        page: 1,
        perPage: 10
      },
      dates:[],
      menu2: false,
      pageData: {
        announcements: [],
        levels: [],
        totalCount: 0
      },
      tableLoading: true,
      isAdmin: false,
      context: '',
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        mark: true,
        superscript: true,
        quote: true,
        ol: true,
        link: true,
        imagelink: true,
        help: true,
        code: true,
        subfield: true,
        fullscreen: true,
        readmodel: true,
        undo: true,
        trash: true,
        save: true,
        navigation: true
      },
      language: 'en',
      editorDialog: false,
      deleteAnnouncementDialog: false,
      targetAnnouncementTitle: '',
      targetAnnouncementID: '',
      selectList: [],
      announcementIDs: [],
      levelList: [],
      cardLoading: false,
      announcementForm:{
        level: '',
        title: '',
        content: '',
        attachmentIDs: []
      },
      attachments: [],
      imgFile: [],
      btnLoading: false
    }
  },
  created () {
    this.getList(false)
    this.isAdmin = JSON.parse(localStorage.getItem('userObj')).isAdmin
  },
  methods: {
    getList(hasTip) {
      const vm = this
      vm.tableLoading = true
      request.post('/cicd/announcements', vm.announcementsForm).then(response => {
        vm.pageData = response.data
        response.data.announcements.forEach(item => {
          if(item.isRead){
            item.selectableKey = false
          }
        })
        if(hasTip) {
          vm.successTip(true,response.msg)
        }
        vm.tableLoading = false
      }).catch(error => {
        vm.tableLoading = false
        vm.errorTip(true,error.response.data.msg)
      })
    },
    changeOptions(data) {
      const vm = this
      vm.tableLoading  = true
      vm.announcementsForm.page = data.page
      vm.announcementsForm.perPage = data.itemsPerPage
      vm.getList(false)
    },
    clearDates () {
      this.dates = []
      this.menu2 = false
      this.getList(true)
    },
    dateRangeSubmit () {
      this.menu2 = false
      this.getList(true)
    },
    checkRow (arr) {
      const vm = this
      vm.selectList = arr
      vm.announcementIDs = []
      arr.map(item => {
        vm.announcementIDs.push(item.announcementID)
      })
    },
    setRead () {
      const vm = this
      if(vm.announcementIDs.length > 0){
        request.post('/cicd/announcementRead', {
          announcementIDs: vm.announcementIDs
        }).then(response => {
          vm.successTip(true,response.msg)
          vm.selectList = []
          vm.getList(false)
        }).catch(error => {
          vm.errorTip(true,error.response.data.msg)
        })
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_select_nothing'))
      }
    },
    opneEditor() {
      const vm = this
      vm.editorDialog = true
      vm.cardLoading = true
      var lang = ''
      if (window.sessionStorage.getItem('lang') === 'zh') {
        lang = 'zh-CN'
      } else if (window.sessionStorage.getItem('lang') === 'en') {
        lang = 'en'
      }
      vm.language = lang
      vm.announcementForm.attachmentIDs = []
      request.get('/admin/announcementOptions').then(response => {
        vm.levelList = response.data.levels
        vm.cardLoading = false
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    handleEditorImgAdd(pos, $file) {
      const vm = this
      let formdata = new FormData()
      formdata.append('attachment[]', $file)
      vm.imgFile[pos] = $file
      request.post('/admin/announcement/attachment', formdata).then(response => {
        let url = response.data.attachments[0].filePath
        let name = $file.name
        if (name.includes('-')) {
            name = name.replace(/-/g, '')
        }
        let content = vm.announcementForm.content
        if (content.includes(name)) {
          let oStr = `(${pos})`
          let nStr = `(${process.env.VUE_APP_BASE+url})`
          let index = content.indexOf(oStr)
          let str = content.replace(oStr, '')
          let insertStr = (soure, start, newStr) => {
            return soure.slice(0, start) + newStr + soure.slice(start)
          }
          vm.announcementForm.content = insertStr(str, index, nStr)
        }
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    handleEditorImgDel(pos) {
      delete this.imgFile[pos]
    },
    release() {
      const vm = this
      if(vm.$refs.editorRef.validate() && vm.announcementForm.content !== ''){
        if(vm.attachments.length <= 0){
          request.post('/admin/announcement', vm.announcementForm).then(response => {
            console.log(response)
            vm.editorDialog = false
            vm.successTip(true,response.msg)
            vm.announcementForm.content = ''
            vm.$refs.editorRef.reset()
            vm.getList(false)
          }).catch(error => {
            vm.errorTip(true,error.response.data.msg)
          })
        }else{
          vm.btnLoading = true
          var formData = new FormData();
          vm.attachments.forEach(attachment => {
            formData.append('attachment[]', attachment);
          })
          request.post('/admin/announcement/attachment',formData).then(response => {
            vm.btnLoading = false
            response.data.attachments.map(row => {
              vm.announcementForm.attachmentIDs.push(row.attachmentID)
            })
            request.post('/admin/announcement', vm.announcementForm).then(response => {
              console.log(response)
              vm.editorDialog = false
              vm.successTip(true,response.msg)
              vm.announcementForm.content = ''
              vm.$refs.editorRef.reset()
              vm.getList(false)
            }).catch(error => {
              vm.errorTip(true,error.response.data.msg)
            })
          }).catch(error => {
            vm.errorTip(true,error.response.data.msg)
          })
        }
      }else{
        vm.warnTip(true, vuetify.preset.lang.t('$vuetify.lang_tip_please_check_all_input_is_correct'))
      }
    },
    downloadFile(attachmentID, name) {
      const vm = this
      request.get(`/cicd/attachment/${attachmentID}`, {
        responseType: 'blob'
      }).then(response => {
        var blob = response
        var a = document.createElement('a')
        var url = window.URL.createObjectURL(blob)
        var filename = name
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
    openDeleteAnnouncement (title, ID) {
      const vm = this
      vm.targetAnnouncementTitle = title
      vm.targetAnnouncementID = ID
      vm.deleteAnnouncementDialog = true
    },
    deleteAnnouncement () {
      const vm = this
      request.delete(`/admin/announcement/${vm.targetAnnouncementID}`).then(response => {
        vm.deleteAnnouncementDialog = false
        vm.successTip(true,response.msg)
        this.getList(false)
      }).catch(error => {
        vm.errorTip(true,error.response.data.msg)
      })
    },
  },
  computed: {
    pageHeaders () {
      return  [
        { text: vuetify.preset.lang.t('$vuetify.lang_view_announcement_level'), value: 'level', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_announcement_title'), value: 'title', sortable: false },,
        { text: vuetify.preset.lang.t('$vuetify.lang_view_announcement_user'), value: 'username', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_announcement_time'), value: 'createTime', sortable: false },
        { text: vuetify.preset.lang.t('$vuetify.lang_view_is_read'), value: 'isRead', sortable: false },
      ]
    },
    dateRangeText () {
      return this.dates.join(' ~ ')
    }
  }
}
</script>

<style>
.content-wrap .v-note-wrapper {
  min-height: 0;
}
.markdown-body img {
  max-height: 100%;
}
</style>