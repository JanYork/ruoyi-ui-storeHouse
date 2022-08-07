<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="评论者 id" prop="commentUid">
        <el-input
          v-model="queryParams.commentUid"
          placeholder="请输入评论者 id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论所属话题 id" prop="commentTopicId">
        <el-input
          v-model="queryParams.commentTopicId"
          placeholder="请输入评论所属话题 id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论时间" prop="commentTime">
        <el-date-picker clearable
          v-model="queryParams.commentTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择评论时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="网络地址" prop="commentIp">
        <el-input
          v-model="queryParams.commentIp"
          placeholder="请输入网络地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="持用设备" prop="commentEquipment">
        <el-input
          v-model="queryParams.commentEquipment"
          placeholder="请输入持用设备"
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
          v-hasPermi="['ShComment:ShComment:add']"
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
          v-hasPermi="['ShComment:ShComment:edit']"
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
          v-hasPermi="['ShComment:ShComment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ShComment:ShComment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ShCommentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="评论 id" align="center" prop="commentId" />
      <el-table-column label="评论内容" align="center" prop="content" />
      <el-table-column label="评论者 id" align="center" prop="commentUid" />
      <el-table-column label="评论所属话题 id" align="center" prop="commentTopicId" />
      <el-table-column label="评论时间" align="center" prop="commentTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.commentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网络地址" align="center" prop="commentIp" />
      <el-table-column label="持用设备" align="center" prop="commentEquipment" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ShComment:ShComment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ShComment:ShComment:remove']"
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

    <!-- 添加或修改评论对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="评论内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="评论者 id" prop="commentUid">
          <el-input v-model="form.commentUid" placeholder="请输入评论者 id" />
        </el-form-item>
        <el-form-item label="评论所属话题 id" prop="commentTopicId">
          <el-input v-model="form.commentTopicId" placeholder="请输入评论所属话题 id" />
        </el-form-item>
        <el-form-item label="评论时间" prop="commentTime">
          <el-date-picker clearable
            v-model="form.commentTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择评论时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="网络地址" prop="commentIp">
          <el-input v-model="form.commentIp" placeholder="请输入网络地址" />
        </el-form-item>
        <el-form-item label="持用设备" prop="commentEquipment">
          <el-input v-model="form.commentEquipment" placeholder="请输入持用设备" />
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
import { listShComment, getShComment, delShComment, addShComment, updateShComment } from "@/api/ShComment/ShComment";

export default {
  name: "ShComment",
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
      // 评论表格数据
      ShCommentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        content: null,
        commentUid: null,
        commentTopicId: null,
        commentTime: null,
        commentIp: null,
        commentEquipment: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        content: [
          { required: true, message: "评论内容不能为空", trigger: "blur" }
        ],
        commentUid: [
          { required: true, message: "评论者 id不能为空", trigger: "blur" }
        ],
        commentTopicId: [
          { required: true, message: "评论所属话题 id不能为空", trigger: "blur" }
        ],
        commentTime: [
          { required: true, message: "评论时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询评论列表 */
    getList() {
      this.loading = true;
      listShComment(this.queryParams).then(response => {
        this.ShCommentList = response.rows;
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
        commentId: null,
        content: null,
        commentUid: null,
        commentTopicId: null,
        commentTime: null,
        commentIp: null,
        commentEquipment: null
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
      this.ids = selection.map(item => item.commentId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加评论";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const commentId = row.commentId || this.ids
      getShComment(commentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改评论";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.commentId != null) {
            updateShComment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShComment(this.form).then(response => {
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
      const commentIds = row.commentId || this.ids;
      this.$modal.confirm('是否确认删除评论编号为"' + commentIds + '"的数据项？').then(function() {
        return delShComment(commentIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ShComment/ShComment/export', {
        ...this.queryParams
      }, `ShComment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
