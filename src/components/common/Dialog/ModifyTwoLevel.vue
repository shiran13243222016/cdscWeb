<template>
  <!--添加二级代理-->
  <el-dialog :title="dialogTitle" :visible.sync="add_dialogVisible" width="35%" class="add_dialog" @close="cancle('add_form')">
    <el-form ref="add_form" :rules="addRules" :model="add_form" class="add_form" label-width="120px">
      <el-alert
        :title="alertTitle"
        :type="type"
        show-icon>
      </el-alert>
      <el-form-item :label='oneLabel+":"' prop="phone">
        <el-input v-model="add_form.phone" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="返佣比例:" prop="ratio">
        <el-input v-model="add_form.ratio" placeholder="请输入">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-row slot="footer">
      <el-button @click="cancle('add_form')" size="small">取 消</el-button>
      <el-button type="primary" @click="confirm('add_form')" size="small">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
	export default {
		name: "AddTwoLevel",
		data() {
			return {
				dialogTitle: '',
				oneLabel: '',
				alertTitle: '',
				add_dialogVisible: false,
				type: 'info',
				id: '',
				add_form: {
					phone: '',
					ratio: ''
				},
				addRules: {
					phone: [
						{required: true, message: '请输入', trigger: 'blur'}
					],
					ratio: [
						{required: true, message: '请输入', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
			param({show, dialogTitle, alertTitle, oneLabel, type, ratio, id}) {
				// this.add_dialogVisible = show;
				// this.dialogTitle = dialogTitle;
				// this.alertTitle = alertTitle;
				// this.oneLabel = oneLabel;
				// this.type = type;
				// this.add_form.ratio = ratio;
				// this.id=id
			},
			cancle(add_form) {
				this.supply_form = {};
				this.$refs[add_form].resetFields();
				this.add_dialogVisible = false;
			},
			confirm(add_form) {
				this.$refs[add_form].validate((valid) => {
					if (valid) {

						//前后台交互,成功关闭窗口，父页面刷新数据。失败关闭窗口给出提示
						this.$emit('childSay', '自页面数据');
						this.add_dialogVisible = false;
					} else {
						return false;
					}
				})
			}
		}
	}
</script>

<style scoped>

  .add_dialog >>> .el-alert {
    margin-bottom: 20px;
  }

  .add_dialog >>> .el-alert--info {
    border: 1px solid rgb(71, 166, 234);
    background: rgb(233, 247, 254);
    color: rgb(71, 166, 234);
  }

  .add_dialog >>> .el-alert--error {
    border: 1px solid rgb(242, 167, 161);
  }
</style>
