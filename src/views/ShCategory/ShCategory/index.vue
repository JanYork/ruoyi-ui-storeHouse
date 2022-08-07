<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="板块标题" prop="categoryTitle">
        <el-input
          v-model="queryParams.categoryTitle"
          placeholder="请输入板块标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="板块话题数" prop="topicCount">
        <el-input
          v-model="queryParams.topicCount"
          placeholder="请输入板块话题数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="板块评论数" prop="commentCount">
        <el-input
          v-model="queryParams.commentCount"
          placeholder="请输入板块评论数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="板块描述内容" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入板块描述内容"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="板块图标" prop="categoryLogo">
        <el-input
          v-model="queryParams.categoryLogo"
          placeholder="请输入板块图标"
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
          v-hasPermi="['ShCategory:ShCategory:add']"
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
          v-hasPermi="['ShCategory:ShCategory:edit']"
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
          v-hasPermi="['ShCategory:ShCategory:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ShCategory:ShCategory:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ShCategoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="板块 id" align="center" prop="categoryId" />
      <el-table-column label="板块标题" align="center" prop="categoryTitle" />
      <el-table-column label="板块话题数" align="center" prop="topicCount" />
      <el-table-column label="板块评论数" align="center" prop="commentCount" />
      <el-table-column label="板块描述内容" align="center" prop="description" />
      <el-table-column label="板块图标" align="center" prop="categoryLogo" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ShCategory:ShCategory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ShCategory:ShCategory:remove']"
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

    <!-- 添加或修改板块对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="板块标题" prop="categoryTitle">
          <el-input v-model="form.categoryTitle" placeholder="请输入板块标题" />
        </el-form-item>
        <el-form-item label="板块话题数" prop="topicCount">
          <el-input v-model="form.topicCount" placeholder="请输入板块话题数" />
        </el-form-item>
        <el-form-item label="板块评论数" prop="commentCount">
          <el-input v-model="form.commentCount" placeholder="请输入板块评论数" />
        </el-form-item>
        <el-form-item label="板块描述内容" prop="description">
          <el-input v-model="form.description" placeholder="请输入板块描述内容" />
        </el-form-item>
        <el-form-item label="板块图标" prop="categoryLogo">
          <el-input v-model="form.categoryLogo" placeholder="请输入板块图标" />
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
import { listShCategory, getShCategory, delShCategory, addShCategory, updateShCategory } from "@/api/ShCategory/ShCategory";

export default {
  name: "ShCategory",
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
      // 板块表格数据
      ShCategoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryTitle: null,
        topicCount: null,
        commentCount: null,
        description: null,
        categoryLogo: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        categoryTitle: [
          { required: true, message: "板块标题不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "板块描述内容不能为空", trigger: "blur" }
        ],
        categoryLogo: [
          { required: true, message: "板块图标不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询板块列表 */
    getList() {
      this.loading = true;
      listShCategory(this.queryParams).then(response => {
        this.ShCategoryList = response.rows;
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
        categoryId: null,
        categoryTitle: null,
        topicCount: null,
        commentCount: null,
        description: null,
        categoryLogo: null
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
      this.ids = selection.map(item => item.categoryId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加板块";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const categoryId = row.categoryId || this.ids
      getShCategory(categoryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改板块";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.categoryId != null) {
            updateShCategory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShCategory(this.form).then(response => {
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
      const categoryIds = row.categoryId || this.ids;
      this.$modal.confirm('是否确认删除板块编号为"' + categoryIds + '"的数据项？').then(function() {
        return delShCategory(categoryIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ShCategory/ShCategory/export', {
        ...this.queryParams
      }, `ShCategory_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
