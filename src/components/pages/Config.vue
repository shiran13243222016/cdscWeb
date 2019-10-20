<template>
  <div>
    <v-Breadcrumb :post="bread"></v-Breadcrumb>
    <div class="config">
      <el-table :data="tableData" :header-cell-style="tableHeaderColor" border stripe>
        <el-table-column prop="keyCode" label="字段名"></el-table-column>
        <el-table-column label="字段值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.keyValue" v-if="scope.row.statusEdit=='edit'"></el-input>
            <span v-else>{{scope.row.keyValue}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" v-if="scope.row.statusEdit=='edit'"></el-input>
            <span v-else>{{scope.row.name?scope.row.name:'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="描述" width="260">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remarks" v-if="scope.row.statusEdit=='edit'"></el-input>
            <span v-else>{{scope.row.remarks?scope.row.remarks:'--'}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="createDate" label="创建时间">-->
        <!--  <template slot-scope="scope">-->
        <!--    <span>{{scope.row.createDate?scope.row.createDate:'&#45;&#45;'}}</span>-->
        <!--  </template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="edit(scope.$index)" type="text" v-if="!scope.row.statusEdit">编辑</el-button>
            <el-button type="text" size="small" v-if="scope.row.statusEdit=='edit'" @click="saveconfig(scope.$index,scope.row)">保存</el-button>
            <el-button type="text" size="small" v-if="scope.row.statusEdit=='edit'" @click="cancel(scope.$index,scope.row)">取消</el-button>
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
		name: "Config",
		data() {
			return {
				bread: {
					path: '/config',
					data: '配置管理'
				},
				statusEdit: '',
				table: {
					keyValue: '',
					name: '',
					remarks: ''
				}
			}
		},
		components: {
			vBreadcrumb
		},
		methods: {
			edit($index) {
				this.$set(this.tableData[$index], 'statusEdit', 'edit');
			},
			cancel($index, table) {
				this.$set(this.tableData[$index], 'statusEdit', '');
				this.table = {
					keyValue: '',
					name: '',
					remarks: '',
					keyCode: ''
				};
				this.getData();
			},
			saveconfig($index, table) {
				let params = {
					keyCode: table.keyCode,
					keyValue: table.keyValue,
					name: table.name,
					remarks: table.remarks,
					id: table.id
				};
				this.RestClient('CREATE', '/sys/config/save', params).then((res) => {
					if (res.data.message) {
						this.$message({
							message: res.data.message,
							type: 'success'
						});
					};
					if (res.data.code == 200) {
						this.cancel($index, table);
					};
					this.getData()
				})
			},
			getData() {
				let params = {
					pageSize: this.pager.perPage,
					pageNo: this.pager.page
				};
				this.RestClient('GET_LIST', '/sys/config/list', params).then((res) => {
					if (res.data.code == 200) {
						this.$store.dispatch('tableData',res.data.data);
					}
				})
			}
		}
	}
</script>

<style scoped>
  .config {
    background: #fff;
    padding: 30px;
  }

</style>
