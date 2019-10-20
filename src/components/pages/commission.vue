<template>
  <div class="block">
    <v-Breadcrumb :post="bread"></v-Breadcrumb>
    <div class="box">
      <el-form ref="form" :inline="true" size="small" :model="form" label-width="80px" class="box_form">
        <el-form-item label="时间区间:">
          <el-date-picker
            v-model="form.startTime"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" class="box_table" @sort-change='changeTableSort'  :header-cell-style="tableHeaderColor" border stripe>
        <el-table-column prop="login_name" label="用户账号" sortable></el-table-column>
        <el-table-column prop="amount" label="昨日收益" sortable></el-table-column>
        <el-table-column prop="secondName" label="二级代理账号" v-if="roles==6" sortable></el-table-column>
        <el-table-column prop="secondCommision" label="二级代理返佣" sortable></el-table-column>
        <el-table-column prop="firstCommision" label="一级代理返佣" v-if="roles==6" sortable></el-table-column>
        <el-table-column prop="createDate" label="结算时间" sortable></el-table-column>
      </el-table>
      <v-Paging></v-Paging>
    </div>
  </div>
</template>

<script>
	import vBreadcrumb from '@/components/common/Breadcrumb.vue';
	import base from '@/components/common/base.vue';

	export default {
		mixins: [base],
		components: {
			vBreadcrumb
		},
		data() {
			return {
				bread: {
					path: '/commission',
					data: '返佣查询'
				},
				form: {
					startTime: ''
				}
			}
		},
		computed: {
			roles() {
				if (this.$store.state.userInfo && this.$store.state.userInfo.userInfo) {
					return this.$store.state.userInfo.userInfo.roleType;
				}
			},
		},
		methods: {
			changeTableSort(column) {
				let fieldName = column.prop;
				let sortingType = column.order;
				if (sortingType == "descending") {
					this.tableData = this.tableData.sort((a, b) => b[fieldName] - a[fieldName]);
				} else {
					this.tableData = this.tableData.sort((a, b) => a[fieldName] - b[fieldName]);
				}
			},
			search() {
				this.getData()
			},
			reset() {
				this.form.startTime = '';
				this.$store.dispatch('initiValue');
				this.getData();
			},
			// 获取返佣查询列表数据
			getData() {
				let params = {
					// firstId: '',
					// secondId: '',
					pageSize: this.pager.perPage,
					pageNo: this.pager.page
				};
				if (this.form.startTime) {
					params.startDate = this.form.startTime[0];
					params.endDate = this.form.startTime[1];
				}
				this.RestClient('GET_LIST', '/wallet/commision', params).then((res) => {
					if (res.data.code == 200) {
						this.$store.dispatch('tableData',res.data.data);
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
  .block {
    .block_top {
      background: #fff;
      height: 70px;
      padding: 15px;

      .column {
        padding-top: 10px;
      }
    }

    .box {
      margin-top: 20px;
      background: #fff;
      padding: 20px;

      .box_form {
        padding-top: 10px;
      }

      .box_table {
        margin-top: 20px;

        .box_table_drop {
          color: #409EFF;

          .el-dropdown-link {
            margin-left: 10px;
          }
        }
      }
    }
  }
</style>
