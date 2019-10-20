<template>
  <div>
    <div class="block">
      <div class="block_left">
        <span>共&nbsp;{{total}}&nbsp;条记录&nbsp;&nbsp; 第&nbsp;{{page + '&nbsp;/&nbsp;' + totalPage}}</span>
      </div>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :page-sizes="[10, 20, 50]"
        :page-size="pager.perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
	export default {
		name: 'paging',
		computed: {
			total() {
				return this.$store.state.total || 0;
			},
			pager() {
				return this.$store.state.pager || 0;
			},
			page() {
				if (this.total == 0 && this.totalPage == 0) {
					return 0;
				} else {
					return this.pager ? this.pager.page : 0;
				}

			},
			totalPage() {
				return Math.ceil(Number(this.total / this.perPage)) || 0;
			},
			perPage() {
				return this.pager ? this.pager.perPage : 0;
			},
		},
		methods: {
			handleSizeChange(val) {  // 每页显示多少条数据
				this.$store.dispatch('changePager', {perPage: val})
			},
			handlePageChange(val) {  // 当前是第几页
				this.$store.dispatch('changePager', {page: val})
			},
		}
	}
</script>

<style scoped>
  .block {
    display: flex;
    align-items: center;
    color: rgb(132, 132, 132);
  }

  .block_left {
    font-size: 14px;
  }

  .block >>> .el-pagination {
    margin-left: auto;
    display: flex;
    padding: 20px 0;
    color: #aaa;
  }

  .block >>> .el-pagination__total {
    display: none;
  }

  .el-pagination >>> .el-pagination__sizes {
    order: 1;
    margin-left: 20px;
  }

  .el-pagination >>> .el-pagination__jump {
    order: 2;
  }
</style>
