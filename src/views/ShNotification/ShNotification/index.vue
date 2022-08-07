<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="通知操作" prop="notificationUidAction">
        <el-input
          v-model="queryParams.notificationUidAction"
          placeholder="请输入通知操作"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="附带的主题 id" prop="notificationUidSubjectId">
        <el-input
          v-model="queryParams.notificationUidSubjectId"
          placeholder="请输入附带的主题 id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户 id" prop="notificationUid">
        <el-input
          v-model="queryParams.notificationUid"
          placeholder="请输入用户 id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发送通知者 id" prop="notificationUidFromUid">
        <el-input
          v-model="queryParams.notificationUidFromUid"
          placeholder="请输入发送通知者 id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通知阅读时间" prop="notificationUidReadAt">
        <el-date-picker clearable
          v-model="queryParams.notificationUidReadAt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择通知阅读时间">
        </el-date-picker>
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
          v-hasPermi="['ShNotification:ShNotification:add']"
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
          v-hasPermi="['ShNotification:ShNotification:edit']"
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
          v-hasPermi="['ShNotification:ShNotification:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ShNotification:ShNotification:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ShNotificationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="通知自增 id" align="center" prop="nid" />
      <el-table-column label="通知操作" align="center" prop="notificationUidAction" />
      <el-table-column label="附带的主题 id" align="center" prop="notificationUidSubjectId" />
      <el-table-column label="用户 id" align="center" prop="notificationUid" />
      <el-table-column label="发送通知者 id" align="center" prop="notificationUidFromUid" />
      <el-table-column label="通知阅读时间" align="center" prop="notificationUidReadAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.notificationUidReadAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ShNotification:ShNotification:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ShNotification:ShNotification:remove']"
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

    <!-- 添加或修改通知对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="通知操作" prop="notificationUidAction">
          <el-input v-model="form.notificationUidAction" placeholder="请输入通知操作" />
        </el-form-item>
        <el-form-item label="附带的主题 id" prop="notificationUidSubjectId">
          <el-input v-model="form.notificationUidSubjectId" placeholder="请输入附带的主题 id" />
        </el-form-item>
        <el-form-item label="用户 id" prop="notificationUid">
          <el-input v-model="form.notificationUid" placeholder="请输入用户 id" />
        </el-form-item>
        <el-form-item label="发送通知者 id" prop="notificationUidFromUid">
          <el-input v-model="form.notificationUidFromUid" placeholder="请输入发送通知者 id" />
        </el-form-item>
        <el-form-item label="通知阅读时间" prop="notificationUidReadAt">
          <el-date-picker clearable
            v-model="form.notificationUidReadAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择通知阅读时间">
          </el-date-picker>
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
import { listShNotification, getShNotification, delShNotification, addShNotification, updateShNotification } from "@/api/ShNotification/ShNotification";

export default {
  name: "ShNotification",
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
      // 通知表格数据
      ShNotificationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        notificationUidAction: null,
        notificationUidSubjectId: null,
        notificationUid: null,
        notificationUidFromUid: null,
        notificationUidReadAt: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        notificationUidAction: [
          { required: true, message: "通知操作不能为空", trigger: "blur" }
        ],
        notificationUidSubjectId: [
          { required: true, message: "附带的主题 id不能为空", trigger: "blur" }
        ],
        notificationUid: [
          { required: true, message: "用户 id不能为空", trigger: "blur" }
        ],
        notificationUidFromUid: [
          { required: true, message: "发送通知者 id不能为空", trigger: "blur" }
        ],
        notificationUidReadAt: [
          { required: true, message: "通知阅读时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询通知列表 */
    getList() {
      this.loading = true;
      listShNotification(this.queryParams).then(response => {
        this.ShNotificationList = response.rows;
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
        nid: null,
        notificationUidAction: null,
        notificationUidSubjectId: null,
        notificationUid: null,
        notificationUidFromUid: null,
        notificationUidReadAt: null
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
      this.ids = selection.map(item => item.nid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加通知";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const nid = row.nid || this.ids
      getShNotification(nid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改通知";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.nid != null) {
            updateShNotification(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShNotification(this.form).then(response => {
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
      const nids = row.nid || this.ids;
      this.$modal.confirm('是否确认删除通知编号为"' + nids + '"的数据项？').then(function() {
        return delShNotification(nids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ShNotification/ShNotification/export', {
        ...this.queryParams
      }, `ShNotification_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
