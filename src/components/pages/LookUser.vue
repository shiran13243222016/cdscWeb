<template>
  <div class="lookuser">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看用户</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user">
      <div class="user_top">
        <icon name="envelope" class="icon" scale="1.4"></icon>
        <p>用户: {{loginName}}</p>
        <el-dropdown class="box_table_drop">
          <p class="mouse">......</p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="charge">补币</el-dropdown-item>
            <el-dropdown-item @click.native="profit">收益比</el-dropdown-item>
            <el-dropdown-item @click.native="disuse">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="user_middle">
        <div style="width:230px">
          <p>设备总数: {{userInfo.minerTotalCount}}</p>
          <p>创建时间: {{userInfo.create_date}}</p>
          <p>绑定交易:
            <span v-if="userInfo.bindStatus==0">未绑定交易所</span>
            <span v-if="userInfo.bindStatus==1">已绑定交易所</span>
          </p>
        </div>
        <div style="width:200px">
          <p>设备正常: {{userInfo.minerNormalCount}}</p>
          <p>设备异常: {{abnormalDevice}} </p>
          <P>累计收益: {{userInfo.totalIncome|numFormat}}</P>
        </div>
        <div  style="width:230px">
          <P>所属一级代理: {{userInfo.first}}</P>
          <P>所属二级代理: {{userInfo.second}}</P>
        </div>
        <div>
          <p>状态</p>
          <b v-if="userInfo.status==1">正常</b>
          <b v-if="userInfo.status==2">停用</b>
        </div>
        <div>
          <p>昨日收益</p>
          <b>{{yettotle|numFormat}}</b>
        </div>
      </div>
    </div>
    <div class="user_content">
      <div class="empty"></div>
      <el-tabs v-model="activeIndex">
        <el-tab-pane label="设备">
          <div class="device_handle">
            <p>设备列表</p>
            <el-input placeholder="请输入内容" v-model="input4" size="small">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <el-table :data="tableData" class="demo-table" :default-sort = "{prop: 'date', order: 'descending'}" :header-cell-style="tableHeaderColor" border stripe>
            <el-table-column prop="minerDeviceId" label="设备编号"></el-table-column>
            <el-table-column prop="account" label="Account"></el-table-column>
            <el-table-column label="设备状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.minerStatus==1">正常</span>
                  <span v-if="scope.row.minerStatus==2">停用</span>
                </template>
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="lookDevice(scope.row)" type="text">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="资产">
          <div class="profit_list">
            <el-form :inline="true">
              <el-form-item label="资产类型" size="small">
                <el-select v-model="form.recordType" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="补币" value="2"></el-option>
                  <el-option label="收益" value="1"></el-option>
                  <el-option label="提币" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="small">
                <el-button type="primary" @click="getData('init')">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table :data="tableData" class="demo-table" :default-sort = "{prop: 'date', order: 'descending'}" :header-cell-style="tableHeaderColor" border stripe>
            <el-table-column prop="amount" label="资产记录" sortable>
<!--          <template slot-scope="scope">-->
<!--            <span v-if="scope.row."></span>-->
<!--          </template>-->
            </el-table-column>
            <el-table-column label="资产类型">
              <template slot-scope="scope">
                <span v-if="scope.row.recordType==1">收益</span>
                <span v-if="scope.row.recordType==2">补币</span>
                <span v-if="scope.row.recordType==3">返佣</span>
                <span v-if="scope.row.recordType==4">提币</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="时间" sortable></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <v-Paging></v-Paging>
    </div>
    <vProfitSupply ref="ProfitSupply" @recharge="recharge"></vProfitSupply>
    <vOruse ref="Oruse" @recharge="recharge"></vOruse>
  </div>
</template>

<script>
  import base from '@/components/common/base.vue';
  import vProfitSupply from  '@/components/common/Dialog/ProfitSupply.vue'
  import vOruse from '@/components/common/Dialog/Oruse.vue'
	export default {
  	mixins: [base],
		name: "lookUser",
    data(){
      return {
        input4: '',
        userInfo:{},
        incomelist:[],
        form:{
          recordType:''
        },
				activeIndex: 0
      }
    },
    components: {
      vProfitSupply,
      vOruse
    },
    computed: {
      abnormalDevice(){
        return this.userInfo.minerTotalCount - this.userInfo.minerNormalCount
      },
      yettotle(){
        return this.userInfo.yesterdayIncome+this.userInfo.rechargeYes
      },
      query(){
				return this.$route.query
      },
			loginName(){
				return this.$route.query.name
      }
    },
    created() {
      this.getUserInfo();
    },
    watch: {
			activeIndex(curVal,oldVal){
				this.getData();
      }
    },
    methods: {
      recharge(code){
        if(code==200){
          this.getData();
          this.getUserInfo();
        }
      },
      // open补币
      charge(){
        let parentDate = {
          show: 'supply',
          id:this.query.id,
          user:this.query.name
        };
        this.$refs.ProfitSupply.param(parentDate)
      },
      //收益比
      profit(){
        let parentDate = {
          show: 'profit',
          userId: this.query.id,
          user: this.query.name
        };
        this.$refs.ProfitSupply.param(parentDate)
      },
      // open停用
      disuse() {
        this.$prompt('请输入安全密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/,
          inputType:'password',
          inputErrorMessage: '密码需8~20位，不能为纯数字和纯字母'
        }).then(({ value }) => {
          const urls= '/user/stop';
          let params={
            id:this.$route.query.id,
            safePassword:value
          };
          this.RequestAjax('GET_LIST',urls,params)
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      lookDevice(row){
        this.$router.push({
          path:'/lookDevice',
          query:{
            id:row.id
          }
        })
      },
      // 获取矿机用户详情
      getUserInfo(){
        let params = {
          id: this.query.id
        };
        this.RestClient('GET_LIST', '/user/minerUserInfo', params).then((res) => {
          if(res.data.code==200){
            this.userInfo=res.data.data;
          }
        })
      },
			getData(e){
				let url = '';
				let params = {};
        (e=='init')?this.$store.dispatch('initiValue'):'';
				if(this.activeIndex == 0){
					url = '/device/list';
					params = {
						userId: this.query.id,
						loginName: this.query.name,
						pageNo: this.pager.page,
						pageSize: this.pager.perPage
					};
        }
				if(this.activeIndex == 1){
					url = '/wallet/records';
					params = {
						userId: this.query.id,
						pageNo: this.pager.page,
						pageSize: this.pager.perPage,
						recordType: this.form.recordType
					};
        }
				params =_.omitBy(params,(value)=>{return _.isUndefined(value) || _.isNull(value) || value === ""});
				this.RestClient('GET_LIST',url,params).then((res)=>{
					if(res.data.code==200){
						//console.log(res.data.data);
						this.$store.dispatch('tableData',res.data.data);
					}
				})
      }
    }
  }
</script>

<style scoped>
    .lookuser {
        background: #fff;
        padding: 20px 20px 0 20px;
        margin-left: -10px;
        margin-right: -10px;
        margin-top: -9px;
    }
    .lookuser>.el-breadcrumb{
        margin-bottom: 20px;

    }
    .user_top{
        display: flex;
        align-items: center;
        margin: 20px 0;
    }
    .user{
        padding-right: 20px;
    }
    .user_top>p{
        margin-left: 10px;
        margin-right: auto;
        font-size: 22px;
        font-weight: bolder;
    }
    .user_top>>>.mouse{
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 12px;
        padding: 2px 15px;
        line-height: 20px;
        cursor: pointer;
    }
    .user_middle{
        display: flex;
    }
    .user_middle div{
        margin-left: 32px;
    }
    .user_middle>:nth-child(4){
        margin-left: auto;
      width:160px;
      text-align: right;
    }
    .user_middle>:nth-child(5){
      margin-left: auto;
      width:160px;
      text-align: right;
    }
    .user_middle p{
        font-size: 14px;
        margin-top: 10px;
        color: rgb(93,93,93);
    }
    .user_middle b{
        font-size: 20px;
        font-weight: normal;
        display:block;
        width:160px;
        overflow:hidden;
        word-break:keep-all;
        white-space:nowrap;
        text-overflow:ellipsis;
    }

    .user_content{
        margin-top: 30px;
        position: relative;
    }
    .user_content>.empty{
        background: #f0f0f0;
        position:absolute;
        left:-20px;
        right:-20px;
        top:40px;
        height:10px;
    }
    .user_content>>>.el-tabs__nav{
         padding: 0 15px;
    }
    .user_content>>>.el-tabs__active-bar{
        width: 60px!important;
    }
    .user_content>>>.el-tabs__content{
        margin: 0 -20px;
        border-left:20px solid #f0f0f0;
        border-right:20px solid #f0f0f0;
        padding: 0 20px;
    }
    .user_content>>>.el-tabs__header{
        margin:0;
    }
    .user_content>>>.el-tabs__nav-wrap::after{
        content: '';
        position: static;
    }
    .user_content>>>.device_handle{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px 0;
        padding: 10px 0 20px 0;
        border-bottom: 1px solid #ccc;
    }
     .user_content>>>.profit_list{
         margin: 20px 0;
         padding: 10px 0 20px 0;
         border-bottom: 1px solid #ccc;
     }
    .profit_list>p{
        line-height: 24px;
    }
    .device_handle>>>.el-input{
        width: 15%;
    }
    .lookuser>>>.block{
        margin: 0 -20px;
        border-left: 20px solid #f0f0f0;
        padding: 0 20px;
        border-right: 20px solid #f0f0f0;
    }
</style>
