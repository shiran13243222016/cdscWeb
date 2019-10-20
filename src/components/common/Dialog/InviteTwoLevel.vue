<template>
  <!--邀请二级代理弹出框-->
  <el-dialog :visible.sync="invite_dialogVisible" class="invite_dialog" title="邀请二级代理注册" width="35%">
    <div class="modeOne">
      <h3 style="margin-bottom:15px;">方式一</h3>
      <p style="margin-bottom:15px;">您的邀请链接为</p>
      <a :href="yaoUrl" style="text-decoration:underline;color:#409EFF;margin-bottom:15px;"
         target="_blank">{{yaoUrl}}</a>
      <p style="margin:15px 0;">
        <el-button type="primary"
           v-clipboard:copy="yaoUrl"
           v-clipboard:error="onError"
           v-clipboard:success="onCopy">复制邀请链接
        </el-button>
      </p>
      <p style="border-bottom:1px solid #ccc;padding-bottom: 30px;">
        复制后可邀请二级代理注册，邀请成功后，需对每个二级代理设置返佣比，否则二级代理将无法正常使用系统。</p>
      <h3 style="margin-bottom:15px;">方式二</h3>
      <p>鼠标右键点击下图，可复制邀请二维码。</p>
      <div id="qrcode" style="margin-top:20px;"></div>
    </div>
  </el-dialog>
</template>

<script>
	import QRCode from 'qrcodejs2'
	export default {
		name: "InviteTwoLevel",
		data() {
			return {
				invite_dialogVisible: false,
				inviteLink: '',
				code: '',
			}
		},
		computed: {
			yaoUrl() {
				let url = `${location.href.split("#")[0]}#/registered?code=${this.code}`
				return url;
			},
			QRCode: QRCode,
		},
		mounted() {
			// this.isYaoFn()
		},
		methods: {
			param(parentDate) {
				this.invite_dialogVisible = parentDate.show || false;
				this.inviteLink = parentDate.invitelink || '';
				this.code = parentDate.inviteCode;
			},
			useqrcode() {
				let url = `${location.href.split("#")[0]}#/registered?invitecode=${this.code}`;
				this.isOne = true;
				let qrcode = new QRCode('qrcode', {
					width: 150,
					height: 150, // 高度
					text: url, // 二维码内容
					// render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
					// background: '#f0f',
					// foreground: '#ff0'
				})
			},
			isYaoFn() {
				let self = this;
				self.invite_dialogVisible = true;
				if (!self.isOne) {
					setTimeout(self.useqrcode, 0)
				}
			},
			onCopy(e) {
				this.$message({
					message: "复制成功",
					type: 'success'
				});
			},
			onError(e) {
				this.$message({
					message: "复制失败",
					type: 'warning'
				});
			},
		}
	}
</script>

<style scoped>
  .invite_dialog h2 {
    font-size: 16px;
    font-weight: normal;
  }

  .invite_dialog h3 {
    margin: 10px 0;
    font-size: 14px;
  }

  .invite_dialog button {
    border: 0 none;
    outline: none;
    padding: 10px 30px;
    background: rgb(71, 166, 234);
    margin: 10px 0;
    color: #fff;
  }


  .modeTwo h2 {
    margin: 10px 0;
  }

  .modeTwo p {
    width: 100px;
    height: 100px;
    background: #eee;
  }
</style>
