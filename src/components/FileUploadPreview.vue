<template>
  <div class="file-upload-preview">
<!--    :on-success="handleSuccess"-->
    <el-upload
        class="upload-container"
        :http-request="uploadRequest"
        :file-list="uploadList"
        :before-upload="beforeUpload"
        :limit="5"
        multiple
        list-type="text"
    >
      <el-button size="medium" type="primary">点击上传</el-button>
    </el-upload>

    <el-table :data="fileList" class="file-list-table" border fit  style="width: 100%">
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
          prop="fileName"
          label="文件名称"
      />
      <el-table-column
          prop="creationTime"
          label="上传时间"
      >
        <template #default="{ row }">
          {{ new Date(row.creationTime).toLocaleString() }}
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
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        width="120"-->
<!--      >-->
<!--        <template #default="{ row }">-->
<!--          <el-button-->
<!--            size="small"-->
<!--            type="text"-->
<!--            @click="conver2Pdf(row)"-->
<!--          >2Pdf</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="二维码" width="120">
        <template #default="{ row }">
          <div v-if="row.fileQrcode">
            <img  :src="row.fileQrcode" alt="二维码" style="max-width: 100px; max-height: 100px;" @click="previewQr(row.fileQrcode)">
          </div>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" @click="downloadFile(row.fileUrl,row.fileName)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button style="background: #ff7f7f; border-color: #ff7f7f;" type="primary" @click="beforeDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-image-viewer v-if="showViewer"
                     @close="handleViewerClose"
    :url-list ="imaList" close-on-press-escape
    >
    </el-image-viewer>
  </div>
</template>

<script setup>
import { encode as base64Encode, decode as base64Decode } from 'base-64';
import {onMounted, ref} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import QRCode from 'qrcode';
import { useRouter } from 'vue-router'
import { Base64 } from 'js-base64'
const uploadList = ref([
]);
const showViewer = ref(false);
const imaList = ref([]);
const fileList = ref([]);
const router = useRouter();
onMounted( async ()=>{
  await axios.get('http://rhwu.fun/hsbd/api/file/allFiles')
      .then((res) => {
        fileList.value = res.data;
        console.log(res.data)
      });
})
const handleViewerClose = () => {
  showViewer.value = false; // 关闭预览窗口
}

const previewQr = (base64)=>{
  imaList.value = [];
  imaList.value.push(base64)
  showViewer.value = true;
}

const downloadFile = (url,fileName)=> {
  axios.get(url, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        console.error('下载文件时出错：', error);
      });
}

const beforeDelete = (id)=> {
  ElMessageBox.confirm('确定删除该文件吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // User clicked '确定'
    deleteFile(id);
  }).catch(() => {
    // User clicked '取消'
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
}

const deleteFile = async (id) => {
  try {
    const config = {
      params: {
        id: id
      }
    };

    // 发送 DELETE 请求
    const response = await axios.delete("http://rhwu.fun/hsbd/api/file/deleteFile", config);

    // 处理成功响应
    if (response.status === 200) {
      const res = await axios.get('http://rhwu.fun/hsbd/api/file/allFiles');
      fileList.value = res.data;
      ElMessage.success("删除成功！");
    } else {
      ElMessage.error("删除失败！");
    }
  } catch (error) {
    // 处理错误响应
    console.error('Error deleting file:', error);
    ElMessage.error("删除失败！");
  }
};

const addFile = async (name,url) => {
  const base64EncodeUrl = Base64.encode(url)
  const previewUrl ='http://rhwu.fun/preview/onlinePreview?url='+encodeURIComponent(base64EncodeUrl)
  const qrCodeDataUrl = await QRCode.toDataURL(previewUrl);
  fileList.value.push({
    index: fileList.value.length,  // 自动生成序号
    fileName: name,
    creationTime: new Date().toLocaleString(),
    fileUrl: url,// 自动生成上传时间
    fileQrcode: qrCodeDataUrl
  });
  const requestBody = {
    fileName: name,
    fileUrl: url,
    fileQrcode: qrCodeDataUrl
  };
  const response = await axios.post('http://rhwu.fun/hsbd/api/file/saveFile', requestBody);
  if (response.status == 200){
    ElMessage.success("保存文件成功！");
  }else {
    ElMessage.error("保存文件失败！");
  }
  await axios.get('http://rhwu.fun/hsbd/api/file/allFiles')
      .then((res) => {
        fileList.value = res.data;
        console.log(res.data)
      });
};
const handleSuccess = (url, file) => {
  addFile(file.name, url);
};

const beforeUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    ElMessage.error('上传文件大小不能超过 5MB!');
  }
  return isLt2M;
};

const conver2Pdf = (file) => {
  const fileUrl = file.fileUrl;
  const previewUrl = `http://139.9.220.169:8100/onlinePreview?url=${encodeURIComponent(fileUrl)}`;
  // 判断文件 URL 是否以常见图片格式的后缀结尾
  const isImage = /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileUrl);
  if (isImage) {
    console.log("picture")
    // 如果是图片，使用 Element-UI 组件进行预览
    imaList.value = [];
    imaList.value.push(fileUrl)
    showViewer.value = true;
    ElMessage.success("预览图片成功！");
  } else {
    // 如果不是图片，使用新窗口打开在线预览链接
    window.open(previewUrl, '_blank');
  }
};


const handlePreview = (file) => {
  const fileUrl = file.fileUrl;
  const base64EncodeUrl = Base64.encode(fileUrl)
  window.open('http://rhwu.fun/preview/onlinePreview?url='+encodeURIComponent(base64EncodeUrl));
  // router.push({ name: 'FileView', query: { url: fileUrl } });
};

const uploadRequest = async ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axios.post('http://rhwu.fun/hsbd/file/addFile', formData, {
    });
    if (response.status == 200){
      const data = response.data
      handleSuccess(data, file);
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
