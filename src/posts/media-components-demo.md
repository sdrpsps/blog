---
title: 媒体组件演示
date: 2025-01-20T10:00:00+08:00
updated: 2025-01-20T10:00:00+08:00
keywords: ["组件", "演示", "图片", "视频"]
featured: true
summary: "展示图片和视频组件的功能，支持底部描述。"
image: "https://static.bytespark.me/blog/TDZeWS.jpeg"
---

# 媒体组件演示

这篇文章展示了如何使用图片和视频组件，这些组件支持底部描述功能。

## 图片组件

### 基本图片

![示例图片](https://static.bytespark.me/blog/TDZeWS.jpeg)

### 带描述的图片

![微信公众号](https://storage.guangzhengli.com/images/wechat-official-account.png "微信公众号二维码 - 扫码关注获取更多内容")

### 另一个带描述的图片

![风景照片](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800 "美丽的自然风景 - 山川河流的壮丽景色")

#### 图片使用技巧

##### 选择合适的图片格式

###### JPEG 格式
适用于照片和复杂图像。

###### PNG 格式
适用于需要透明背景的图像。

##### 优化图片大小

###### 压缩工具
使用在线工具压缩图片。

###### 尺寸调整
根据显示需求调整图片尺寸。

## 视频组件

### 基本视频

<MDXVideo 
  src="https://videos.pexels.com/video-files/4614907/4614907-uhd_2560_1440_30fps.mp4" 
  caption="这是一个示例视频，展示了视频组件的功能"
/>

### 带描述的视频

<MDXVideo 
  src="https://videos.pexels.com/video-files/4614907/4614907-uhd_2560_1440_30fps.mp4" 
  caption="演示视频 - 展示如何使用自定义视频组件"
  controls
  preload="metadata"
/>

#### 视频格式支持

##### MP4 格式
最常用的视频格式。

##### WebM 格式
现代浏览器支持的格式。

## 组件特性

### 图片组件 (img)

- ✅ 使用标准 `img` 标签
- ✅ 通过 `title` 属性添加底部描述
- ✅ 响应式设计
- ✅ 圆角边框和阴影效果
- ✅ 自动检测是否有描述

### 视频组件 (MDXVideo)

- ✅ 支持底部描述
- ✅ 内置播放控件
- ✅ 响应式设计
- ✅ 圆角边框
- ✅ 阴影效果
- ✅ 支持所有标准 video 属性

## 使用方法

### 在 MDX 中使用图片

**基本图片：**
```md
![图片描述](图片地址)
```

**带描述的图片：**
```md
![图片描述](图片地址 "底部说明文字")
```

### 在 MDX 中使用视频组件

```mdx
<MDXVideo 
  src="/path/to/video.mp4" 
  caption="视频说明文字"
  controls
  preload="metadata"
/>
```

## 样式特点

这些组件使用了 Tailwind CSS v4 的最新特性：

- 使用 OKLCH 颜色空间
- 语义化颜色变量
- 现代化的间距系统
- 优雅的过渡动画
- 无障碍访问支持

所有组件都完美集成到您的设计系统中，提供一致的用户体验。

## 注意事项

- 图片的底部描述通过 `title` 属性实现，这是 HTML 标准属性
- 视频组件使用自定义的 `MDXVideo` 组件
- 所有媒体元素都支持响应式设计
- 样式与您的设计系统保持一致

## 总结

通过使用这些组件，您可以轻松地在 MDX 内容中添加带有描述的图片和视频，提升内容的可读性和用户体验。 