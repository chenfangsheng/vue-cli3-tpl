/*
 * @Description: 页面快速生成脚本
 * @Date: 2018-12-06 10:28:08
 * @LastEditTime: 2018-12-12 17:02:36
 */
const fs = require('fs')
const path = require('path')
const basePath = path.resolve(__dirname, '../src')

const dirName = process.argv[2]
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1)
if (!dirName) {
  console.log('文件夹名称不能为空！')
  console.log('示例：npm run tep ${capPirName}')
  process.exit(0)
}

/**
 * @msg: vue页面模版
 */
const VueTep = `<template>
  <div class="${dirName}-wrap">
    {{data.pageName}}
  </div>
</template>

<script lang="ts" src="./${dirName}.ts"></script>

<style lang="scss">
  @import './${dirName}.scss'
</style>

`

// ts 模版
const tsTep = `import { Component, Vue } from "vue-property-decorator"
import { Getter, Action } from "vuex-class"
import { ${capPirName}Data } from '@/types/views/${dirName}.interface'
// import {  } from "@/components" // 组件

@Component({})
export default class About extends Vue {
  // Getter
  // @Getter author
  
  // Action
  // @Action GET_DATA_ASYN

  // data
  data: ${capPirName}Data = {
    pageName: '${dirName}'
  }

  created() {
    //
  }
  
  activated() {
    //
  }

  mounted() {
    //
  }

  // 初始化函数
  init() {
    //
  }
    
}
`

// scss 模版
const scssTep = `@import "@/assets/scss/variables.scss";

.${dirName}-wrap {
  width: 100%;
}
`

// interface 模版
const interfaceTep = `// ${dirName}.Data 参数类型
export interface ${capPirName}Data {
  pageName: string
}

// VUEX ${dirName}.State 参数类型
export interface ${capPirName}State {
  author?: string
}

// GET_DATA_ASYN 接口参数类型
// export interface DataOptions {}

`

// vuex 模版
const vuexTep = `import { ${capPirName}State } from '@/types/views/${dirName}.interface'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import * as ${capPirName}Api from '@/api/${dirName}'

const state: ${capPirName}State = {
  author: '三毛'
}

// 强制使用getter获取state
const getters: GetterTree<${capPirName}State, any> = {
  author: (state: ${capPirName}State) => state.author
}

// 更改state
const mutations: MutationTree<${capPirName}State> = {
  // 更新state都用该方法
  UPDATE_STATE(state: ${capPirName}State, data: ${capPirName}State) {
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { return }
      state[key] = data[key]
    }
  }
}

const actions: ActionTree<${capPirName}State, any> = {
  UPDATE_STATE_ASYN({ commit, state: ${capPirName}State }, data: ${capPirName}State) {
    commit('UPDATE_STATE', data)
  },
  // GET_DATA_ASYN({ commit, state: LoginState }) {
  //   ${capPirName}.getData()
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}

`

// api 接口模版
const apiTep = `import Api from '@/utils/request'

export const getData = (data) => {
  return Api.getData(data)
}

`

fs.mkdirSync(`${basePath}/views/${dirName}`) // mkdir

process.chdir(`${basePath}/views/${dirName}`) // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep) // vue 
fs.writeFileSync(`${dirName}.ts`, tsTep) // ts
fs.writeFileSync(`${dirName}.scss`, scssTep) // scss

process.chdir(`${basePath}/types/views`); // cd types
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep) // interface

process.chdir(`${basePath}/store/module`); // cd store
fs.writeFileSync(`${dirName}.ts`, vuexTep) // vuex

process.chdir(`${basePath}/api`); // cd api
fs.writeFileSync(`${dirName}.ts`, apiTep) // api

process.exit(0)