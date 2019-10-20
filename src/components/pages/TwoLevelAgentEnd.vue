<template>
  <div class="end_container">
    <div class="alert" v-if="isdeFaultPass">
      <i class="el-icon-warning"></i>
      你是以默认密码Abcd1234登录，为保障资金安全，请立即
      <el-button type=text @click="gotoset">修改密码</el-button>
    </div>
    <div class="end_top">
      <div class="top_left">
        <p>总资产折合: <b>{{assets}}</b> =<span>{{assets2}}</span></p>
        <a :href="getBindurl">点击进入小白交易所</a>
      </div>
      <el-row>
        <el-button type="primary" size="small" @click="gotoShow">提币</el-button>
      </el-row>
    </div>
    <div class="end_middle">
      <div>
        <div>
          <i class="el-icon-s-ticket"></i>
        </div>
        <div>
          <p>可提币资产</p>
          <h3>{{wallterDetail.balance | numFormat}}</h3>
        </div>
      </div>
      <div>
        <div>
          <i class="el-icon-s-ticket"></i>
        </div>
        <div>
          <p>提币资产</p>
          <h3>{{wallterDetail.transfered | numFormat}}</h3>
        </div>
      </div>
      <div v-if="getbindStatus==0" class="binding">
        <div>
          <p>绑定小白交易所账号</p>
          <h3>未绑定</h3>
        </div>
        <el-button type="text" class="goBind" @click="goBind">去绑定</el-button>
      </div>
      <div v-else class="binding">
        <div>
          <p>绑定小白交易所账号</p>
          <h3>已绑定</h3>
        </div>
        <p class="rmBind" @click="unBind">解除绑定</p>
      </div>
    </div>
    <div class="end_bottom">
      <div class="end_filter">
        <el-form :model="searchForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="时间区间:" size="small">
            <el-date-picker
              v-model="searchForm.createdate"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="资产类型:" size="small">
            <el-select v-model="searchForm.recordType" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="返佣" value="3"></el-option>
              <el-option label="提币" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button type="primary" size="small" @click="getData">查找</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-row>
      </div>
      <el-table :data="tabledata">
        <el-table-column label="资产类型">
          <template slot-scope="scope">
            <span v-if="scope.row.recordType==3">返佣</span>
            <span v-if="scope.row.recordType==4">提币</span>
          </template>
        </el-table-column>
        <el-table-column prop="this.searchForm.recordType" label="资产记录">
          <template slot-scope="scope">
            <span v-if="scope.row.amount>=0" style="color:#04F21C;">+{{scope.row.amount}}</span>
            <span v-if="scope.row.amount<0" style="color:#D9001B;">{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="时间"></el-table-column>
      </el-table>
      <v-Paging></v-Paging>
    </div>

    <el-dialog title="小白交易所" :visible.sync="binding">
      <iframe :src="getBindurl" width="100%" height="500" frameborder="0" scrolling="no"></iframe>
    </el-dialog>
    <el-dialog title="提币" :visible.sync="coinType" width="40%">
      <el-form :model="addForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="提币数量:" size="small">
          <el-input v-model="addForm.mount" placeholder="请输入内容" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="coinType = false">取 消</el-button>
        <el-button type="primary" @click="gotocoin">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
	import base from '@/components/common/base.vue';
	import {mapState, mapGetter} from 'vuex'
	export default {
		mixins: [base],
		name: "TwoLevelAgentEnd",
		data() {
			return {
				wallterDetail: {},
				binding: false,
				searchForm: {
					recordType: '',
					createdate: ''
				},
				coinType: false,
				addForm: {
					mount: 0
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
		computed: {
			...mapState({
				getbindStatus() {
					if (this.$store.state.userInfo.userInfo) {
						return this.$store.state.userInfo.userInfo.bindStatus;
					}
				}
			}),
			getBindurl() {
				return this.$store.state.bindUrl
			},
			isdeFaultPass() {
				return sessionStorage.getItem('isDefaultPassword')
			}
		},
		methods: {
			gotoShow() {
				this.coinType = true;
			},
			gotoset() {
				this.$router.push({
					path: '/setting'
				})
			},
			// 重置
			reset() {
				this.searchForm.recordType = "";
				this.searchForm.createdate = "";
				this.$store.dispatch('initiValue');
				this.getData();
			},
			goBind() {
				this.binding = true;
				// location.href=this.getBindurl;
			},
			//获取资产详情
			getwalletDetail() {
				this.RestClient('GET_BASE', '/wallet/detail').then((res) => {
					if (res.data.code == 200) {
						this.wallterDetail = {
							...res.data.data
						}
						// this.$store.commit('upDataTotal',res.data.data.total);
						// let tableData=[...res.data.data.data];
						// this.$store.dispatch('tableData',tableData)
					}
				})
			},
			// 获取资产列表数据
			getData() {
				let params = {
					pageSize: this.pager.perPage,
					pageNo: this.pager.page
				};
				if (this.searchForm.recordType || this.searchForm.createdate) {
					console.log(this.searchForm.recordType);
					params.recordType = this.searchForm.recordType;
					params.createdate = this.searchForm.createdate;
				}
				this.RestClient('GET_LIST', '/wallet/records', params).then((res) => {
					if (res.data.code == 200) {
						this.$store.dispatch('tableData',res.data.data);
					}
				})
			},
			gotocoin() {
				let params = {
					amount: this.addForm.mount
				};
				if (this.addForm.mount > this.wallterDetail.balance) {
					this.$message({
						message: '提币数量超过可提币数量，请重新输入',
						type: 'info'
					});
					return;
				}
				this.RestClient('CREATE', '/wallet/outgo', params).then((res) => {
					if (res.data.code == 200) {
						this.$message({
							message: '提币成功',
							type: 'success'
						});
						this.getwalletDetail();
						this.coinType = false;
					}
				})
			},
			unBind() {
				this.RestClient('GET_BASE', '/user/unbind').then((res) => {
					if (res.data.code == 200) {
						this.$message({
							message: res.data.message,
							type: 'success'
						});
						this.getwalletDetail()
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
  .alert {
    border: 1px solid #fdf6ec;
    background: #fef0f0;
    color: #f56c6c;
    font-size: 14px;
    margin-bottom: 15px;
    border-radius: 8px;
    padding-left: 15px;
  }

  .end_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 15px;
    margin-bottom: 10px;

    .top_left {
      p {
        font-size: 18px;
        margin-bottom: 10px;
      }

      b {
        font-size: 22px;
        color: rgb(21, 133, 255);
      }

      span {
        font-size: 14px;
      }

      a {
        font-size: 14px;
        color: rgb(21, 133, 255);
      }
    }
  }

  .end_middle {
    display: flex;
    justify-content: space-between;
    margin-right: -10px;
    margin-bottom: 10px;

    .binding {
      position: relative;

      .rmBind, .goBind {
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 2px 15px;
        color: white;
        font-size: 14px;
      }

      .rmBind {
        background: #ccc;
      }

      .goBind {
        background: red;
      }
    }
  }

  .end_middle > div {
    padding: 15px 0px 30px 15px;
    display: inline-block;
    flex: 1;
    margin-right: 10px;
    background: white;
    display: flex;
    align-items: center;

    p {
      color: #ccc;
    }

    i {
      font-size: 20px;
      margin-right: 20px;
    }

    h3 {
      font-size: 30px;
      font-weight: normal;
    }
  }

  .end_bottom {
    background: #fff;
    padding: 20px 30px 20px;

    .end_filter {
      display: flex;
      padding-bottom: 40px;

      .el-form-item {
        margin-bottom: 0px;
      }

      .el-row {
        margin-left: 2%;
      }

    }
  }
</style>
