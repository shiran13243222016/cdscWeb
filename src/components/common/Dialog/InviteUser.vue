<template>
  <!--邀请用户注册弹出框-->
  <el-dialog title="邀请用户注册" :visible.sync="user_dialogVisible" width="35%" class="user_dialog" @close="cancle">
    <label style="padding-right:15px;">您的邀请码为 <em style="font-style: normal;color:orange;font-size:22px;">{{invatCode}}</em></label>
    <el-button type="primary"
       v-clipboard:copy="invatCode"
       v-clipboard:error="onError"
       v-clipboard:success="onCopy"
       size="small">复制邀请码
    </el-button>
    <div>被邀请用户需要先 <a :href="yaoUrl"> 下载云链APP </a>, 注册时填入邀请码即可</div>
    <h3>扫码下载云链APP</h3>
    <div id="qrcode" style="margin-top:20px;"></div>
  </el-dialog>
</template>

<script>
	import QRCode from 'qrcodejs2'
	export default {
		name: "InviteUser",
		data() {
			return {
				user_dialogVisible: false,
				invatCode: ''
			}
		},
		computed: {
			invateCode() {
				if (this.$store.state.userInfo && this.$store.state.userInfo.userInfo) {
					return this.$store.state.userInfo.userInfo.inviteCode;
				}
			},
			yaoUrl() {
				// let url = `${location.href.split("#")[0]}#/registered?code=${this.code}`;
				let url = 'http://download.371738.com/cdscAPP_1.0.3.apk';
				return url;
			},
		},
		methods: {
			param(parentDate) {
				this.invatCode = parentDate.invateCode;
				this.user_dialogVisible = parentDate.show;
			},
			cancle() {
				this.$emit('childSay', '自页面数据')
			},
			useqrcode() {
				// let url = `${location.href.split("#")[0]}#/registered?invitecode=${this.invateCode}`;
				let url = this.yaoUrl;
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
  .user_dialog h3 {
    font-weight: normal;
    margin: 15px 0;
  }

  .user_dialog p {
    font-weight: bolder;
    font-size: 30px;
  }

  .user_dialog button {
    padding: 10px 15px;
    margin: 15px 0;
    border: 0 none;
    outline: none;
    font-size: 14px;
  }

  .user_dialog div {
    border-bottom: 1px solid #ccc;
    padding: 20px 0;
  }

  .user_dialog span {
    box-sizing: border-box;
    display: block;
    width: 150px;
    height: 150px;
    background: #eee;
    padding: 50px 20px;
    text-align: center;
  }
</style>
