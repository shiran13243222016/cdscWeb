<template>
  <div class="block_top">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: post.path}">{{ post.data }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="column">
      <h3>{{ post.data }}</h3>
    </div>
  </div>
</template>

<script>
	export default {
		name: "Breadcrumb",
		props: {
			post: {
				type: Object
			}
		}
	}
</script>

<style scoped>
  .block_top {
    background: #fff;
    height: 70px;
    padding: 15px;
    margin-bottom: 25px;
    margin-left: -10px;
    margin-right: -10px;
    margin-top: -9px;
    padding: 15px;
  }

  .block_top > .column {
    padding-top: 10px;
  }
</style>
