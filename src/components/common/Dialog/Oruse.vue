<template>
  <!--停用用户弹出框-->
  <el-dialog :title="title" :visible.sync="oruse_dialogVisible" width="35%" :show-close="false" class="oruse_dialog" @close="cancle('oruse_form')">
    <el-form ref="oruse_form" :rules="oruseRules" :model="oruse_form" class="disuse_form">
      <el-form-item class="form_content">
        <el-input v-model="oruse_form.pass" placeholder="请输入安全密码"></el-input>
      </el-form-item>
    </el-form>
    <el-row slot="footer" class="form_foot">
      <el-button @click="cancle('oruse_form')" size="small">取 消</el-button>
      <el-button type="primary" @click="confirm('oruse_form')" size="small">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
	export default {
		name: "Oruse",
		data() {
			return {
				oruse_dialogVisible: false,
				title: '停用',
				oruse_form: {
					pass: '',
				},
				passType: 'password',
				id: '',
				oruseRules: {
					pass: [
						{type: 'password', required: true, message: '请输入密码', trigger: 'blur'}
					]
				},
			}
		},
		methods: {
			param(parentDate) {
				this.oruse_dialogVisible = parentDate.show;
				this.title = parentDate.title;
				this.id = parentDate.id
			},
			cancle(oruse_form) {
				this.form = {};
				this.$refs[oruse_form].resetFields();
				this.oruse_dialogVisible = false;
			},
			confirm(oruse_form) {
				this.$refs[oruse_form].validate((valid) => {
					if (valid) {
						//前后台交互,成功关闭窗口，父页面刷新数据。失败关闭窗口给出提示
						let params = {
							id: this.id
						};
						this.RestClient('GET_ONE', '/user/stop', params).then((res) => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.message,
									type: 'success'
								});
								this.$emit('childSay');
							}
						});
						this.oruse_dialogVisible = false;
					} else {
						return false;
					}
				})
			}

		}
	}
</script>

<style scoped>

</style>
