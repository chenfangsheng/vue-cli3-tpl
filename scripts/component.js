/*
 * @Description: 组件快速生成脚本
 * @Date: 2018-12-06 10:26:23
 * @LastEditTime: 2018-12-12 16:09:40
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
    {{data.componentName}}
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator"
  import { Getter, Action } from 'vuex-class'
  import { ${capPirName}Data } from '@/types/components/${dirName}.interface'
  // import {  } from "@/components" // 组件

  @Component({})
  export default class About extends Vue {
    // prop
    @Prop({
      required: false,
      default: ''
    }) name!: string

    // data
    data: ${capPirName}Data = {
      componentName: '${dirName}'
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

  }
</script>

<style lang="scss">
  @import "@/assets/scss/variables.scss";

  .${dirName}-wrap {
    width: 100%;
  }
</style>

`

// interface 模版
const interfaceTep = `// ${dirName}.Data 参数类型
export interface ${capPirName}Data {
  componentName: string
}

`

fs.mkdirSync(`${basePath}/components/${dirName}`) // mkdir

process.chdir(`${basePath}/components/${dirName}`) // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep) // vue 

process.chdir(`${basePath}/types/components`) // cd components
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep) // interface 

process.exit(0)