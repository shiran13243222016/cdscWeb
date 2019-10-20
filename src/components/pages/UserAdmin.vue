<template>
  <div class="block">
    <v-Breadcrumb :post="bread"></v-Breadcrumb>
    <div class="box">
      <el-row>
        <el-col :span="20">
          <el-form ref="form" :inline="true" :model="form" label-width="80px" class="box_form">
            <el-form-item label="用户账号:">
              <el-input v-model="form.account" size="small"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
              <el-select v-model="form.status" placeholder="请选择" size="small">
                <el-option label="全部"  value=""></el-option>
                <el-option label="正常"  value="1"></el-option>
                <el-option label="停用"  value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="check">查询</el-button>
              <el-button size="small" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" size="small" @click="inviteUser">邀请用户注册</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" :header-cell-style="tableHeaderColor" :default-sort="{prop:'create_date',order:'ascending'}" border stripe>
        <el-table-column prop="login_name" label="用户账号" min-width="150"></el-table-column>
        <el-table-column prop="total" label="总收益" min-width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">正常</span>
            <span v-if="scope.row.status==2">停用</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_date" label="注册时间" sortable width="200"></el-table-column>
      </el-table>

      <v-Paging></v-Paging>
      <vInviteUser ref="InviteUser" @childSay="parentSay"></vInviteUser>
    </div>
  </div>
</template>

<script>
  import vBreadcrumb from '@/components/common/Breadcrumb.vue';
  import base from '@/components/common/base.vue';
  import vInviteUser from '@/components/common/Dialog/InviteUser.vue';
  export default {
  	mixins: [base],
    components: {
      vBreadcrumb,
      vInviteUser,
    },
    data() {
      return {
        bread: {
          path: '/userAdmin',
          data: '用户管理'
        },
        form: {
          account: '',
          status:''
        }
      }
    },
    computed: {
      invateCode(){
        if(this.$store.state.userInfo&&this.$store.state.userInfo.userInfo){
          return this.$store.state.userInfo.userInfo.inviteCode;
        }
      }
    },
    methods: {
      // 获取用户列表
			getData(data) {
        let params = {
          userType: '8',
          pageNo: this.pager.page,
          pageSize: this.pager.perPage
        };
        if(data){
          params={
            ...params,
            ...data
          }
        }
        this.RestClient('GET_LIST', '/user/list', params).then((res) => {
					this.$store.dispatch('tableData',res.data.data);
        })
      },
      // 查询
      check() {
        let data={
          login_name: this.form.account,
          status: this.form.status
        };
        this.getData(data)
      },
      reset(){
        this.form.account="";
        this.form.status="";
				this.$store.dispatch('initiValue');
        this.getData()
      },
      // open邀请用户注册
      inviteUser(){
        let parentDate = {
          show: true,
          invateCode:this.invateCode
        };
        this.$refs.InviteUser.param(parentDate);
        this.$refs.InviteUser.isYaoFn()
      },
      // 接收子页面数据
      parentSay(msg){
        console.log(msg);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .block {
    .block_top {
      background: #fff;
      height: 70px;
      padding: 15px;
      .column {
        padding-top: 10px;
      }
    }
    .box {
      margin-top: 20px;
      background: #fff;
      padding: 20px;
      .box_form {
        padding-top: 10px;
      }
    }
  }
</style>
