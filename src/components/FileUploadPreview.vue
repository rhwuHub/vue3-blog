<template>
  <div class="file-upload-preview">
    <el-upload
        class="upload-container"
        :http-request="uploadRequest"
        :file-list="uploadList"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :limit="5"
        multiple
        list-type="text"
    >
      <el-button size="medium" type="primary">点击上传</el-button>
    </el-upload>

    <el-table :data="fileList" class="file-list-table" border  style="width: 100%">
      <el-table-column
          prop="index"
          label="序号"
          width="50"
      >
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="文件名称"
      />
      <el-table-column
          prop="uploadDate"
          label="上传时间"
      >
        <template #default="{ row }">
          {{ new Date(row.uploadDate).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          width="120"
      >
        <template #default="{ row }">
          <el-button
              size="small"
              type="text"
              @click="handlePreview(row)"
          >预览</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible">
      <span>需要注意的是内容是默认不居中的</span>
      <iframe :src="dialogSrc" class="file-preview-iframe"></iframe>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios'
const uploadList = ref([
]);

const fileList = ref([
]);
const addFile = (name,url) => {
  fileList.value.push({
    index: fileList.value.length,  // 自动生成序号
    name: name,  // 自动生成文件名
    uploadDate: new Date().toLocaleString(),
    url: url// 自动生成上传时间
  });
  console.log(fileList.value);
};

const dialogVisible = ref(false);
const dialogSrc = ref('');


const handleSuccess = (response, file, fileList) => {
  console.log(response.data)
  addFile(file.name, response.data);
};

const beforeUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('上传文件大小不能超过 2MB!');
  }
  return isLt2M;
};

const handlePreview = (file) => {

  const fileUrl = file.url;

  // 判断文件 URL 是否以常见图片格式的后缀结尾
  const isImage = /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileUrl);

  if (isImage) {
    console.log("picture")
    // 如果是图片，使用 Element-UI 组件进行预览
    dialogSrc.value = fileUrl; // 设置预览图片的 URL
    dialogVisible.value = true; // 显示预览对话框
  } else {
    // 如果不是图片，使用新窗口打开在线预览链接
    const previewUrl = `http://139.9.220.169:9090/api/file/onlinePreview?url=${encodeURIComponent(fileUrl)}`;
    window.open(previewUrl, '_blank');
  }
};

const uploadRequest = async ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://139.9.220.169:9090/file/addFile', formData, {
    });
    if (response.status == 200){
      handleSuccess(response, file);
    }
  } catch (error) {
    ElMessage.error('上传失败');
  }
};
</script>

<style scoped>
.file-upload-preview {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.upload-container {
  margin-bottom: 20px;
}

.file-list-table {
  max-height: 300px;
  overflow-y: auto;
}

.file-preview-iframe {
  width: 100%;
  height: 500px;
  border: none;
}

.el-dialog {
  max-width: 80%;
  width: 80%;
  height: auto;
  padding: 0;
}

.el-dialog__body {
  padding: 0;
}
</style>
