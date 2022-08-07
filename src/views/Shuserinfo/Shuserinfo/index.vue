<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="昵称" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入昵称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="queryParams.password"
          placeholder="请输入密码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话号码" prop="telephoneNumber">
        <el-input
          v-model="queryParams.telephoneNumber"
          placeholder="请输入电话号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="头像地址" prop="avatarAddress">
        <el-input
          v-model="queryParams.avatarAddress"
          placeholder="请输入头像地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="eamil">
        <el-input
          v-model="queryParams.eamil"
          placeholder="请输入邮箱"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="介绍" prop="introduce">
        <el-input
          v-model="queryParams.introduce"
          placeholder="请输入介绍"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="话题数目" prop="topicCount">
        <el-input
          v-model="queryParams.topicCount"
          placeholder="请输入话题数目"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论数目" prop="commentCount">
        <el-input
          v-model="queryParams.commentCount"
          placeholder="请输入评论数目"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="nanoId唯一身份标识" prop="nanoId">
        <el-input
          v-model="queryParams.nanoId"
          placeholder="请输入nanoId唯一身份标识"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="网址" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入网址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户状态" prop="userState">
        <el-input
          v-model="queryParams.userState"
          placeholder="请输入用户状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['Shuserinfo:Shuserinfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['Shuserinfo:Shuserinfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['Shuserinfo:Shuserinfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['Shuserinfo:Shuserinfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ShuserinfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户 id" align="center" prop="uid" />
      <el-table-column label="昵称" align="center" prop="account" />
      <el-table-column label="密码" align="center" prop="password" />
      <el-table-column label="电话号码" align="center" prop="telephoneNumber" />
      <el-table-column label="头像地址" align="center" prop="avatarAddress" />
      <el-table-column label="邮箱" align="center" prop="eamil" />
      <el-table-column label="介绍" align="center" prop="introduce" />
      <el-table-column label="话题数目" align="center" prop="topicCount" />
      <el-table-column label="评论数目" align="center" prop="commentCount" />
      <el-table-column label="nanoId唯一身份标识" align="center" prop="nanoId" />
      <el-table-column label="网址" align="center" prop="url" />
      <el-table-column label="用户状态" align="center" prop="userState" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['Shuserinfo:Shuserinfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['Shuserinfo:Shuserinfo:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="昵称" prop="account">
          <el-input v-model="form.account" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="电话号码" prop="telephoneNumber">
          <el-input v-model="form.telephoneNumber" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="头像地址" prop="avatarAddress">
          <el-input v-model="form.avatarAddress" placeholder="请输入头像地址" />
        </el-form-item>
        <el-form-item label="邮箱" prop="eamil">
          <el-input v-model="form.eamil" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input v-model="form.introduce" placeholder="请输入介绍" />
        </el-form-item>
        <el-form-item label="话题数目" prop="topicCount">
          <el-input v-model="form.topicCount" placeholder="请输入话题数目" />
        </el-form-item>
        <el-form-item label="评论数目" prop="commentCount">
          <el-input v-model="form.commentCount" placeholder="请输入评论数目" />
        </el-form-item>
        <el-form-item label="nanoId唯一身份标识" prop="nanoId">
          <el-input v-model="form.nanoId" placeholder="请输入nanoId唯一身份标识" />
        </el-form-item>
        <el-form-item label="网址" prop="url">
          <el-input v-model="form.url" placeholder="请输入网址" />
        </el-form-item>
        <el-form-item label="用户状态" prop="userState">
          <el-input v-model="form.userState" placeholder="请输入用户状态" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listShuserinfo, getShuserinfo, delShuserinfo, addShuserinfo, updateShuserinfo } from "@/api/Shuserinfo/Shuserinfo";

export default {
  name: "Shuserinfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      ShuserinfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        account: null,
        password: null,
        telephoneNumber: null,
        avatarAddress: null,
        eamil: null,
        introduce: null,
        topicCount: null,
        commentCount: null,
        nanoId: null,
        url: null,
        userState: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        account: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        topicCount: [
          { required: true, message: "话题数目不能为空", trigger: "blur" }
        ],
        commentCount: [
          { required: true, message: "评论数目不能为空", trigger: "blur" }
        ],
        nanoId: [
          { required: true, message: "nanoId唯一身份标识不能为空", trigger: "blur" }
        ],
        userState: [
          { required: true, message: "用户状态不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listShuserinfo(this.queryParams).then(response => {
        this.ShuserinfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        uid: null,
        account: null,
        password: null,
        telephoneNumber: null,
        avatarAddress: null,
        eamil: null,
        introduce: null,
        createTime: null,
        topicCount: null,
        commentCount: null,
        nanoId: null,
        url: null,
        userState: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.uid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const uid = row.uid || this.ids
      getShuserinfo(uid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.uid != null) {
            updateShuserinfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShuserinfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const uids = row.uid || this.ids;
      this.$modal.confirm('是否确认删除用户编号为"' + uids + '"的数据项？').then(function() {
        return delShuserinfo(uids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('Shuserinfo/Shuserinfo/export', {
        ...this.queryParams
      }, `Shuserinfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
