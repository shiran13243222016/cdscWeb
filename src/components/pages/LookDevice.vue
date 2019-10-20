<template>
  <div class="lookdevice">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看设备</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="device">
      <div class="device_top">
        <icon name="envelope" class="icon" scale="1.4"></icon>
        <p>编号: {{deviceinfo.minerDeviceId?deviceinfo.minerDeviceId:'--'}}</p>
      </div>
      <div class="device_middle">
        <div>
          <p>累计收益: {{deviceinfo.totalIncome|numFormat}}</p>
          <p>归属用户: {{deviceinfo.loginName?deviceinfo.loginName:'--'}}</p>
          <p>创建时间: {{deviceinfo.createDate?deviceinfo.createDate:'--'}}</p>
        </div>
        <div>
          <p>昨日收益</p>
          <b>{{deviceinfo.yesterdayIncome|numFormat}}</b>
        </div>
      </div>
    </div>
    <div class="device_content">
      <div class="empty"></div>
      <el-tabs>
        <el-tab-pane label="监控">
          <h3>设备监控</h3>
          <div class="monitor">
            <p>
              <span>IP</span>
              <span>{{deviceinfo.ip?deviceinfo.ip:'--'}}</span>
            </p>
            <p>
              <span>IP归属地</span>
              <template v-if="deviceip.country&&deviceip.city">
                <span>{{deviceip.country+'-'+deviceip.city}}</span>
              </template>
              <template v-else>
                <span>--</span>
              </template>
            </p>
            <p>
              <span>运营商</span>
              <span>{{deviceip.isp}}</span>
            </p>
            <p>
              <span>下载速度</span>
              <span>--</span>
            </p>
            <p>
              <span>上传速度</span>
              <span>--</span>
            </p>
            <p>
              <span>连续在线</span>
              <span>--</span>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="配置">
          <h3>配置查看</h3>
          <div class="config">
            <p>
              <span>总存储</span>
              <span>{{deviceinfo.diskInfo?deviceinfo.diskInfo+'GB':'--'}} </span>
            </p>
            <p>
              <span>CPU型号</span>
              <span>{{deviceinfo.cpuInfo?deviceinfo.cpuInfo:'--'}}</span>
            </p>
            <p>
              <span>端口</span>
              <span>{{deviceinfo.port?deviceinfo.port:'--'}}</span>
            </p>
            <p>
              <span>可用存储</span>
              <span>{{balance}}</span>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="收益">
          <h3>收益列表</h3>
          <el-table :data="tableData" :header-cell-style="tableHeaderColor" border stripe>
            <el-table-column prop="amount" label="收益"></el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">收益</span>
                <span v-if="scope.row.status==2">补币</span>
                <span v-if="scope.row.status==3">返佣</span>
                <span v-if="scope.row.status==4">提币</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间"></el-table-column>
          </el-table>
          <div style="padding:0 30px;">
            <vPaging></vPaging>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
	import base from '@/components/common/base.vue';
	import axios from 'axios'
	export default {
		mixins: [base],
		name: "lookDevice",
		data() {
			return {
				deviceinfo: {},
				deviceip: {}
			}
		},
    created(){
			this.getDevicedetail();
    },
		computed: {
			balance() {
				return this.deviceinfo.diskInfo * (1 - parseFloat(this.deviceinfo.diskUsage))
			}
		},
		methods: {
			// 获取设备详情
			getDevicedetail() {
				let deviceId = {
					id: this.$route.query.id
				};
				this.RestClient('GET_ONE', '/device/get', deviceId).then((res) => {
					if (res.data.code == 200) {
						this.deviceinfo = res.data.data;

						let ip = this.deviceinfo.ip;
						if (ip) {
							axios.get('http://ip-api.com/json/' + ip + '?lang=zh-CN').then((res)=>{
								this.deviceip = res.data;
              });
							// this.RestClient('GET_BASE', 'http://ip-api.com/json' + ip + '?lang=zh-CN', {}).then(res => {
							// 	console.log(res);
							// 	this.deviceip = res.data;
							// })
						}
					};
				})
			},
			//获取收益的
			getData() {
				let params = {
					pageSize: this.pager.perPage,
					pageNo: this.pager.page,
				};
				this.RestClient('GET_LIST', '/device/income', params).then((res) => {
					if (res.data.code == 200) {
						this.$store.dispatch('tableData',res.data.data);
					}
				})
			}
		}
	}
</script>

<style scoped>
  .lookdevice {
    background: #fff;
    padding: 20px 20px 0 20px;
    margin-left: -10px;
    margin-top: -9px;
    margin-right: -10px;
  }

  .device {
    padding-right: 20px;
  }

  .lookdevice > .el-breadcrumb {
    margin-bottom: 20px;
  }

  .device_top {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }

  .device_top > p {
    margin-left: 10px;
    margin-right: auto;
    font-size: 22px;
    font-weight: bolder;
  }

  .device_top >>> .mouse {
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 12px;
    padding: 2px 15px;
    line-height: 20px;
    cursor: pointer;
  }

  .device_middle {
    display: flex;
    justify-content: space-between;
  }

  .device_middle div {
    margin-left: 32px;
  }

  .device_middle > :nth-child(2) > p {
    text-align: right;
  }

  .device_middle p {
    font-size: 14px;
    margin-top: 10px;
    color: rgb(93, 93, 93);

  }

  .device_middle b {
    font-size: 20px;
    font-weight: normal;
  }

  .device_content {
    margin-top: 30px;
    position: relative;

  }

  .device_content > .empty {
    background: #f0f0f0;
    position: absolute;
    left: -20px;
    right: -20px;
    top: 40px;
    height: 20px;
  }

  .device_content >>> .el-tabs__nav {
    padding: 0 15px;
  }

  .device_content >>> .el-tabs__active-bar {
    width: 60px !important;
  }

  .device_content >>> .el-tabs__nav-wrap::after {
    content: '';
    position: static;
  }

  .device_content >>> .el-tabs__nav-wrap {
    width: 200%;
  }

  .device_content h3 {
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
  }

  .device_content >>> .el-tabs__content {
    border: 20px solid #f0f0f0;
    margin: 0 -20px;
    padding: 0;
  }

  .device_content >>> .el-tabs__nav-scroll {
    overflow: unset;
  }

  .device_content .monitor, .device_content .config {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .device_content >>> .el-table {
    padding: 20px;
  }

  .monitor > p, .config > p {
    width: 33%;
    margin: 10px 0;
  }

  .monitor > p > span, .config > p > span {
    display: block;
    margin: 10px 0;
  }


</style>
