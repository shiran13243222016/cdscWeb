<template>
  <div>
    <!--新增代理弹出框-->
    <el-dialog :title="'添加' + addAgent_dialog_tit + '代理'" :visible.sync="addAgent_dialog" width="35%">
      <div class="dialog_selected">
        <p><i class="el-icon-info"></i> 一级代理的默认登录密码和安全密码均为Abcd1234，登录后将提示其自行修改</p>
      </div>
      <el-form ref="form" :rules="addAgent_rules" :model="addAgent_dialog_form" label-width="120px" class="mgt20">
        <el-form-item :label="addAgent_dialog_tit + '代理手机'" prop="iphone">
          <el-input v-model="addAgent_dialog_form.iphone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="返佣比例:" prop="scale">
          <el-input v-model="addAgent_dialog_form.maid_scale" placeholder="请输入">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addAgent_dialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addAgent_dialog = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
	export default {
		name: "DialogBase",
		data() {
			return {
				addAgent_dialog: false,
				addAgent_dialog_tit: '',
				addAgent_dialog_form: {
					iphone: '',
					maid_scale: ''
				},
				addAgent_rules: {
					iphone: [
						{required: true, message: '请输入手机号码', trigger: 'change'}
					],
					scale: [
						{required: true, message: '请输入返佣比', trigger: 'change'}
					]
				},
				invite_dialogVisible: false,

			}
		},
		methods: {
			addAgent(e) {
				this.addAgent_dialog_tit = e;
				this.addAgent_dialog = true;
			}
		}
	}
</script>

<style lang="scss" scoped>

  .dialog_selected {
    padding: 8px;
    background: rgb(224, 246, 255);
    border: 1px solid rgb(173, 225, 254);

    i, span {
      color: rgb(25, 120, 254);
    }
  }


</style>
