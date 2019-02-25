<template>
	<div class="test-wrap">{{data.componentName}}</div>
</template>

<script lang="ts">
	import { Component, Vue, Prop } from "vue-property-decorator"
	import { Getter, Action } from 'vuex-class'
	import { TestData } from '@/types/components/test.interface'
	// import {  } from "@/components" // 组件

	@Component({})
	export default class About extends Vue {
		// prop
		@Prop({
			required: false,
			default: ''
		}) name!: string

		// data
		data: TestData = {
			componentName: 'test'
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

	.test-wrap {
		width: 100%;
	}
</style>

