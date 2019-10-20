<template>
  <div>
    <!--补币弹出框-->
    <el-dialog title="补币" :visible.sync="dialogVisible" width="35%" class="dialog" @close="cancle('form')">
      <el-form ref="form" :model="addform" class="form" label-width="120px">
        <!--<el-alert title="请输入正确的补币额度" type="error" show-icon></el-alert>-->
        <el-form-item label="用户:">
          <p>{{addform.user}}</p>
        </el-form-item>
        <el-form-item label="补币金额:">
          <el-input v-model="addform.supply" placeholder="请输入USDT数量" size="small">
            <template slot="append">USDT</template>
          </el-input>
        </el-form-item>
        <el-form-item label="安全密码:">
          <el-input v-model="addform.pass" :type="passType" placeholder="请输入安全密码" size="small">
            <template slot="append">
              <i @click="changeType" class="fa inteye" :class="{'fa-eye-slash':passType=='password','fa-eye':passType=='text'}"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer">
        <el-button @click="cancle('form')" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm('form')" size="small">确 定</el-button>
      </el-row>
    </el-dialog>

    <!--收益比弹出框-->
    <el-dialog title="收益比" :visible.sync="profit_dialog" width="35%" class="profit_dialog" @close="cancle('profit_form')">
      <el-form ref="profit_form" :rules="profit_rules" :model="profit_form" class="profit_form" label-width="120px">
        <el-alert title="所有用户默认收益比为100%，收益比修改后将在次日生效." type="error" show-icon></el-alert>
        <el-form-item label="用户:" prop="user">
          <p>{{profit_form.user}}</p>
        </el-form-item>
        <el-form-item label="收益比:" prop="profit">
          <el-input v-model="profit_form.profit" type="number" placeholder="100" size="small">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="安全密码:" prop="pass">
          <el-input v-model="profit_form.pass" :type="passType" placeholder="请输入安全密码" size="small">
            <template slot="append">
              <i @click="changeType" class="fa inteye" :class="{'fa-eye-slash':passType=='password','fa-eye':passType=='text'}"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer">
        <el-button @click="cancle('profit_form')" size="small">取 消</el-button>
        <el-button type="primary" @click="chargemoney('profit_form')" size="small">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
	import 'font-awesome/scss/font-awesome.scss'

	export default {
		name: "ProfitSupply",
		data() {
			return {
				dialogVisible: false,
				passType: 'password',
				addform: {
					user: '',
					supply: '',
					pass: ''
				},
				rules: {
					supply: [
						{required: true, message: '请输入金额', trigger: 'change'}
					],
					pass: [
						{required: true, message: '请输入密码', trigger: 'change'}
					]
				},
				userId: '',
				row: {},
				profit_dialog: false,
				profit_form: {
					user: '',
					profit: '',
					pass: ''
				},
				profit_rules: {
					user: [
						{message: '请输入数值', trigger: 'change'}
					],
					profit: [
						{required: true, message: '请输入金额', trigger: 'change'}
					],
					pass: [
						{required: true, message: '请输入密码', trigger: 'change'}
					]
				}
			}
		},
		methods: {
			changeType() {
				if (this.passType == 'password') {
					this.passType = "text"
				} else {
					this.passType = "password"
				}
			},
			param(parentDate) {
				if (parentDate.show === 'supply') {
					this.dialogVisible = true;
					this.addform.user = parentDate.user;
					this.userId = parentDate.id
				}
				if (parentDate.show === 'profit') {
					this.profit_dialog = true;
					this.profit_form.user = parentDate.user;
					this.id = parentDate.userId
				}
			},
			cancle() {
				this.addform = {
					user: '',
					supply: '',
					pass: ''
				};
				this.profit_form = {
					user: '',
					profit: '',
					pass: ''
				};
				this.dialogVisible = false;
				this.profit_dialog = false;
			},
			chargemoney(form) {
				const self = this;
				//修改收益比
				this.$refs[form].validate((valid) => {
					if (valid) {
						if (this.profit_form.profit > 100) {
							self.$message({
								message: '请输入正确的收益比',
								type: 'info'
							});
							return;
						}
						let params = {
							id: self.id,
							commisionRate: parseFloat(this.profit_form.profit) / 100,
							safePassword: this.profit_form.pass
						};
						this.RestClient('CREATE', '/user/changeRate', params).then((res) => {
							if (res.data.code === 200) {
								self.$message({
									message: res.data.message,
									type: 'success'
								});
								self.$emit('childSay', res.data.code);
								self.cancle();
								// self.profit_dialog = false;
							}

						});
					} else {
						return false;
					}
				})
			},
			confirm(form) {
				//补币
				const self = this;
				this.$refs[form].validate((valid) => {
					if (valid) {
						let params = {
							userId: this.userId,
							amount: this.addform.supply,
							safePassword: this.addform.pass
						};
						this.RestClient('CREATE', '/wallet/recharge', params).then((res) => {
							if (res.data.code === 200) {
								self.$message({
									message: res.data.message,
									type: 'success'
								});
								self.$emit('childSay', res.data.code);
								self.cancle();
								// self.dialogVisible = false;
							}
						});
					} else {
						return false;
					}
				})
			}
		}
	}
</script>

<style scoped>
  .inteye {
    display: inline-block;
    width: 30px;
    text-align: center;
    font-size: 22px;
  }
</style>
