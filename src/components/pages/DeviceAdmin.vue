<template>
  <div>
    <v-Breadcrumb :post="bread"></v-Breadcrumb>
    <div class="device">
      <div class="device_filter">
        <el-form :model="addForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="设备编号:">
            <el-input size="small" v-model="addForm.minerDeviceId" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="归属用户:">
            <el-input size="small" v-model="addForm.loginName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button type="primary" size="small" @click="search">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-row>
      </div>
      <div class="device_handle">
        <!--<el-button size="small">全部导出</el-button>-->
      </div>
      <el-table :data="tableData" :header-cell-style="tableHeaderColor" border stripe>
        <el-table-column prop="minerDeviceId" label="设备编号" min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="loginName" label="归属用户" width="120"></el-table-column>
        <el-table-column prop="account" label="Account" min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="diskInfo" label="总存储(GB)" width="200"></el-table-column>
        <el-table-column prop="cpuInfo" label="CPU型号" width="200"></el-table-column>
        <el-table-column prop="yesterdayIncome" label="昨日收益"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" sortable width="180"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="look(scope.row)" type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <v-Paging></v-Paging>
    </div>
  </div>
</template>

<script>
	import base from '@/components/common/base.vue';
	import vBreadcrumb from '@/components/common/Breadcrumb.vue';
	export default {
		mixins: [base],
		name: "DeviceAdmin",
		data() {
			return {
				bread: {
					path: '/deviceAdmin',
					data: '设备管理'
				},
				addForm: {
					loginName: '',
					minerDeviceId: '',
				},
				rules: {
					name: [
						{message: '请输入账号', trigger: 'blur'},
						{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
					],
					region: [
						{message: '请选择状态', trigger: 'change'}
					]
				}
			}
		},
		components: {
			vBreadcrumb
		},
		methods: {
			look(el) {
				this.$router.push({path: '/lookDevice', query: {id: el.id}})
			},
			reset() {
				this.addForm.loginName = '';
				this.addForm.minerDeviceId = "";
				this.$store.dispatch('initiValue');
				let data = {
					...this.addForm
				};
				this.getData(data);
			},
			search() {
				let data = {
					...this.addForm
				};
				this.getData(data)
			},
			// 获取设备管理列表
			getData(parameter) {
				let formParams = parameter ? parameter : {};
				let params = {
					pageSize: this.pager.perPage,
					pageNo: this.pager.page,
					...formParams
				};
				// params.minerDeviceId='';
				//     params.loginName='';
				//        params.userId='';
				this.RestClient('GET_LIST', '/device/list', params).then((res) => {
					if (res.data.code == 200) {
						this.$store.dispatch('tableData',res.data.data);
					}
				})
			}
		}
	}
</script>

<style scoped>
  .device {
    padding: 20px;
    background: #fff;
  }

  .device > .device_filter {
    display: flex;
    align-items: center;
  }

  .device > .device_handle {
    margin: 20px 0;
  }

  .device_filter >>> .el-form {
    display: flex;
    margin-right: 2%;
  }

  .el-form >>> .el-form-item {
    margin-bottom: 0;
  }
</style>
