# 技术详情

本文档详细介绍妙享记账小程序的技术实现细节，包括架构设计、数据结构、API设计等内容，帮助开发者更好地理解和参与项目开发。

## 架构设计

### 前端架构

妙享记账采用了 Vue 3 + uni-app 的跨平台开发架构，主要特点如下：

1. **组件化设计**
   - 遵循 Vue 组件化开发理念，将功能拆分为独立的可复用组件
   - 组件间通过 Props 和 Events 进行通信
   - 使用插槽（Slots）实现组件的灵活扩展

2. **状态管理**
   - 使用 Pinia 进行状态管理，替代了传统的 Vuex
   - 按功能模块划分 Store：用户、交易、文章等
   - 支持模块化开发和代码分割

3. **页面路由**
   - 基于 uni-app 的路由系统，支持页面间的跳转和参数传递
   - 主页面和子页面分离，提高代码组织性
   - 支持预加载功能，提升用户体验

### 数据流设计

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   用户界面      │     │   Pinia Store   │     │   数据层        │
│   (Vue组件)     │◄───►│   (状态管理)    │◄───►│   (API/本地存储)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                         ┌─────────────────┐
                         │   工具函数      │
                         │   (untils)      │
                         └─────────────────┘
```

## 数据结构

### 1. 交易记录 (Transaction)

```javascript
{
  id: "string",          // 唯一标识符
  type: "expense" | "income",  // 类型：支出或收入
  amount: number,       // 金额
  category: {
    id: "string",      // 分类ID
    name: "string",    // 分类名称
    icon: "string",    // 分类图标
    iconColor: "string" // 图标颜色
  },
  date: "string",       // 日期 (YYYY-MM-DD)
  time: "string",       // 时间 (HH:mm:ss)
  note: "string",       // 备注
  location: {           // 位置信息（可选）
    name: "string",     // 位置名称
    address: "string",  // 详细地址
    latitude: number,   // 纬度
    longitude: number   // 经度
  }
}
```

### 2. 预算 (Budget)

```javascript
{
  total: number,        // 总预算
  used: number,         // 已使用金额
  remaining: number,    // 剩余金额
  usedPercentage: number, // 使用百分比
  remainingPercentage: number, // 剩余百分比
  daily: number,        // 每日可支出金额
  remainingDays: number // 本月剩余天数
}
```

### 3. 文章 (Article)

```javascript
{
  id: "string",          // 唯一标识符
  title: "string",      // 标题
  content: "string",    // 内容
  author: {
    id: "string",      // 作者ID
    name: "string",    // 作者名称
    avatar: "string"   // 作者头像
  },
  publishDate: "string", // 发布日期
  views: number,        // 浏览量
  likes: number,        // 点赞数
  comments: number,     // 评论数
  isLiked: boolean,     // 当前用户是否点赞
  isCollected: boolean, // 当前用户是否收藏
  tags: ["string"]      // 标签
}
```

### 4. 用户 (User)

```javascript
{
  id: "string",          // 用户ID
  name: "string",       // 用户名
  avatar: "string",     // 头像URL
  email: "string",      // 邮箱（可选）
  phone: "string",      // 手机号（可选）
  registerDate: "string", // 注册日期
  settings: {           // 用户设置
    notifications: boolean, // 是否开启通知
    theme: "light" | "dark" // 主题设置
  }
}
```

## API 设计

### 1. 交易相关 API

#### 获取交易列表

```javascript
// GET /api/transactions
// 参数：
// - startDate: 开始日期
// - endDate: 结束日期
// - type: 交易类型 (expense/income/all)
// - categoryId: 分类ID（可选）
// - page: 页码
// - pageSize: 每页数量

// 返回：
{
  total: number,
  list: [Transaction]
}
```

#### 添加交易记录

```javascript
// POST /api/transactions
// 请求体：Transaction对象（不含id）

// 返回：
{
  id: "string",
  ...Transaction
}
```

#### 更新交易记录

```javascript
// PUT /api/transactions/:id
// 请求体：要更新的字段

// 返回：
{
  ...Transaction
}
```

#### 删除交易记录

```javascript
// DELETE /api/transactions/:id

// 返回：
{
  success: boolean
}
```

### 2. 预算相关 API

#### 获取预算信息

```javascript
// GET /api/budget/:year/:month

// 返回：
{
  ...Budget
}
```

#### 更新预算

```javascript
// PUT /api/budget/:year/:month
// 请求体：
{
  total: number
}

// 返回：
{
  ...Budget
}
```

### 3. 文章相关 API

#### 获取文章列表

```javascript
// GET /api/articles
// 参数：
// - page: 页码
// - pageSize: 每页数量
// - tag: 标签（可选）
// - sortBy: 排序方式 (latest/popular)

// 返回：
{
  total: number,
  list: [Article]
}
```

#### 获取文章详情

```javascript
// GET /api/articles/:id

// 返回：
{
  ...Article
}
```

#### 发布文章

```javascript
// POST /api/articles
// 请求体：
{
  title: "string",
  content: "string",
  tags: ["string"]
}

// 返回：
{
  id: "string",
  ...Article
}
```

#### 点赞/取消点赞

```javascript
// POST /api/articles/:id/like

// 返回：
{
  success: boolean,
  likes: number,
  isLiked: boolean
}
```

## 核心组件

### 1. tranBillVue

**功能**：展示单条交易记录的卡片组件

**Props**：

- `data`: 交易记录数据

**Slots**：

- `default`: 自定义图标
- `note`: 备注内容

### 2. dialogVue

**功能**：弹窗组件，用于显示各种对话框

**Props**：

- `title`: 弹窗标题
- `v-model`: 控制弹窗显示/隐藏

**Slots**：

- `default`: 弹窗内容

### 3. classifyCardVue

**功能**：分类选择组件，用于记账时选择分类

**Props**：

- `type`: 交易类型 (expense/income)
- `id`: 当前选中的分类ID

**Events**：

- `newItem`: 选择分类时触发

### 4. searchVue

**功能**：搜索/输入组件，支持自定义样式和行为

**Props**：

- `v-model`: 输入值
- `isInput`: 是否为输入模式
- `placeholder`: 占位文本
- `size`: 字体大小
- `isBorder`: 是否显示边框

**Events**：

- `lfocus`: 聚焦事件
- `lblur`: 失焦事件

## 工具函数

### 1. 日期处理

```javascript
// 获取当月天数和剩余天数
daysInMonth() // 返回 { days: number, remainingDays: number }

// 格式化日期
formatDate(date, format) // 返回格式化后的日期字符串

// 格式化时间
formatTime(time) // 返回格式化后的时间字符串
```

### 2. 金额处理

```javascript
// 格式化金额，保留两位小数
formatAmount(amount) // 返回格式化后的金额字符串

// 计算百分比
calculatePercentage(part, total) // 返回百分比数值
```

### 3. 提示信息

```javascript
// 显示提示消息
showToast(title, (type = 'success')) // 显示成功/错误提示
```

### 4. 位置服务

```javascript
// 获取用户当前位置
getUserLocation(mapKey) // 返回位置信息Promise
```

## 开发与调试

### 调试技巧

1. **使用微信开发者工具调试**
   - 可以查看控制台日志、网络请求、存储数据等
   - 支持断点调试和性能分析

2. **使用 HBuilderX 调试**
   - 支持真机调试和模拟器调试
   - 提供代码热更新功能，提高开发效率

3. **调试 API 请求**
   - 当前使用模拟数据，可以在 `MXJZdata` 文件夹中修改
   - 实际项目中可以使用 Mock.js 或 Easy Mock 等工具模拟 API

### 常见问题

1. **地图定位失败**
   - 检查高德地图 API Key 是否正确
   - 确保小程序已获得位置权限
   - 检查网络连接

2. **样式不生效**
   - 检查 SCSS 语法是否正确
   - 确认样式选择器优先级
   - 检查是否有样式冲突

3. **组件通信问题**
   - 确认 Props 名称和类型是否匹配
   - 检查事件名称是否正确
   - 使用 Vue DevTools 检查组件状态

## 部署与发布

### 构建流程

1. **开发环境构建**

   ```bash
   npm run dev:mp-weixin
   ```

2. **生产环境构建**
   ```bash
   npm run build:mp-weixin
   ```

### 发布流程

1. **构建生产版本**

   ```bash
   npm run build:mp-weixin
   ```

2. **上传代码**
   - 打开微信开发者工具
   - 导入构建后的代码包（`unpackage/dist/build/mp-weixin`）
   - 填写版本号和更新日志
   - 点击「上传」按钮

3. **提交审核**
   - 登录微信公众平台
   - 进入「版本管理」
   - 选择刚刚上传的版本，提交审核

4. **发布上线**
   - 审核通过后，将版本发布到线上

## 性能优化

### 1. 页面加载优化

- **图片优化**：使用适当尺寸的图片，考虑使用 WebP 格式
- **代码分割**：按需加载页面和组件
- **预加载**：使用 uni-app 的预加载功能，提升页面切换速度

### 2. 渲染性能优化

- **使用虚拟列表**：处理大量数据时，使用虚拟列表减少 DOM 节点
- **避免不必要的重渲染**：合理使用 `v-if` 和 `v-show`，避免频繁更新
- **使用计算属性**：缓存计算结果，避免重复计算

### 3. 网络优化

- **减少请求次数**：合并 API 请求，使用批量操作
- **使用缓存**：合理使用本地存储缓存数据，减少网络请求
- **压缩数据**：使用 gzip 等压缩技术，减少数据传输量

## 未来规划

1. **功能扩展**
   - 支持多账户管理
   - 添加数据导出功能
   - 实现家庭共享记账
   - 添加图表分析功能

2. **技术升级**
   - 升级到最新版本的 Vue 和 uni-app
   - 优化项目结构，提高代码可维护性
   - 添加单元测试和端到端测试
   - 实现 CI/CD 流程

3. **用户体验**
   - 优化移动端适配
   - 添加深色模式支持
   - 改进表单交互，减少用户输入
   - 添加更多个性化设置

---

希望这份技术文档能帮助您更好地理解和参与妙享记账小程序项目的开发！如果您有任何问题或建议，请随时提出。
