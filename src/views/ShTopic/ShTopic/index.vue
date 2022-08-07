<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="话题标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入话题标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论总数" prop="commentCount">
        <el-input
          v-model="queryParams.commentCount"
          placeholder="请输入评论总数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发帖时间" prop="topicTime">
        <el-date-picker clearable
          v-model="queryParams.topicTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择发帖时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建者 id" prop="topicUid">
        <el-input
          v-model="queryParams.topicUid"
          placeholder="请输入创建者 id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属板块 id" prop="topicCategoryId">
        <el-input
          v-model="queryParams.topicCategoryId"
          placeholder="请输入所属板块 id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属标签 id" prop="topicTagId">
        <el-input
          v-model="queryParams.topicTagId"
          placeholder="请输入所属标签 id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="浏览量" prop="browseCount">
        <el-input
          v-model="queryParams.browseCount"
          placeholder="请输入浏览量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="点赞数目" prop="thumbsUp">
        <el-input
          v-model="queryParams.thumbsUp"
          placeholder="请输入点赞数目"
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
          v-hasPermi="['ShTopic:ShTopic:add']"
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
          v-hasPermi="['ShTopic:ShTopic:edit']"
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
          v-hasPermi="['ShTopic:ShTopic:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ShTopic:ShTopic:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ShTopicList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="话题 id" align="center" prop="topicId" />
      <el-table-column label="话题标题" align="center" prop="title" />
      <el-table-column label="评论总数" align="center" prop="commentCount" />
      <el-table-column label="发帖时间" align="center" prop="topicTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.topicTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者 id" align="center" prop="topicUid" />
      <el-table-column label="所属板块 id" align="center" prop="topicCategoryId" />
      <el-table-column label="所属标签 id" align="center" prop="topicTagId" />
      <el-table-column label="浏览量" align="center" prop="browseCount" />
      <el-table-column label="点赞数目" align="center" prop="thumbsUp" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ShTopic:ShTopic:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ShTopic:ShTopic:remove']"
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

    <!-- 添加或修改文章对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="话题标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入话题标题" />
        </el-form-item>
        <el-form-item label="话题内容">
          <editor v-model="form.topicContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="评论总数" prop="commentCount">
          <el-input v-model="form.commentCount" placeholder="请输入评论总数" />
        </el-form-item>
        <el-form-item label="发帖时间" prop="topicTime">
          <el-date-picker clearable
            v-model="form.topicTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发帖时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建者 id" prop="topicUid">
          <el-input v-model="form.topicUid" placeholder="请输入创建者 id" />
        </el-form-item>
        <el-form-item label="所属板块 id" prop="topicCategoryId">
          <el-input v-model="form.topicCategoryId" placeholder="请输入所属板块 id" />
        </el-form-item>
        <el-form-item label="所属标签 id" prop="topicTagId">
          <el-input v-model="form.topicTagId" placeholder="请输入所属标签 id" />
        </el-form-item>
        <el-form-item label="浏览量" prop="browseCount">
          <el-input v-model="form.browseCount" placeholder="请输入浏览量" />
        </el-form-item>
        <el-form-item label="点赞数目" prop="thumbsUp">
          <el-input v-model="form.thumbsUp" placeholder="请输入点赞数目" />
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
import { listShTopic, getShTopic, delShTopic, addShTopic, updateShTopic } from "@/api/ShTopic/ShTopic";

export default {
  name: "ShTopic",
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
      // 文章表格数据
      ShTopicList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        topicContent: null,
        commentCount: null,
        topicTime: null,
        topicUid: null,
        topicCategoryId: null,
        topicTagId: null,
        browseCount: null,
        thumbsUp: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "话题标题不能为空", trigger: "blur" }
        ],
        topicContent: [
          { required: true, message: "话题内容不能为空", trigger: "blur" }
        ],
        topicUid: [
          { required: true, message: "创建者 id不能为空", trigger: "blur" }
        ],
        topicCategoryId: [
          { required: true, message: "所属板块 id不能为空", trigger: "blur" }
        ],
        topicTagId: [
          { required: true, message: "所属标签 id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文章列表 */
    getList() {
      this.loading = true;
      listShTopic(this.queryParams).then(response => {
        this.ShTopicList = response.rows;
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
        topicId: null,
        title: null,
        topicContent: null,
        commentCount: null,
        topicTime: null,
        topicUid: null,
        topicCategoryId: null,
        topicTagId: null,
        browseCount: null,
        thumbsUp: null
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
      this.ids = selection.map(item => item.topicId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文章";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const topicId = row.topicId || this.ids
      getShTopic(topicId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文章";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.topicId != null) {
            updateShTopic(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShTopic(this.form).then(response => {
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
      const topicIds = row.topicId || this.ids;
      this.$modal.confirm('是否确认删除文章编号为"' + topicIds + '"的数据项？').then(function() {
        return delShTopic(topicIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ShTopic/ShTopic/export', {
        ...this.queryParams
      }, `ShTopic_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
